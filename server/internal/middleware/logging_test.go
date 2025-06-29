package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func setupLoggingTestRouter() *gin.Engine {
	r := gin.Default()
	r.Use(LoggingMiddleware())
	r.GET("/logtest", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "logged"})
	})
	return r
}

func TestLoggingMiddleware(t *testing.T) {
	r := setupLoggingTestRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/logtest", nil)
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "logged")
}
