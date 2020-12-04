# Translation dictionary
An app for an internal control of foreign sentences.

Ideal for personal use/study or teams with diversity, where the members don't speak fluently the team main language.


## How it works?

* First of all you will need an access token to use the app. Set it into the text field located in the access token button, and if your token is valid, *voilà*, the app is enabled to use :grin:.

* Add new expressions with how many translations you like, in the languages you want. Optionally you can set the singular and plural of the translation, if the plural is irregular.

**e.g.:**
```
| Singular | Plural |
|----------|--------|
| Wolf     | Wolves |
| Man      | Men    |
| Foot     | Feet   |
| Fish     | Fish   |
```

<br />

* Select the languages you want to see the translations in the main table, or simply click on the details button, and see the description of the expression, and all the translations in all the languages it has.

* Filter by the expression or the translation. The filter is not case-sensitive, but is accent-sensitive.

**e.g.:**
```
wOlVeS === Wolves  
secretária !== secretaria  
vOiLà === voilà
```

<br />

### Technologies used
-----
<p float="left">
    <img src="https://nodejs.org/static/images/logos/nodejs-new-pantone-black.svg" title="Node.js" height="70px" width="170px"/>
    <img src="https://angular.io/assets/images/logos/angular/angular.svg" title="Angular" height="100px" width="100px"/>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="https://github.com/typeorm/typeorm/raw/master/resources/logo_big.png" title="TypeORM" height="70px" width="170px"/>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="https://getbootstrap.com.br/docs/4.1/assets/img/bootstrap-stack.png" title="Bootstrap" height="90px" width="130px"/>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="https://www.sqlite.org/images/sqlite370_banner.gif" title="SQLite" height="70px" width="170px"/>
</p>

-----

<br />

If it is the first execution, you must follow this steps:
1. cd client
1. npm install
1. npm start
1. cd ../server
1. npm install
1. touch ./src/database/database.sqlite
1. ts-node-dev ./node_modules/typeorm/cli.js migration:run
1. npm run dev
