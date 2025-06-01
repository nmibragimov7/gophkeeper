package handlers

import (
	"errors"
	"gophkeeper/internal/models/entity"
	"gophkeeper/internal/models/response"
	"gophkeeper/internal/utils"
	"io"
	"mime/multipart"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (p *HandlerProvider) SaveSecretHandler(c *gin.Context) {
	user, ok := c.Get("user_id")
	if !ok {
		sendErrorResponse(c, p.Sugar, http.StatusUnauthorized, errors.New("user id not found"))
		return
	}
	userID, ok := user.(int64)
	if !ok {
		sendErrorResponse(c, p.Sugar, http.StatusInternalServerError, errors.New("invalid user_id type"))
		return
	}

	secretType := c.PostForm("type")
	meta := c.PostForm("meta")

	var data []byte
	switch secretType {
	case "card":
		cardData := c.PostForm("data")
		data = []byte(cardData)
	case "file":
		file, _, err := c.Request.FormFile("data")
		if err != nil {
			sendErrorResponse(c, p.Sugar, http.StatusBadRequest, err)
			return
		}
		defer func(file multipart.File) {
			err = file.Close()
			if err != nil {
				p.Sugar.Errorw(
					"failed to close file",
					"error", err.Error(),
				)
			}
		}(file)
		data, err = io.ReadAll(file)
		if err != nil {
			sendErrorResponse(c, p.Sugar, http.StatusInternalServerError, err)
			return
		}
	default:
		sendErrorResponse(c, p.Sugar, http.StatusBadRequest, errors.New("invalid type"))
		return
	}

	encryptedData, err := utils.EncryptAES([]byte(*p.Config.MasterKey), data)
	if err != nil {
		sendErrorResponse(c, p.Sugar, http.StatusInternalServerError, err)
		return
	}

	secret := &entity.Secret{
		UserID: userID,
		Type:   secretType,
		Data:   encryptedData,
		Meta:   meta,
	}

	id, err := p.Repository.SaveSecret(secret)
	if err != nil {
		sendErrorResponse(c, p.Sugar, http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, response.Secret{ID: id})
}

func (p *HandlerProvider) SecretListHandler(c *gin.Context) {
	user, ok := c.Get("user_id")
	meta := c.Query("meta")
	if !ok {
		sendErrorResponse(c, p.Sugar, http.StatusUnauthorized, errors.New("user id not found"))
		return
	}
	userID, ok := user.(int64)
	if !ok {
		sendErrorResponse(c, p.Sugar, http.StatusInternalServerError, errors.New("invalid user_id type"))
		return
	}

	secrets, err := p.Repository.GetSecrets(userID, meta)
	if err != nil {
		sendErrorResponse(c, p.Sugar, http.StatusInternalServerError, err)
		return
	}

	records := make([]entity.Secret, 0, len(secrets))
	for _, secret := range secrets {
		data, err := utils.DecryptAES([]byte(*p.Config.MasterKey), secret.Data)
		if err != nil {
			sendErrorResponse(c, p.Sugar, http.StatusInternalServerError, err)
			return
		}

		records = append(records, entity.Secret{
			ID:        secret.ID,
			UserID:    secret.UserID,
			Type:      secret.Type,
			Data:      data,
			Meta:      secret.Meta,
			CreatedAt: secret.CreatedAt,
			UpdatedAt: secret.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, records)
}

func (p *HandlerProvider) UpdateSecretHandler(c *gin.Context) {
	user, ok := c.Get("user_id")
	if !ok {
		sendErrorResponse(c, p.Sugar, http.StatusUnauthorized, errors.New("user id not found"))
		return
	}
	userID, ok := user.(int64)
	if !ok {
		sendErrorResponse(c, p.Sugar, http.StatusInternalServerError, errors.New("invalid user_id type"))
		return
	}

	secretID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		sendErrorResponse(c, p.Sugar, http.StatusBadRequest, err)
		return
	}

	secretType := c.PostForm("type")
	meta := c.PostForm("meta")

	var data []byte
	var withData bool
	switch secretType {
	case "card":
		cardData := c.PostForm("data")
		data = []byte(cardData)

		if cardData != "" {
			withData = true
		}
	case "file":
		file, _, err := c.Request.FormFile("data")
		if err != nil {
			if errors.Is(err, http.ErrMissingFile) {
				break
			}

			sendErrorResponse(c, p.Sugar, http.StatusBadRequest, err)
			return
		}
		if file != nil {
			defer func(file multipart.File) {
				err = file.Close()
				if err != nil {
					p.Sugar.Errorw(
						"failed to close file",
						"error", err.Error(),
					)
				}
			}(file)
			data, err = io.ReadAll(file)
			if err != nil {
				sendErrorResponse(c, p.Sugar, http.StatusInternalServerError, err)
				return
			}

			withData = true
		}
	default:
		sendErrorResponse(c, p.Sugar, http.StatusBadRequest, errors.New("invalid type"))
		return
	}

	var encryptedData []byte
	if withData {
		encryptedData, err = utils.EncryptAES([]byte(*p.Config.MasterKey), data)
		if err != nil {
			sendErrorResponse(c, p.Sugar, http.StatusInternalServerError, err)
			return
		}
	}

	secret := &entity.Secret{
		UserID: userID,
		Type:   secretType,
		Meta:   meta,
	}
	if withData {
		secret.Data = encryptedData
	}

	id, err := p.Repository.UpdateSecret(userID, secretID, secret, withData)
	if err != nil {
		sendErrorResponse(c, p.Sugar, http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, response.Secret{ID: id})
}

func (p *HandlerProvider) RemoveSecretHandler(c *gin.Context) {
	user, ok := c.Get("user_id")
	if !ok {
		sendErrorResponse(c, p.Sugar, http.StatusUnauthorized, errors.New("user id not found"))
		return
	}
	userID, ok := user.(int64)
	if !ok {
		sendErrorResponse(c, p.Sugar, http.StatusInternalServerError, errors.New("invalid user_id type"))
		return
	}

	secretID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		sendErrorResponse(c, p.Sugar, http.StatusBadRequest, err)
		return
	}

	id, err := p.Repository.RemoveSecret(userID, secretID)
	if err != nil {
		sendErrorResponse(c, p.Sugar, http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, response.Secret{ID: id})
}
