# Shows API Spec

## Create Shows

Endpoint : POST /api/showtime/:idShowtime

Request Header :
- X-API-TOKEN : token

Request Body :

```json
{
"showId": "uuid",
"theterid": "uuid",
"showDate": "Tanggal pertunjukan.",
"showTime": "Waktu pertunjukan."
}
```

Response Body (Success) : 

```json
{
  "data" : {
    "showtimeId": "uuid",
    "showId": "uuid",
    "theterid": "uuid",
    "showDate": "Tanggal pertunjukan.",
    "showTime": "Waktu pertunjukan."
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

Endpoint : GET /api/showtime/:idShowtime

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : {
    "showtimeId": "uuid",
    "showId": "uuid",
    "theterid": "uuid",
    "showDate": "Tanggal pertunjukan.",
    "showTime": "Waktu pertunjukan."
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

Endpoint : PATCH /api/showtime/:idShowtime

Request Header :
- X-API-TOKEN : token

Request Body :

```json
{
   "showtimeId": "uuid",
    "showId": "uuid",
    "theterid": "uuid",
    "showDate": "Tanggal pertunjukan.",
    "showTime": "Waktu pertunjukan."
}
```

Response Body (Success) :

```json
{
  "data" : {
    "showtimeId": "uuid",
    "showId": "uuid",
    "theterid": "uuid",
    "showDate": "Tanggal pertunjukan.",
    "showTime": "Waktu pertunjukan."
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

Endpoint : DELETE /api/showtime/:idShowtime

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

Endpoint : GET /api/showtime/:idShowtimes

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : [
    {
    "showtimeId": "uuid",
    "showId": "uuid",
    "theterid": "uuid",
    "showDate": "Tanggal pertunjukan.",
    "showTime": "Waktu pertunjukan."
    },
    {
    "showtimeId": "uuid",
    "showId": "uuid",
    "theterid": "uuid",
    "showDate": "Tanggal pertunjukan.",
    "showTime": "Waktu pertunjukan."
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