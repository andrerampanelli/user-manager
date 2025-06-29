# --- Builder stage ---
FROM golang:alpine AS builder
WORKDIR /go/src/app
COPY . .
RUN go build -ldflags "-s -w" -o /app cmd/main.go

# --- Runner stage ---
FROM scratch
WORKDIR /app
COPY --from=builder /app .
COPY --from=builder /go/src/app/.env .env
EXPOSE 8080
CMD ["./app"] 