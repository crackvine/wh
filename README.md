# wh

The initial intent was to create both the backend and frontend applications but in the end I only had time to complete the backend.
The application is coded in a functional style following dependency injection principles where possible.

### Warehouse api 

The following endpoints are available:

[GET] `/products` --> a list of the available products and the number in stock

[GET] `/products/:id` --> get info on a single product

[POST] `/products` --> provision products in the database with a JSON payload

[PATCH] `/products/:id/sale` --> execute a sale on a single product

[GET] `/articles` --> a list of the available inventory articles and the number in stock

[GET] `/articles/:id` --> get info on a single article

[POST] `/articles` --> provision articles in the database with a JSON payload

### Usage

from within the /back folder

`npm install` 

`npm run test` to run the tests

`npm run infra:up` brings up a postgres server docker container 

`npm run migration` creates the database and tables 

The database will initially be empty. The POST endpoints can be used to provision the data. Note that due to the database constraints, articles must be provisioned before products containing those products may be provisioned. 

The JSON payloads for provisioning data are validated to conform to the schema indicated by the sample files

A dockerfile is also provided for building and running the api as a standalone service

### Improvements

Had there been more time available I would have:

Added more tests. Specifically to ensure that the safeguards to prevent sale of products not in stock work correctly on reception of simultaneous requests

Added endpoints for deletion of products and articles, and associated tests to ensure the constraints in the database are effective

Modified to the sale endpoint to allow for sales of more than one item per request
