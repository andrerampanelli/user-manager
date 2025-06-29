package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"user-manager/internal/domain"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// Persistent in-memory mock UserRepository
var mockUsers = map[uint]*domain.User{
	1: {ID: 1, Name: "Alice", Email: "alice@example.com", Age: 25},
	2: {ID: 2, Name: "Bob", Email: "bob@example.com", Age: 30},
}

// Use a struct to implement the interface
// (no mutex for simplicity, not for concurrent use)
type mockUserRepo struct{}

func (m *mockUserRepo) GetAll(offset int, limit int, search string) ([]domain.User, int64, error) {
	var users []domain.User
	for _, u := range mockUsers {
		if search == "" || contains(u.Name, search) || contains(u.Email, search) {
			users = append(users, *u)
		}
	}
	total := int64(len(users))
	if offset > len(users) {
		offset = len(users)
	}
	end := offset + limit
	if end > len(users) {
		end = len(users)
	}
	return users[offset:end], total, nil
}
func (m *mockUserRepo) GetByID(id uint) (*domain.User, error) {
	u, ok := mockUsers[id]
	if !ok {
		return nil, nil
	}
	return u, nil
}
func (m *mockUserRepo) GetByEmail(email string) (*domain.User, error) {
	for _, u := range mockUsers {
		if u.Email == email {
			return u, nil
		}
	}
	return nil, nil
}
func (m *mockUserRepo) Create(user *domain.User) error {
	user.ID = uint(len(mockUsers) + 1)
	mockUsers[user.ID] = user
	return nil
}
func (m *mockUserRepo) Update(user *domain.User) error {
	if _, ok := mockUsers[user.ID]; !ok {
		return nil
	}
	mockUsers[user.ID] = user
	return nil
}
func (m *mockUserRepo) Delete(id uint) error {
	delete(mockUsers, id)
	return nil
}

func contains(s, substr string) bool {
	return len(substr) == 0 || (len(s) > 0 && (s == substr || (len(s) >= len(substr) && (s[:len(substr)] == substr || s[len(s)-len(substr):] == substr))))
}

func setupRouter() *gin.Engine {
	repo := &mockUserRepo{}
	h := NewUserHandler(repo)
	r := gin.Default()
	RegisterRoutes(r, h)
	return r
}

func TestGetUsers(t *testing.T) {
	r := setupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/users", nil)
	r.ServeHTTP(w, req)
	assert.Equal(t, 200, w.Code)
	var resp struct {
		Users []domain.User `json:"users"`
		Total int64         `json:"total"`
		Page  int           `json:"page"`
		Limit int           `json:"limit"`
	}
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	assert.GreaterOrEqual(t, resp.Total, int64(2))
	assert.NotEmpty(t, resp.Users)
}

func TestCreateUser(t *testing.T) {
	r := setupRouter()
	w := httptest.NewRecorder()
	body := `{"name":"Charlie","email":"charlie@example.com","age":22}`
	req, _ := http.NewRequest("POST", "/users", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusCreated, w.Code)
	var user domain.User
	err := json.Unmarshal(w.Body.Bytes(), &user)
	assert.NoError(t, err)
	assert.Equal(t, "Charlie", user.Name)
	assert.Equal(t, "charlie@example.com", user.Email)
	assert.Equal(t, 22, user.Age)
}

func TestCreateUser_DuplicateEmail(t *testing.T) {
	r := setupRouter()
	w := httptest.NewRecorder()
	body := `{"name":"Alice2","email":"alice@example.com","age":23}`
	req, _ := http.NewRequest("POST", "/users", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "Email already exists")
}

func TestCreateUser_AgeValidation(t *testing.T) {
	r := setupRouter()
	w := httptest.NewRecorder()
	body := `{"name":"Young","email":"young@example.com","age":17}`
	req, _ := http.NewRequest("POST", "/users", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "Age must be greater than 18")
}

func TestGetUserByID(t *testing.T) {
	r := setupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/users/1", nil)
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	var user domain.User
	err := json.Unmarshal(w.Body.Bytes(), &user)
	assert.NoError(t, err)
	assert.Equal(t, uint(1), user.ID)
}

func TestGetUserByID_NotFound(t *testing.T) {
	r := setupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/users/9999", nil)
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Contains(t, w.Body.String(), "User not found")
}

func TestUpdateUser(t *testing.T) {
	r := setupRouter()
	w := httptest.NewRecorder()
	body := `{"name":"Alice Updated","email":"alice-updated@example.com","age":28}`
	req, _ := http.NewRequest("PUT", "/users/1", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	var user domain.User
	err := json.Unmarshal(w.Body.Bytes(), &user)
	assert.NoError(t, err)
	assert.Equal(t, "Alice Updated", user.Name)
	assert.Equal(t, "alice-updated@example.com", user.Email)
	assert.Equal(t, 28, user.Age)
}

func TestUpdateUser_NotFound(t *testing.T) {
	r := setupRouter()
	w := httptest.NewRecorder()
	body := `{"name":"Ghost","email":"ghost@example.com","age":30}`
	req, _ := http.NewRequest("PUT", "/users/9999", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Contains(t, w.Body.String(), "User not found")
}

func TestDeleteUser(t *testing.T) {
	r := setupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/users/2", nil)
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "User deleted successfully")
}

func TestDeleteUser_NotFound(t *testing.T) {
	r := setupRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/users/9999", nil)
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusNotFound, w.Code)
	assert.Contains(t, w.Body.String(), "User not found")
}
