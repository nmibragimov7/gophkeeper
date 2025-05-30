package session

import (
	"errors"
	"fmt"
	"time"

	"gophkeeper/internal/config"

	jwtv5 "github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type SessionProvider struct {
	*config.Config
}

type Session interface {
	GenerateToken(userID int64) (string, error)
	ParseToken(token string) (int64, error)
	CheckToken(token string) error
}

type Claims struct {
	jwtv5.RegisteredClaims
	UserID int64
}

var newWithClaims = jwtv5.NewWithClaims

func (p *SessionProvider) ComparePasswords(hashedPassword, password string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password)) == nil
}

func (p *SessionProvider) HashPassword(password string) (string, error) {
	pw := []byte(password)
	result, err := bcrypt.GenerateFromPassword(pw, bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(result), nil
}

func (p *SessionProvider) GenerateToken(userID int64, secret string) (string, error) {
	token := newWithClaims(jwtv5.SigningMethodHS256, Claims{
		RegisteredClaims: jwtv5.RegisteredClaims{
			ExpiresAt: jwtv5.NewNumericDate(time.Now().Add(1 * time.Hour)),
		},
		UserID: userID,
	})

	signed, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	return signed, nil
}

func (p *SessionProvider) ParseToken(token string, secret string) (int64, error) {
	if token == "" {
		return 0, errors.New("token is empty")
	}

	claims := &Claims{}
	tkn, err := jwtv5.ParseWithClaims(token, claims,
		func(t *jwtv5.Token) (interface{}, error) {
			return []byte(secret), nil
		},
	)
	if err != nil {
		return 0, fmt.Errorf("failed to parse token: %w", err)
	}

	if !tkn.Valid {
		return 0, jwtv5.ErrTokenNotValidYet
	}

	if claims.UserID == 0 {
		return 0, jwtv5.ErrInvalidKey
	}

	return claims.UserID, nil
}

func (p *SessionProvider) CheckToken(token string, secret string) error {
	claims := &Claims{}
	tkn, err := jwtv5.ParseWithClaims(token, claims,
		func(t *jwtv5.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwtv5.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
			}
			return []byte(secret), nil
		},
	)
	if err != nil {
		return fmt.Errorf("failed to parse token: %w", err)
	}

	if !tkn.Valid {
		return jwtv5.ErrTokenNotValidYet
	}

	if claims.UserID == 0 {
		return jwtv5.ErrInvalidKey
	}

	return nil
}
