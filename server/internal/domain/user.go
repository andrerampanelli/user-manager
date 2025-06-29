package domain

type User struct {
	ID    uint   `gorm:"primaryKey" json:"id"`
	Name  string `gorm:"type:varchar(100);not null" json:"name"`
	Email string `gorm:"type:varchar(100);uniqueIndex;not null" json:"email"` // must be unique
	Age   int    `gorm:"not null" json:"age"`                                 // must be > 18
}
