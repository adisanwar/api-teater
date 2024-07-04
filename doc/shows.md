# Shows API Spec

## Create Shows

Endpoint : POST /api/show/:idShow

Request Header :
- X-API-TOKEN : token

Request Body :

```json
{
"Title": "Ramune No Mikata",
"Description": "lorem Ipsum",
"Duration": "3 Jam",
"Rating": "5/5"
}
```

Response Body (Success) : 

```json
{
  "data" : {
    "showId" : "uuid",
    "Title": "Ramune No Mikata",
    "Description": "lorem Ipsum",
    "Duration": "3 Jam",
    "Rating": "5/5"
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

Endpoint : GET /api/theater/:idTheater

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : {
    "showId" : "uuid",
    "Title": "Ramune No Mikata",
    "Description": "lorem Ipsum",
    "Duration": "3 Jam",
    "Rating": "5/5"
  }
}
```

Response Body (Failed) : 

```json
{
  "errors" : "Address is not found"
}
```

## Update Address

Endpoint : PATCH /api/show/:idShow

Request Header :
- X-API-TOKEN : token

Request Body :

```json
{
   "showId" : "uuid",
    "Title": "Ramune No Mikata",
    "Description": "lorem Ipsum",
    "Duration": "3 Jam",
    "Rating": "5/5"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "showId" : "uuid",
    "Title": "Ramune No Mikata",
    "Description": "lorem Ipsum",
    "Duration": "3 Jam",
    "Rating": "5/5"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "title is required"
}
```

## Remove Show

Endpoint : DELETE /api/show/:idShow

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
  "errors" : "Show is not found"
}
```

## List Show

Endpoint : GET /api/show/:idShows

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : [
    {
    "showId" : "uuid",
    "Title": "Ramune No Mikata",
    "Description": "lorem Ipsum",
    "Duration": "3 Jam",
    "Rating": "5/5"
    },
    {
    "showId" : "uuid",
    "Title": "Ramune No Mikata",
    "Description": "lorem Ipsum",
    "Duration": "3 Jam",
    "Rating": "5/5"
    }
  ]
}
```

Response Body (Failed) :

```json
{
  "errors" : "Shows is not found"
}
```