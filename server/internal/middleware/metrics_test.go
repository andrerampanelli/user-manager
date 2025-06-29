package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/stretchr/testify/assert"
)

func setupMetricsTestRouter() *gin.Engine {
	r := gin.Default()
	r.Use(MetricsMiddleware())
	r.GET("/metrictest", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "metrics ok"})
	})
	r.GET("/metrics", gin.WrapH(promhttp.Handler()))
	return r
}

func TestMetricsMiddleware(t *testing.T) {
	r := setupMetricsTestRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/metrictest", nil)
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "metrics ok")
}

func TestMetricsEndpoint(t *testing.T) {
	r := setupMetricsTestRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/metrics", nil)
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "http_requests_total")
}
