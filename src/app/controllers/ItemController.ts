import { Request, Response } from 'express';

import knex from '../../database/connection';

class ItemController {
  async index(_: Request, response: Response) {
    const items = await knex('items').select('*');

    const serialized_items = items.map(({ id, title, image }) => ({
      id,
      title,
      image,
      image_url: `${process.env.APP_URL}:${process.env.APP_PORT}/uploads/items/${image}`,
    }));

    return response.json(serialized_items);
  }
}

export default ItemController;
