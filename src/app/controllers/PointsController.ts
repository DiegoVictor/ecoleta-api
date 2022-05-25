import { Request, Response } from 'express';

import GetPointService from '../services/GetPoint';
import CreatePointService from '../services/CreatePoint';
import GetPointsService from '../services/GetPoints';

interface CustomQuery {
  query: {
    city: string;
    uf: string;
    items: string;
  };
}

const getPointService = new GetPointService();
const getPointsService = new GetPointsService();
const createPointService = new CreatePointService();

class PointsController {
  async index(request: Request & CustomQuery, response: Response) {
    const { host_url } = request;
    const { city, uf, items } = request.query;

    const points = await getPointsService.execute({ city, uf, items });

    return response.json(
      points.map(point => ({
        ...point,
        image_url: `${host_url}/uploads/points/${point.image}`,
      })),
    );
  }

  async show(request: Request, response: Response) {
    const { host_url } = request;
    const { id } = request.params;
    const { point, items } = await getPointService.execute({ id });

    return response.json({
      point: {
        ...point,
        image_url: `${host_url}/uploads/points/${point.image}`,
      },
      items,
    });
  }

  async store(request: Request, response: Response) {
    const { name, email, whatsapp, latitude, longitude, city, uf, items } =
      request.body;

    const point = await createPointService.execute({
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      image: request.file?.filename || '',
      items,
    });

    return response.json(point);
  }
}

export default PointsController;
