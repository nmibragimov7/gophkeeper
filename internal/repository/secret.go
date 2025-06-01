package repository

import (
	"fmt"
	"gophkeeper/internal/models/entity"
	"log"
)

const (
	InsetSecret             = "INSERT INTO secrets (user_id, type, data, meta) VALUES ($1, $2, $3, $4) RETURNING id"
	SelectSecrets           = "SELECT * FROM secrets WHERE user_id = $1 AND ($2 = '' OR meta ILIKE '%' || $2 || '%')"
	UpdateWithDataSecret    = "UPDATE secrets SET type = $1, data = $2, meta = $3, updated_at = NOW() WHERE user_id = $4 AND id = $5 RETURNING id"
	UpdateWithoutDataSecret = "UPDATE secrets SET type = $1, meta = $2, updated_at = NOW() WHERE user_id = $3 AND id = $4 RETURNING id"
	RemoveSecret            = "DELETE FROM secrets WHERE user_id = $1 AND id = $2"
)

func (p *RepositoryProvider) SaveSecret(values *entity.Secret) (int64, error) {
	err := p.DB.QueryRow(
		InsetSecret,
		values.UserID,
		values.Type,
		values.Data,
		values.Meta,
	).Scan(&values.ID)
	if err != nil {
		return 0, fmt.Errorf("failed to insert secret: %w", err)
	}

	return values.ID, nil
}

func (p *RepositoryProvider) GetSecrets(userID int64, meta string) ([]entity.Secret, error) {
	var records []entity.Secret

	rows, err := p.DB.Query(SelectSecrets, userID, meta)
	if err != nil {
		return nil, fmt.Errorf("failed to query records: %w", err)
	}
	defer func() {
		err := rows.Close()
		if err != nil {
			log.Printf("failed to close rows: %s", err.Error())
		}
	}()

	for rows.Next() {
		var record entity.Secret

		err = rows.Scan(
			&record.ID,
			&record.UserID,
			&record.Type,
			&record.Data,
			&record.Meta,
			&record.CreatedAt,
			&record.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan record: %w", err)
		}

		records = append(records, record)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("failed to scan records: %w", err)
	}

	return records, nil
}

func (p *RepositoryProvider) UpdateSecret(userID int64, secretID int64, secret *entity.Secret, withData bool) (int64, error) {
	if withData {
		err := p.DB.QueryRow(UpdateWithDataSecret,
			&secret.Type,
			&secret.Data,
			&secret.Meta,
			userID,
			secretID,
		).Scan(&secret.ID)
		if err != nil {
			return 0, fmt.Errorf("failed to update record: %w", err)
		}
	} else {
		err := p.DB.QueryRow(UpdateWithoutDataSecret,
			&secret.Type,
			&secret.Meta,
			userID,
			secretID,
		).Scan(&secret.ID)
		if err != nil {
			return 0, fmt.Errorf("failed to update record: %w", err)
		}
	}

	return secret.ID, nil
}

func (p *RepositoryProvider) RemoveSecret(userID int64, secretID int64) (int64, error) {
	result, err := p.DB.Exec(RemoveSecret, userID, secretID)
	if err != nil {
		return 0, fmt.Errorf("failed to execute delete: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return 0, fmt.Errorf("failed to check affected rows: %w", err)
	}

	if rowsAffected == 0 {
		return 0, fmt.Errorf("no rows deleted")
	}

	return secretID, nil
}
