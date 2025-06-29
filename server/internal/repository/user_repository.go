package repository

import "user-manager/internal/domain"

// UserRepository defines the interface for user storage
// This allows swapping implementations (e.g., MySQL, MongoDB)
type UserRepository interface {
	GetAll(offset int, limit int, search string) ([]domain.User, int64, error)
	GetByID(id uint) (*domain.User, error)
	GetByEmail(email string) (*domain.User, error)
	Create(user *domain.User) error
	Update(user *domain.User) error
	Delete(id uint) error
}
