package handler

import "github.com/gin-gonic/gin"

func RegisterRoutes(r *gin.Engine, userHandler *UserHandler) {
	r.GET("/users", userHandler.GetUsers)
	r.POST("/users", userHandler.CreateUser)
}
