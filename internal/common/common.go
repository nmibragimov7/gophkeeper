package common

import "github.com/gin-gonic/gin"

type Handler interface {
	RegisterHandler(c *gin.Context)
	LoginHandler(c *gin.Context)
	SaveSecretHandler(c *gin.Context)
	SecretListHandler(c *gin.Context)
	UpdateSecretHandler(c *gin.Context)
	RemoveSecretHandler(c *gin.Context)
}
