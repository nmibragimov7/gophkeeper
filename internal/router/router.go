package router

import (
	"gophkeeper/internal/common"
	"gophkeeper/internal/config"
	"gophkeeper/internal/middleware"
	"gophkeeper/internal/repository"
	"gophkeeper/internal/session"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

type RouterProvider struct {
	Sugar      *zap.SugaredLogger
	Config     *config.Config
	Handler    common.Handler
	Session    *session.SessionProvider
	Repository *repository.RepositoryProvider
}

func (p *RouterProvider) Router() *gin.Engine {
	r := gin.Default()

	api := r.Group("/api/v1")
	api.POST("/register", p.Handler.RegisterHandler)
	api.POST("/login", p.Handler.LoginHandler)

	api.Use(middleware.AuthorizationMiddleware(p.Config))
	api.POST("/secrets", p.Handler.SaveSecretHandler)
	api.GET("/secrets", p.Handler.SecretListHandler)
	api.PUT("/secrets/:id", p.Handler.UpdateSecretHandler)
	api.DELETE("/secrets/:id", p.Handler.RemoveSecretHandler)

	return r
}
