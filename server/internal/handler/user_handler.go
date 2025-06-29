package handler

import (
	"net/http"
	"strconv"

	"user-manager/internal/domain"
	"user-manager/internal/logger"
	"user-manager/internal/repository"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	Repo repository.UserRepository
}

func NewUserHandler(repo repository.UserRepository) *UserHandler {
	return &UserHandler{Repo: repo}
}

func (h *UserHandler) GetUsers(c *gin.Context) {
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "10")
	search := c.DefaultQuery("search", "")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 10
	}
	offset := (page - 1) * limit

	users, total, err := h.Repo.GetAll(offset, limit, search)
	if err != nil {
		logger.Log.Errorf("Failed to fetch users: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"users": users,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

func (h *UserHandler) GetUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id < 1 {
		logger.Log.Warnf("Invalid user ID: %s", idStr)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	user, err := h.Repo.GetByID(uint(id))
	if err != nil {
		logger.Log.Errorf("Failed to fetch user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		return
	}
	if user == nil {
		logger.Log.Warnf("User not found: %d", id)
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) CreateUser(c *gin.Context) {
	type CreateUserRequest struct {
		Name  string `json:"name" binding:"required"`
		Email string `json:"email" binding:"required,email"`
		Age   int    `json:"age" binding:"required"`
	}
	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logger.Log.Warnf("Invalid input: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	if req.Age <= 18 {
		logger.Log.Warnf("Age validation failed: %d", req.Age)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Age must be greater than 18"})
		return
	}

	existing, err := h.Repo.GetByEmail(req.Email)
	if err != nil {
		logger.Log.Errorf("Failed to check email uniqueness: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check email uniqueness"})
		return
	}
	if existing != nil {
		logger.Log.Warnf("Email already exists: %s", req.Email)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists"})
		return
	}

	user := &domain.User{
		Name:  req.Name,
		Email: req.Email,
		Age:   req.Age,
	}
	if err := h.Repo.Create(user); err != nil {
		logger.Log.Errorf("Failed to create user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, user)
}

func (h *UserHandler) UpdateUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id < 1 {
		logger.Log.Warnf("Invalid user ID: %s", idStr)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	type UpdateUserRequest struct {
		Name  string `json:"name" binding:"required"`
		Email string `json:"email" binding:"required,email"`
		Age   int    `json:"age" binding:"required"`
	}
	var req UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logger.Log.Warnf("Invalid input: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	if req.Age <= 18 {
		logger.Log.Warnf("Age validation failed: %d", req.Age)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Age must be greater than 18"})
		return
	}

	user, err := h.Repo.GetByID(uint(id))
	if err != nil {
		logger.Log.Errorf("Failed to fetch user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		return
	}
	if user == nil {
		logger.Log.Warnf("User not found: %d", id)
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Check for email uniqueness (exclude current user)
	existing, err := h.Repo.GetByEmail(req.Email)
	if err != nil {
		logger.Log.Errorf("Failed to check email uniqueness: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check email uniqueness"})
		return
	}
	if existing != nil && existing.ID != user.ID {
		logger.Log.Warnf("Email already exists: %s", req.Email)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists"})
		return
	}

	user.Name = req.Name
	user.Email = req.Email
	user.Age = req.Age

	if err := h.Repo.Update(user); err != nil {
		logger.Log.Errorf("Failed to update user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id < 1 {
		logger.Log.Warnf("Invalid user ID: %s", idStr)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	user, err := h.Repo.GetByID(uint(id))
	if err != nil {
		logger.Log.Errorf("Failed to fetch user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		return
	}
	if user == nil {
		logger.Log.Warnf("User not found: %d", id)
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if err := h.Repo.Delete(uint(id)); err != nil {
		logger.Log.Errorf("Failed to delete user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}
