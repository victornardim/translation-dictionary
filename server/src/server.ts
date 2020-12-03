import express from 'express';
import cors from 'cors';
import 'express-async-errors';

import './database/connection';

import routes from './routes';
import errorHandler from './handlers/error.handler';

const auth = require("./auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use(auth);
app.use(routes);
app.use(errorHandler);
app.listen(5000);