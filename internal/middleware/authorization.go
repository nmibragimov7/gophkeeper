package middleware

import (
	"gophkeeper/internal/config"
	"gophkeeper/internal/session"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

const errorKey = "error"

func AuthorizationMiddleware(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		auth := c.GetHeader("Authorization")
		if !strings.HasPrefix(auth, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{errorKey: "missing or invalid Authorization header"})
			return
		}
		tokenStr := strings.TrimPrefix(auth, "Bearer ")
		ssp := session.SessionProvider{Config: cfg}

		userID, err := ssp.ParseToken(tokenStr, *cfg.SecretKey)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{errorKey: "invalid token"})
			return
		}
		c.Set("user_id", userID)
		c.Next()
	}
}
