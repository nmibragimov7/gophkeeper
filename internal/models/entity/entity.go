package entity

import "time"

type User struct {
	ID       int64  `json:"id"`
	Login    string `json:"login"`
	Password string `json:"password"`
}

type Secret struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	Type      string    `json:"type"`
	Data      []byte    `json:"data"`
	Meta      string    `json:"meta"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
