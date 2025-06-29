package infrastructure

import (
	"log"
	"user-manager/internal/domain"

	"gorm.io/gorm"
)

func MigrateDB(db *gorm.DB) {
	err := db.AutoMigrate(&domain.User{})
	if err != nil {
		log.Fatalf("Failed to auto-migrate User model: %v", err)
	}
}
