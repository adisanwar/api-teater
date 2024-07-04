# Theaters API Spec

## Create Theaters

Endpoint : POST /api/theater/:idTheater/theaters

Request Header :
- X-API-TOKEN : token

Request Body :

```json
{
  "name" : "JKT48 Teater",
  "location" : "map/long,log",
  "capcity" : "250"
}
```

Response Body (Success) : 

```json
{
  "data" : {
    "theaterId" : "uuid",
    "name" : "JKT48 Teater",
    "location" : "map/long,log",
    "capcity" : "250"
  }
}
```

Response Body (Failed) : 

```json
{
  "errors" : "name is required"
}
```

## Get Address

Endpoint : GET /api/theater/:idTheater

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : {
     "theaterId" : "uuid",
  "name" : "JKT48 Teater",
  "location" : "map/long,log",
  "capcity" : "250"
  }
}
```

Response Body (Failed) : 

```json
{
  "errors" : "Address is not found"
}
```

## Update Theaters

Endpoint : PATCH /api/theater/:idTheater

Request Header :
- X-API-TOKEN : token

Request Body :

```json
{
    "theaterId" : "uuid",
    "name" : "JKT48 Teater",
    "location" : "map/long,log",
    "capcity" : "250"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "theaterId" : "uuid",
    "name" : "JKT48 Teater",
    "location" : "map/long,log",
    "capcity" : "250"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "postal_code is required"
}
```

## Remove Address

Endpoint : DELETE /api/theater/:idTheater

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
  "errors" : "Address is not found"
}
```

## List Teater

Endpoint : GET /api/teater/:idTeater

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : [
    {
    "theaterId" : "uuid",
    "name" : "JKT48 Teater",
    "location" : "map/long,log",
    "capcity" : "250"
    },
    {
       "theaterId" : "uuid",
        "name" : "JKT48 Teater",
        "location" : "map/long,log",
        "capcity" : "250"
    }
  ]
}
```

Response Body (Failed) :

```json
{
  "errors" : "Theater is not found"
}
```