# sms-management
> Simple SMS Management Application API 

[![Maintainability](https://api.codeclimate.com/v1/badges/99bd8f1e8d47079b4eeb/maintainability)](https://codeclimate.com/github/emasys/sms-management/maintainability)
[![Coverage Status](https://coveralls.io/repos/github/emasys/sms-management/badge.svg?branch=staging)](https://coveralls.io/github/emasys/sms-management?branch=staging)
[![CircleCI](https://circleci.com/gh/emasys/sms-management.svg?style=svg)](https://circleci.com/gh/emasys/sms-management)

This is a self documenting API built with HAPIjs and documented with SwaggerUI.

The API models the following abstraction: 
> person sending sms

> person receiving sms

> message of sms

> sms status

> name of person

> phone number of person

### Installation

```sh
clone repo
cd sms-management
npm install
```

### Usage example

_Kindly refer to the [documentation][docs] for examples._

### Development setup

Create a `.env` file with similar data in the `.env.sample` file

To use `docker-compose`, set `HOST` to `db`, else you can set it to `127.0.0.1`

### Starting up

```sh
npm run build
npm start
```

### Starting up with docker-compose
```sh
docker-compose up --build
```

### Starting up on dev mode

```sh
npm run dev
```

### Test
```sh
npm test
```

### Meta

Emmanuel Ndukwe – [@emasys][twitter] 

Distributed under the MIT license. See ``LICENSE`` for more information.

### Contributing

1. Fork it (<https://github.com/emasys/sms-management>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- Markdown link dfn's -->
[docs]: https://sms-management-pipe.herokuapp.com/documentation
[twitter]: https://twitter.com/emasys_nd

