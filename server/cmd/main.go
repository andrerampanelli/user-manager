package main

import (
	"fmt"
	"log"

	"user-manager/internal/config"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	cfg := config.LoadConfig()
	fmt.Printf("Loaded DB config: %+v\n", cfg)
}
