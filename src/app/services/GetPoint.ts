import { notFound } from '@hapi/boom';

import knex from '../../database/connection';

interface Request {
  id: string;
}

interface Point {
  id: number;
  name: string;
  email: string;
  whatsapp: string;
  latitude: string;
  longitude: string;
  city: string;
  uf: string;
  image: string;
}

interface Item {
  title: string;
}

interface SerializedPoint {
  point: {
    id: number;
    name: string;
    email: string;
    whatsapp: string;
    latitude: string;
    longitude: string;
    city: string;
    uf: string;
    image: string;
  };
  items: {
    title: string;
  }[];
}

class GetPointService {
  public async execute({ id }: Request): Promise<SerializedPoint> {
    const point = await knex<Point>('points').where('id', id).first();

    if (!point) {
      throw notFound('Point not found', { code: 144 });
    }

    const items = await knex<Item[]>('items')
      .join('points_items', 'items.id', '=', 'points_items.item_id')
      .where('points_items.point_id', id)
      .select('items.title');

    return { point, items };
  }
}

export default GetPointService;
