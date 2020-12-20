import { Request, Response } from 'express';

import GetItems from '../services/GetItems';

const getItems = new GetItems();

class ItemsController {
  async index(request: Request, response: Response) {
    const { host_url } = request;
    const items = await getItems.execute();

    return response.json(
      items.map(item => ({
        ...item,
        image_url: `${host_url}/uploads/items/${item.image}`,
      })),
    );
  }
}

export default ItemsController;
