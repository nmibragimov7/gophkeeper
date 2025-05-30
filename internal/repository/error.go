package repository

import "fmt"

type DuplicateError struct {
	Err  error
	Code string
}

func (e *DuplicateError) Error() string {
	return fmt.Sprintf("db error code %s: %v", e.Code, e.Err)
}
func NewDuplicateError(code string, err error) error {
	return &DuplicateError{
		Code: code,
		Err:  err,
	}
}
