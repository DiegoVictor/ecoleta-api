import knex from '../../database/connection';

interface Request {
  name: string;
  email: string;
  whatsapp: string;
  latitude: string;
  longitude: string;
  city: string;
  uf: string;
  image: string;
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

class CreatePointService {
  public async execute({
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
    image,
    items,
  }: Request): Promise<Point> {
    const transaction = await knex.transaction();

    const point = {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      image,
    };

    const [id] = await transaction('points').insert([point]);

    await transaction('points_items').insert(
      items
        .split(',')
        .map((item: string) => Number(item.trim()))
        .map((item_id: number) => ({
          item_id,
          point_id: id,
        })),
    );

    await transaction.commit();

    return { id, ...point };
  }
}

export default CreatePointService;
