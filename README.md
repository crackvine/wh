# wh

The backend application uses node and express with a postgres database for persistence. It is coded in a functional style following dependency injection principles where possible.

The frontend is a simple react app using material-ui for styling.


### Warehouse backend api 

The following endpoints are available in the backend service:

[GET] `/products` --> a list of the available products and the number in stock

[GET] `/products/:id` --> get info on a single product

[POST] `/products` --> provision (upsert) products in the database with a JSON payload

[PATCH] `/products/:id/sale` --> execute a sale on a single product

[GET] `/articles` --> a list of the available inventory articles and the number in stock

[GET] `/articles/:id` --> get info on a single article

[POST] `/articles` --> provision (upsert) articles in the database with a JSON payload

## Usage

## Backend

From within the /back folder

`npm install` 

`npm run test` to run the tests

`npm run infra:up` brings up a postgres server docker container 

`npm run migration` creates the database and tables 

The database will initially be empty. The frontend app or POST endpoints can be used to provision the data. Note that due to the database constraints, articles must be provisioned before products containing those products may be provisioned. 

The JSON payloads for provisioning data are validated to conform to the schema indicated by the sample files.

A dockerfile is also provided for building and running the api as a standalone service.

`npm start` should bring up the backend service on http://localhost:4000 
## Frontend

From within the /front folder

`npm install` 

`npm start` should bring the frontend application up on http://localhost:3000

The provisioning form can then be used to upload first an inventory json file and then a products json file.

## Improvements

Had there been more time available I would have:

### Backend application

- Added more tests. Specifically to ensure that the safeguards to prevent sale of products not in stock work correctly on reception of simultaneous requests.

- Added endpoints for deletion of products and articles, and associated tests to ensure the constraints in the database are effective.

- Modified the sale endpoint to allow for sales of more than one item per request.

- Spent some time refactoring, e.g. separate the schema definitions into their own files.

- Used https

### Frontend application

- Included tests and dockerised the app.

- Included a "Product details" feature to display which articles comprise a product.

- Customised the styling to avoid the generic look and feel. Improved the styling for the case where many items are displayed.

- Implemented a more sophisticated notification system using toasts for example.

- Included the option of sell more than one of a particular product
