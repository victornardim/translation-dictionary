import { Router } from 'express';
import AuthController from './controllers/auth.controller';

import ExpressionsController from './controllers/expressions.controller';
import LanguagesController from './controllers/languages.controller';

const routes = Router();

const expressionsController = new ExpressionsController();
const authController = new AuthController();
const languagesController = new LanguagesController();

routes.get('/auth', (req, res) => authController.validate(req, res));
routes.get('/expressions', (req, res) => expressionsController.index(req, res));
routes.post('/expressions', (req, res) => expressionsController.create(req, res));
routes.put('/expressions', (req, res) => expressionsController.edit(req, res));
routes.delete('/expressions/:id', (req, res) => expressionsController.delete(req, res));
routes.get('/languages', (req, res) => languagesController.index(req, res));

export default routes;