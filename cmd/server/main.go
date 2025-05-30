package main

import (
	"fmt"
	"gophkeeper/internal/handlers"
	"gophkeeper/internal/logger"
	"gophkeeper/internal/repository"
	"gophkeeper/internal/router"
	"gophkeeper/internal/session"
	"log"
	"net/http"

	"gophkeeper/internal/config"

	"github.com/joho/godotenv"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	if err := godotenv.Load(); err != nil {
		log.Printf("No .env file found")
	}

	cnf := config.Init()
	fmt.Println(*cnf.Server)
	fmt.Println(*cnf.SecretKey)
	fmt.Println(*cnf.MasterKey)
	fmt.Println(*cnf.DataBase)

	sgr := logger.Init()
	defer func() {
		if sgr != nil {
			err := sgr.Sync()
			if err != nil {
				log.Printf("failed to sync logger: %s", err.Error())
			}
		}
	}()

	ssp := &session.SessionProvider{
		Config: cnf,
	}

	rps, err := repository.Init(*cnf.DataBase)
	if err != nil {
		sgr.Errorw(
			"failed to init repository",
			"error", err.Error(),
		)

		return fmt.Errorf("failed to init repository: %w", err)
	}
	defer func() {
		err = rps.DB.Close()
		if err != nil {
			sgr.Errorw(
				"failed to close repository connection",
				"error", err.Error(),
			)
		}
	}()

	hdp := &handlers.HandlerProvider{
		Repository: rps,
		Config:     cnf,
		Sugar:      sgr,
		Session:    ssp,
	}

	rtr := router.RouterProvider{
		Repository: rps,
		Config:     cnf,
		Sugar:      sgr,
		Handler:    hdp,
		Session:    ssp,
	}

	sgr.Error(http.ListenAndServe(*cnf.Server, rtr.Router()))

	return nil
}
