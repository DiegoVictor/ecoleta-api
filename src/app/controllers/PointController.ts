import { Request, Response } from 'express';
import { notFound } from '@hapi/boom';

import knex from '../../database/connection';

class PointController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsed_items = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await knex('points')
      .join('points_items', 'points.id', '=', 'points_items.point_id')
      .whereIn('points_items.item_id', parsed_items)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    const serialized_points = points.map(point => ({
      ...point,
      image_url: `${process.env.APP_URL}:${process.env.APP_PORT}/uploads/points/${point.image}`,
    }));

    return response.json(serialized_points);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      throw notFound('Point not found', { code: 144 });
    }

    const serialized_point = {
      ...point,
      image_url: `${process.env.APP_URL}:${process.env.APP_PORT}/uploads/points/${point.image}`,
    };

    const items = await knex('items')
      .join('points_items', 'items.id', '=', 'points_items.item_id')
      .where('points_items.point_id', id)
      .select('items.title');

    return response.json({ point: serialized_point, items });
  }

  async store(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const transaction = await knex.transaction();

    const point = {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      image: request.file.filename,
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

    return response.json({ id, ...point });
  }
}

export default PointController;
