import knex from '../../database/connection';

interface Request {
  city: string;
  uf: string;
  items: string;
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

class GetPointsService {
  public async execute({ city, uf, items }: Request): Promise<Point[]> {
    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await knex<Point[]>('points')
      .join('points_items', 'points.id', '=', 'points_items.point_id')
      .whereIn('points_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    return points;
  }
}

export default GetPointsService;
