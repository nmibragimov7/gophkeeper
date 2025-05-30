# GoKeeper

## Описание

Gophkeeper — сервис для хранения и управления секретами (логины, пароли, банковские карты и т.д.).

## Стэк

-   Backend: Go (Gin, PostgreSQL)
-   Frontend: React + Vite + TailwindCSS
-   БД: PostgreSQL
-   Docker, docker-compose

## Как запустить проект (docker-compose)

**Перед запуском создай файл `.env` или скопируй `example.env` в `.env` в корне проекта.**

Пример содержимого:

```
SERVER_ADDRESS=:8080
SECRET_KEY=jwt_secret
MASTER_KEY=12345678901234567890123456789012
DATABASE_URI=host=localhost user=postgres password=admin dbname=gophkeeper sslmode=disable
```

1. Убедись, что установлен Docker и docker-compose
2. В корне проекта:
    ```sh
    docker-compose up --build
    ```
3. Фронт доступен на [http://localhost:5173](http://localhost:5173)
4. Бэкенд (API) на [http://localhost:8080](http://localhost:8080)

## Как запустить фронт отдельно

```sh
cd client
npm install
npm run dev
```

## Как запустить бэкенд отдельно

```sh
# В корне проекта
export SERVER_ADDRESS=:8080
export SECRET_KEY=jwt_secret
export MASTER_KEY=12345678901234567890123456789012
export DATABASE_URI=host=localhost user=postgres password=admin dbname=gophkeeper sslmode=disable

go run ./cmd/server
```

## Примечания

-   Для локального запуска БД можно использовать docker-compose только с сервисом postgres.
-   Все переменные окружения для бэкенда указаны в docker-compose.yml.