package infrastructure

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestInitDB_WithSQLite(t *testing.T) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)
	assert.NotNil(t, db)

	type Dummy struct {
		ID   uint
		Name string
	}
	err = db.AutoMigrate(&Dummy{})
	assert.NoError(t, err)

	db.Create(&Dummy{Name: "test"})
	var count int64
	db.Model(&Dummy{}).Count(&count)
	assert.Equal(t, int64(1), count)
}
