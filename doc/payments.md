# Shows API Spec

## Create Shows

Endpoint : POST /api/ticket/:idTicket

Request Header :
- X-API-TOKEN : token

Request Body :

```json
{
    "paymentId": "uuid",
    "ticketId": "fk",
    "amount": "Rp. 10000",
    "paymentDate": "Tanggal pembayaran.",
    "metodePayment": "Metode pembayaran",
    "status": "sukses"
}
```

Response Body (Success) : 

```json
{
  "data" : {
   "paymentId": "uuid",
    "ticketId": "fk",
    "amount": "Rp. 10000",
    "paymentDate": "Tanggal pembayaran.",
    "metodePayment": "Metode pembayaran",
    "status": "sukses"
  }
}
```

Response Body (Failed) : 

```json
{
  "errors" : "name is required"
}
```

## Get Shows

Endpoint : GET /api/ticket/:idTicket

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : {
    "paymentId": "uuid",
    "ticketId": "fk",
    "amount": "Rp. 10000",
    "paymentDate": "Tanggal pembayaran.",
    "metodePayment": "Metode pembayaran",
    "status": "sukses"
  }
}
```

Response Body (Failed) : 

```json
{
  "errors" : "Showtimes is not found"
}
```

## Update Showtimes

Endpoint : PATCH /api/ticket/:idTicket

Request Header :
- X-API-TOKEN : token

Request Body :

```json
{
   "paymentId": "uuid",
    "ticketId": "fk",
    "amount": "Rp. 10000",
    "paymentDate": "Tanggal pembayaran.",
    "metodePayment": "Metode pembayaran",
    "status": "sukses"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "paymentId": "uuid",
    "ticketId": "fk",
    "amount": "Rp. 10000",
    "paymentDate": "Tanggal pembayaran.",
    "metodePayment": "Metode pembayaran",
    "status": "sukses"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "showDate is required"
}
```

## Remove Show

Endpoint : DELETE /api/ticket/:idTicket

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : "OK"
}
```

Response Body (Failed) :

```json
{
  "errors" : "Showtime is not found"
}
```

## List Show

Endpoint : GET /api/ticket/:idTickets

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : [
    {
    "paymentId": "uuid",
    "ticketId": "fk",
    "amount": "Rp. 10000",
    "paymentDate": "Tanggal pembayaran.",
    "metodePayment": "Metode pembayaran",
    "status": "sukses"
    },
    {
    "paymentId": "uuid",
    "ticketId": "fk",
    "amount": "Rp. 10000",
    "paymentDate": "Tanggal pembayaran.",
    "metodePayment": "Metode pembayaran",
    "status": "sukses"
    }
  ]
}
```

Response Body (Failed) :

```json
{
  "errors" : "Showtime is not found"
}
```