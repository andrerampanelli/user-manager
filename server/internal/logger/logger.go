package logger

import (
	"os"

	"github.com/sirupsen/logrus"
)

var Log *logrus.Logger

func init() {
	Log = logrus.New()
	Log.SetFormatter(&logrus.TextFormatter{
		FullTimestamp: true,
	})
	Log.SetOutput(os.Stdout)
	Log.SetLevel(logrus.InfoLevel)
}
