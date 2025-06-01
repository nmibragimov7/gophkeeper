package config

import (
	"flag"
	"log"
	"os"
)

type Config struct {
	Server    *string
	DataBase  *string
	SecretKey *string
	MasterKey *string
}

func Init() *Config {
	instance := Config{
		Server:    nil,
		DataBase:  nil,
		SecretKey: nil,
		MasterKey: nil,
	}

	flags := flag.NewFlagSet("config", flag.ContinueOnError)

	instance.Server = flags.String("a", ":8080", "Server address")
	instance.SecretKey = flags.String("s", "secret_key", "JWT secret key")
	instance.MasterKey = flags.String("m", "master_key", "Master secret key for encrypt")
	instance.DataBase = flags.String(
		"d",
		"",
		"Database URL",
	) // host=localhost user=postgres password=admin dbname=gophkeeper sslmode=disable

	err := flags.Parse(os.Args[1:])
	if err != nil {
		log.Printf("failed to parse flags: %s", err.Error())
	}

	if envServerAddress, ok := os.LookupEnv("SERVER_ADDRESS"); ok {
		instance.Server = &envServerAddress
	}
	if envServerKey, ok := os.LookupEnv("SECRET_KEY"); ok {
		instance.SecretKey = &envServerKey
	}
	if envMasterKey, ok := os.LookupEnv("MASTER_KEY"); ok {
		instance.MasterKey = &envMasterKey
	}
	if envDataBaseURI, ok := os.LookupEnv("DATABASE_URI"); ok {
		instance.DataBase = &envDataBaseURI
	}

	return &instance
}
