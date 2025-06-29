package repository

import (
	"testing"
	"user-manager/internal/domain"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var _ UserRepository = (*GormUserRepository)(nil)

func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to connect to in-memory sqlite: %v", err)
	}
	if err := db.AutoMigrate(&domain.User{}); err != nil {
		t.Fatalf("failed to migrate: %v", err)
	}
	return db
}

func TestGormUserRepository_CRUD(t *testing.T) {
	db := setupTestDB(t)
	repo := NewGormUserRepository(db)

	user := &domain.User{Name: "Alice", Email: "alice@example.com", Age: 25}
	// Create
	err := repo.Create(user)
	assert.NoError(t, err)
	assert.NotZero(t, user.ID)

	// GetByID
	got, err := repo.GetByID(user.ID)
	assert.NoError(t, err)
	assert.NotNil(t, got)
	assert.Equal(t, user.Email, got.Email)

	// GetByEmail
	gotByEmail, err := repo.GetByEmail(user.Email)
	assert.NoError(t, err)
	assert.NotNil(t, gotByEmail)
	assert.Equal(t, user.Name, gotByEmail.Name)

	// Update
	user.Name = "Alice Updated"
	err = repo.Update(user)
	assert.NoError(t, err)
	updated, _ := repo.GetByID(user.ID)
	assert.Equal(t, "Alice Updated", updated.Name)

	// GetAll
	users, count, err := repo.GetAll(0, 10, "Alice")
	assert.NoError(t, err)
	assert.Equal(t, int64(1), count)
	assert.Equal(t, "Alice Updated", users[0].Name)

	// Delete
	err = repo.Delete(user.ID)
	assert.NoError(t, err)
	deleted, err := repo.GetByID(user.ID)
	assert.NoError(t, err)
	assert.Nil(t, deleted)
}

func TestGormUserRepository_GetAll_SearchAndPagination(t *testing.T) {
	db := setupTestDB(t)
	repo := NewGormUserRepository(db)
	users := []domain.User{
		{Name: "Bob", Email: "bob@example.com", Age: 30},
		{Name: "Carol", Email: "carol@example.com", Age: 28},
		{Name: "Dave", Email: "dave@example.com", Age: 35},
	}
	for i := range users {
		repo.Create(&users[i])
	}
	// Search
	results, count, err := repo.GetAll(0, 10, "carol")
	assert.NoError(t, err)
	assert.Equal(t, int64(1), count)
	assert.Equal(t, "Carol", results[0].Name)
	// Pagination
	results, count, err = repo.GetAll(1, 1, "")
	assert.NoError(t, err)
	assert.Equal(t, int64(3), count)
	assert.Equal(t, 1, len(results))
}

func TestGormUserRepository_GetByID_NotFound(t *testing.T) {
	db := setupTestDB(t)
	repo := NewGormUserRepository(db)
	user, err := repo.GetByID(999)
	assert.NoError(t, err)
	assert.Nil(t, user)
}

func TestGormUserRepository_GetByEmail_NotFound(t *testing.T) {
	db := setupTestDB(t)
	repo := NewGormUserRepository(db)
	user, err := repo.GetByEmail("notfound@example.com")
	assert.NoError(t, err)
	assert.Nil(t, user)
}

func TestGormUserRepository_Create_DuplicateEmail(t *testing.T) {
	db := setupTestDB(t)
	repo := NewGormUserRepository(db)
	user1 := &domain.User{Name: "User1", Email: "dup@example.com", Age: 22}
	user2 := &domain.User{Name: "User2", Email: "dup@example.com", Age: 23}
	assert.NoError(t, repo.Create(user1))
	err := repo.Create(user2)
	assert.Error(t, err)
}

func TestGormUserRepository_Update_NonExistentUser(t *testing.T) {
	db := setupTestDB(t)
	repo := NewGormUserRepository(db)
	user := &domain.User{ID: 999, Name: "Ghost", Email: "ghost@example.com", Age: 30}
	err := repo.Update(user)
	assert.Error(t, err)
}

func TestGormUserRepository_Delete_NonExistentUser(t *testing.T) {
	db := setupTestDB(t)
	repo := NewGormUserRepository(db)
	err := repo.Delete(999)
	assert.NoError(t, err)
}
