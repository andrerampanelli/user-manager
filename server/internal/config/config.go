package config

import (
	"os"
)

type DBConfig struct {
	User     string
	Password string
	Host     string
	Port     string
	Name     string
}

func LoadConfig() DBConfig {
	return DBConfig{
		User:     os.Getenv("DB_USER"),
		Password: os.Getenv("DB_PASSWORD"),
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		Name:     os.Getenv("DB_NAME"),
	}
}
