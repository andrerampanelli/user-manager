package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func setupCORSTestRouter() *gin.Engine {
	r := gin.Default()
	r.Use(CORSMiddleware())
	r.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "ok"})
	})
	return r
}

func TestCORSMiddleware_GET(t *testing.T) {
	r := setupCORSTestRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/test", nil)
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	headers := w.Header()
	assert.Equal(t, "*", headers.Get("Access-Control-Allow-Origin"))
	assert.Contains(t, headers.Get("Access-Control-Allow-Methods"), "GET")
	assert.Contains(t, headers.Get("Access-Control-Allow-Headers"), "Content-Type")
}

func TestCORSMiddleware_OPTIONS(t *testing.T) {
	r := setupCORSTestRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("OPTIONS", "/test", nil)
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusNoContent, w.Code)
	headers := w.Header()
	assert.Equal(t, "*", headers.Get("Access-Control-Allow-Origin"))
	assert.Contains(t, headers.Get("Access-Control-Allow-Methods"), "OPTIONS")
	assert.Contains(t, headers.Get("Access-Control-Allow-Headers"), "Authorization")
}
