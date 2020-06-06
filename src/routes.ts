import { Router } from 'express';
import multer from 'multer';

import ItemController from './app/controllers/ItemController';
import PointController from './app/controllers/PointController';

import cityUfItemsValidator from './app/validator/cityUfItemsValidator';
import idValidator from './app/validator/idValidator';
import pointValidator from './app/validator/pointValidator';

import multer_config from './config/multer';

const point_controller = new PointController();
const item_controller = new ItemController();

const routes = Router();
const upload = multer(multer_config);

routes.get('/items', item_controller.index);

routes.get('/points/', cityUfItemsValidator, point_controller.index);
routes.get('/points/:id', idValidator, point_controller.show);
routes.post(
  '/points',
  upload.single('image'),
  pointValidator,
  point_controller.store,
);

export default routes;
