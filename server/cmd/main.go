package main

import (
	"fmt"
	"log"

	"user-manager/internal/config"
	"user-manager/internal/handler"
	"user-manager/internal/infrastructure"
	"user-manager/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Load config
	cfg := config.LoadConfig()
	fmt.Printf("Loaded DB config: %+v\n", cfg)

	// Initialize DB
	db := infrastructure.InitDB(cfg)

	infrastructure.MigrateDB(db)

	// Initialize User repository
	userRepo := repository.NewGormUserRepository(db)

	userHandler := handler.NewUserHandler(userRepo)

	r := gin.Default()
	handler.RegisterRoutes(r, userHandler)

	fmt.Println("Starting server on :8080 ...")
	r.Run(":8080")
}
