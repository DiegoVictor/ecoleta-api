import request from 'supertest';

import app from '../../src/app';
import connection from '../../src/database/connection';
import factory from '../utils/factory';

interface Item {
  title: string;
  image: string;
}

describe('ItemsController', () => {
  const url = `${process.env.APP_URL}:${process.env.APP_PORT}`;

  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should be able to get a list of items', async () => {
    const items = await factory.attrsMany<Item>('Item', 3);
    await connection('items').insert(items);

    const response = await request(app).get('/v1/items');

    items.forEach(item => {
      expect(response.body).toContainEqual({
        id: expect.any(Number),
        ...item,

        image_url: `${url}/uploads/items/${item.image}`,
      });
    });
  });
});
