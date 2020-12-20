import { Router } from 'express';
import multer from 'multer';

import ItemsController from './app/controllers/ItemsController';
import PointsController from './app/controllers/PointsController';
import cityUfItemsValidator from './app/validator/cityUfItemsValidator';
import idValidator from './app/validator/idValidator';
import pointValidator from './app/validator/pointValidator';

import multerConfig from './config/multer';

const pointsController = new PointsController();
const itemsController = new ItemsController();

const routes = Router();
const upload = multer(multerConfig);

routes.get('/items', itemsController.index);

routes.get('/points/', cityUfItemsValidator, pointsController.index);
routes.get('/points/:id', idValidator, pointsController.show);
routes.post(
  '/points',
  upload.single('image'),
  pointValidator,
  pointsController.store,
);

export default routes;
