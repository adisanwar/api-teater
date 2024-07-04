# Shows API Spec

## Create Shows

Endpoint : POST /api/ticket/:idTicket

Request Header :
- X-API-TOKEN : token

Request Body :

```json
{
    "userId": "fk",
    "showtimeId": "fk",
    "seatNumber": "12",
    "price": "Rp. 10000",
    "purchaseDate": "Tanggal Beli"
}
```

Response Body (Success) : 

```json
{
  "data" : {
    "ticketId": "uuid",
    "userId": "fk",
    "showtimeId": "fk",
    "seatNumber": "12",
    "price": "Rp. 10000",
    "purchaseDate": "Tanggal Beli"
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
    "userId": "fk",
    "showtimeId": "fk",
    "seatNumber": "12",
    "price": "Rp. 10000",
    "purchaseDate": "Tanggal Beli"
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
   "userId": "fk",
    "showtimeId": "fk",
    "seatNumber": "12",
    "price": "Rp. 10000",
    "purchaseDate": "Tanggal Beli"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "userId": "fk",
    "showtimeId": "fk",
    "seatNumber": "12",
    "price": "Rp. 10000",
    "purchaseDate": "Tanggal Beli"
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
    "userId": "fk",
    "showtimeId": "fk",
    "seatNumber": "12",
    "price": "Rp. 10000",
    "purchaseDate": "Tanggal Beli"
    },
    {
    "userId": "fk",
    "showtimeId": "fk",
    "seatNumber": "12",
    "price": "Rp. 10000",
    "purchaseDate": "Tanggal Beli"
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