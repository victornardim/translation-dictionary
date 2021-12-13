# Translation dictionary
[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-339AF0?style=for-the-badge&logo=fontawesome&logoColor=white)](https://fontawesome.com/)
[![Jasmine](https://img.shields.io/badge/Jasmine-8A4182?style=for-the-badge&logo=Jasmine&logoColor=white)](https://jasmine.github.io/)
[![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![ExpressJS](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/index.html)
[![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)

An app for an internal control of foreign sentences.

Ideal for personal use/study or teams with diversity, where the members don't speak fluently the team main language.


## How it works?

* First of all you will need an access token to use the app. Set it into the text field located in the access token button, and if your token is valid, *voilà*, the app is enabled to use :grin:.

* Add new expressions with how many translations you like, in the languages you want. Optionally you can set the singular and plural of the translation, if the plural is irregular.

**e.g.:**

| Singular | Plural |
|----------|--------|
| Wolf     | Wolves |
| Man      | Men    |
| Foot     | Feet   |
| Fish     | Fish   |

* Select the languages you want to see the translations in the main table, or simply click on the details button, and see the description of the expression, and all the translations in all the languages it has.

* Filter by the expression or the translation. The filter is not case-sensitive, but is accent-sensitive.

**e.g.:**
```
wOlVeS === Wolves  
secretária !== secretaria  
vOiLà === voilà
```

## Project setup

If it is the first execution, you must follow this steps:
1. cd client
1. npm install
1. npm start
1. cd ../server
1. npm install
1. touch ./src/database/database.sqlite
1. ts-node-dev ./node_modules/typeorm/cli.js migration:run
1. npm run dev
