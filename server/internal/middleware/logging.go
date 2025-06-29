package middleware

import (
	"bytes"
	"io"
	"time"

	"user-manager/internal/logger"

	"github.com/gin-gonic/gin"
)

type bodyWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (w bodyWriter) Write(b []byte) (int, error) {
	w.body.Write(b)
	return w.ResponseWriter.Write(b)
}

func LoggingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		// Read request body
		var reqBody []byte
		if c.Request.Body != nil {
			reqBody, _ = io.ReadAll(c.Request.Body)
			c.Request.Body = io.NopCloser(bytes.NewBuffer(reqBody))
		}

		// Capture response body
		bw := &bodyWriter{body: bytes.NewBufferString(""), ResponseWriter: c.Writer}
		c.Writer = bw

		c.Next()

		latency := time.Since(start)
		status := c.Writer.Status()

		logger.Log.WithFields(map[string]interface{}{
			"status":   status,
			"method":   c.Request.Method,
			"path":     c.Request.URL.Path,
			"latency":  latency,
			"req_body": string(reqBody),
			"res_body": bw.body.String(),
		}).Info("request completed")
	}
}
