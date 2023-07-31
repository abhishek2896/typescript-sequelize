# Building a RESTful API in Node Typescript and Sequelize

## Requirements

- Node, npm and postgresql

## Enviornment variables used

You can use both ways to declare envs (export them or use .env file)

- `PORT` Port on which server should run
- `NODE_ENV` node env
- `DB_PROD_URL` prod db url. eg: 'postgres://user:pass@localhost:5432/prod'
- `DB_DEVLOPMENT_URL` development db. eg: 'postgres://user:pass@localhost:5432/dev'
- `DB_TEST_URL` test db url. eg: 'postgres://user:pass@localhost:5432/test'
- `TTL` ttl for access token in seconds
- `JWT_SECRET` jwt secret
- `ADMIN_USERNAME` admin user name
- `ADMIN_EMAIL` admin user email
- `ADMIN_PASSWORD` admin user password
- `LOGGING` logging for sequilize 


## Exposed endpoints

- Create user
    - endpoint: `/users/create`
    - method: `POST`
    - body: {
        name: string,
        email: string,
        password: string
    }

- Login user
    - endpoint: `/users/login`
    - method: `POST`
    - body: {
        email: string,
        password: string
    }

- Find multiple users
    - endpoint: `/users/findAll`
    - method: `POST`
    - headers: {
        Authorisation: Bearer {token}
    }
    - body: {
        search: string,
        limit: number,
        page: number
    }

- Find One user
    - endpoint: `/users/findOne/:id`
    - method: `GET`
    - headers: {
        Authorisation: Bearer {token}
    }

- Update One user
    - endpoint: `/users/update/:id`
    - method: `PUT`
    - headers: {
        Authorisation: Bearer {token}
    }
    - body: {
        name: string
    }

- Delete one user
    - endpoint: `/users/deleteUser/:id`
    - method: `DELETE`
    - headers: {
        Authorisation: Bearer {token}
    }


## Installation

- Clone the repo: `git clone https://github.com/abhishek2896/typescript-sequelize.git`
- Install dependencies: `npm install`
- Test the server: `npm run test`
- Start the server: `npm start`

## Testing the API
Test your API using [Postman](https://chrome.google.com/webstore/detail/postman-rest-client-packa/fhbjgbiflinjbdggehcddcbncdddomop)


##  How to get started!

 - run `npm start` from the home directory.
 