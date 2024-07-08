# Contact API Spec

## Create Contact

Endpoint : POST /api/contacts

Request Header :
- X-API-TOKEN : token

Request Body :

```json
{
  "data" : {
    "first_name" : "Eko Kurniawan",
    "last_name" : "Khannedy",
    "ofcNo" : "123",
    "email" : "eko@example.com",
    "phone" : "089999999",
    "dateofbirth" : "12/12/1290",
    "idJkt": "1",
  "nationalId"  : "283746"
  }
}
```

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "first_name" : "Eko Kurniawan",
    "last_name" : "Khannedy",
    "ofcNo" : "123",
    "email" : "eko@example.com",
    "phone" : "089999999",
    "dateofbirth" : "12/12/1290",
    "idJkt": "1",
  "nationalId"  : "283746"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "first_name must not blank, ..."
}
```

## Get Contact

Endpoint : GET /api/contacts/:id

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "first_name" : "Eko Kurniawan",
    "last_name" : "Khannedy",
    "ofcNo" : "123",
    "email" : "eko@example.com",
    "phone" : "089999999",
    "dateofbirth" : "12/12/1290",
    "idJkt": "1",
  "nationalId"  : "283746"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Contact is not found"
}
```

## Update Contact

Endpoint : PATCH /api/contacts/:id

Request Header :
- X-API-TOKEN : token

Request Body :

```json
{
  "data" : {
    "id" : 1,
    "first_name" : "Eko Kurniawan",
    "last_name" : "Khannedy",
    "ofcNo" : "123",
    "email" : "eko@example.com",
    "phone" : "089999999",
    "dateofbirth" : "12/12/1290",
    "idJkt": "1",
  "nationalId"  : "283746"
  }
}
```

Response Body (Success) :

```json
{
 "data" : {
    "id" : 1,
    "first_name" : "Eko Kurniawan",
    "last_name" : "Khannedy",
    "ofcNo" : "123",
    "email" : "eko@example.com",
    "phone" : "089999999",
    "dateofbirth" : "12/12/1290",
    "idJkt": "1",
  "nationalId"  : "283746"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "first_name must not blank, ..."
}
```

## Remove Contact

Endpoint : DELETE /api/contacts/:id

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
  "errors" : "Contact is not found"
}
```

## Search Contact

Endpoint : GET /api/contacts

Query Parameter :
- name : string, contact first name or contact last name, optional
- phone : string, contact phone, optional
- email : string, contact email
- ktp   : number  contact ktp
- page : number, default 1
- size : number, default 10

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : [
    {
    "id" : 1,
    "first_name" : "Eko Kurniawan",
    "last_name" : "Khannedy",
    "ofcNo" : "123",
    "email" : "eko@example.com",
    "phone" : "089999999",
    "dateofbirth" : "12/12/1290",
    "idJkt": "1",
  "nationalId"  : "283746"
  },
    {
    "id" : 1,
    "first_name" : "Eko Kurniawan",
    "last_name" : "Khannedy",
    "ofcNo" : "123",
    "email" : "eko@example.com",
    "phone" : "089999999",
    "dateofbirth" : "12/12/1290",
    "idJkt": "1",
  "nationalId"  : "283746"
    }
  ],
  "paging" : {
    "current_page" : 1,
    "total_page" : 10,
    "size" : 10
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Unauthorized"
}
```