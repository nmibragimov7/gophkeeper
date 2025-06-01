package handlers

import (
	"encoding/json"
	"gophkeeper/internal/config"
	"gophkeeper/internal/models/response"
	"gophkeeper/internal/repository"
	"gophkeeper/internal/session"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

type HandlerProvider struct {
	Sugar      *zap.SugaredLogger
	Config     *config.Config
	Session    *session.SessionProvider
	Repository *repository.RepositoryProvider
}

const (
	logKeyURI       = "uri"
	logKeyIP        = "ip"
	contentType     = "Content-Type"
	applicationJSON = "application/json"
)

func sendErrorResponse(c *gin.Context, sgr *zap.SugaredLogger, code int, err error) {
	sgr.With(
		logKeyURI, c.Request.URL.Path,
		logKeyIP, c.ClientIP(),
	).Error(
		err,
	)

	message := response.Response{
		Message: http.StatusText(code),
	}

	_, err = json.Marshal(message)
	if err != nil {
		sgr.With(
			logKeyURI, c.Request.URL.Path,
			logKeyIP, c.ClientIP(),
		).Error(
			err,
		)
		return
	}

	c.Header(contentType, applicationJSON)
	c.JSON(code, message)
}
