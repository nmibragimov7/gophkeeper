package response

type Response struct {
	Message string `json:"message"`
}

type Login struct {
	Access string `json:"access"`
}

type Secret struct {
	ID int64 `json:"id"`
}
