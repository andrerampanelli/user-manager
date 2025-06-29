package config

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestLoadConfig(t *testing.T) {
	t.Setenv("DB_USER", "testuser")
	t.Setenv("DB_PASSWORD", "testpass")
	t.Setenv("DB_HOST", "localhost")
	t.Setenv("DB_PORT", "1234")
	t.Setenv("DB_NAME", "testdb")

	cfg := LoadConfig()
	assert.Equal(t, "testuser", cfg.User)
	assert.Equal(t, "testpass", cfg.Password)
	assert.Equal(t, "localhost", cfg.Host)
	assert.Equal(t, "1234", cfg.Port)
	assert.Equal(t, "testdb", cfg.Name)
}

func TestLoadConfig_MissingEnv(t *testing.T) {
	t.Setenv("DB_USER", "")
	t.Setenv("DB_PASSWORD", "")
	t.Setenv("DB_HOST", "")
	t.Setenv("DB_PORT", "")
	t.Setenv("DB_NAME", "")

	cfg := LoadConfig()
	assert.Equal(t, "", cfg.User)
	assert.Equal(t, "", cfg.Password)
	assert.Equal(t, "", cfg.Host)
	assert.Equal(t, "", cfg.Port)
	assert.Equal(t, "", cfg.Name)
}
