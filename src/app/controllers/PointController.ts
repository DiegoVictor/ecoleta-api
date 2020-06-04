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

    return response.json(points);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      throw notFound('Point not found', { code: 144 });
    }

    const items = await knex('items')
      .join('points_items', 'items.id', '=', 'points_items.item_id')
      .where('points_items.point_id', id)
      .select('items.title');

    return response.json({ point, items });
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
      image:
        'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80',
    };

    const [id] = await transaction('points').insert([point]);

    await transaction('points_items').insert(
      items.split(',').map((item_id: number) => ({
        item_id,
        point_id: id,
      })),
    );

    await transaction.commit();

    return response.json({ id, ...point });
  }
}

export default PointController;
