# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
  "username" : "Adi",
  "password" : "rahasia",
  "name" : " Adi",
  "isAdmin" : "true/false"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "Adi",
    "name" : "Adi"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Username must not blank, ..."
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username" : "Adi",
  "password" : "rahasia",
  "isAdmin"     : "true"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "Adi",
    "name" : " Adi",
    "token" : "uuid"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Username or password wrong, ..."
}
```

## Get User

Endpoint : GET /api/users/current

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : {
    "username" : "Adi",
    "name" : " Adi"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Unauthorized, ..."
}
```

## Update User

Endpoint : PATCH /api/users/current

Request Header :
- X-API-TOKEN : token

Request Body :

```json
{
  "password" : "rahasia", // tidak wajib
  "name" : " Adi" // tidak wajib
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "Adi",
    "name" : " Adi"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Unauthorized, ..."
}
```

## Logout User

Endpoint : DELETE /api/users/current

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
  "errors" : "Unauthorized, ..."
}
```