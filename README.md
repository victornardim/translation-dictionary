# Translation dictionary
An app for an internal control of foreign sentences.

Ideal for personal use/study or teams with diversity, where the members don't speak fluently the team main language.

<br />

## Technologies used
-----
<p float="left">
    <img src="https://nodejs.org/static/images/logo.svg" title="Node.js" height="70px" width="170px" />
    <img src="https://angular.io/assets/images/logos/angular/logo-nav@2x.png" title="Angular" height="50px" width="200px" style="margin-left: 50px" />
    <img src="https://github.com/typeorm/typeorm/raw/master/resources/logo_big.png" title="TypeORM" height="70px" width="170px" style="margin-left: 50px"/>
    <img src="https://getbootstrap.com.br/docs/4.1/assets/img/bootstrap-stack.png" title="Bootstrap" height="90px" width="130px" style="margin-left: 50px"/>
    <img src="https://www.sqlite.org/images/sqlite370_banner.gif" title="SQLite" height="70px" width="170px" style="margin-left: 50px; margin-top: 50px;"/>
</p>

<br/>
<br/>
<br/>

-----

<br />

If it is the first execution, you must follow this steps:
1. cd client
2. npm install
3. npm start
4. cd ../server
5. npm install
6. touch ./src/database/database.sqlite
7. ts-node-dev ./node_modules/typeorm/cli.js migration:run
8. npm run dev
