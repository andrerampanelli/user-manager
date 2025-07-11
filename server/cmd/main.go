package main

import (
	"fmt"
	"log"
	"user-manager/internal/config"
	"user-manager/internal/handler"
	"user-manager/internal/infrastructure"
	"user-manager/internal/middleware"
	"user-manager/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/prometheus/client_golang/prometheus/promhttp"
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

	// Set up Gin server and routes
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.CORSMiddleware())
	r.Use(middleware.LoggingMiddleware())
	r.Use(middleware.MetricsMiddleware())
	userHandler := handler.NewUserHandler(userRepo)

	handler.RegisterRoutes(r, userHandler)

	r.GET("/metrics", gin.WrapH(promhttp.Handler()))

	r.GET("/healthz", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	r.GET("/readyz", func(c *gin.Context) {
		db, err := db.DB()
		if err != nil || db.Ping() != nil {
			c.JSON(500, gin.H{"status": "not ready"})
			return
		}
		c.JSON(200, gin.H{"status": "ready"})
	})

	fmt.Println("Starting server on :8080 ...")
	r.Run(":8080")
}
