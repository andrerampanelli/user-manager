package handler

import "github.com/gin-gonic/gin"

func RegisterRoutes(r *gin.Engine, userHandler *UserHandler) {
	r.GET("/users", userHandler.GetUsers)
	r.GET("/users/:id", userHandler.GetUser)
	r.POST("/users", userHandler.CreateUser)
	r.PUT("/users/:id", userHandler.UpdateUser)
	r.DELETE("/users/:id", userHandler.DeleteUser)
}
