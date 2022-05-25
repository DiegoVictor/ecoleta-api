import request from 'supertest';
import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

import app from '../../src/app';
import connection from '../../src/database/connection';
import factory from '../utils/factory';

interface Item {
  title: string;
  image: string;
}

interface Point {
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

describe('PointsController', () => {
  const url = `${process.env.APP_URL}:${process.env.APP_PORT}`;

  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should be able to get a list of points', async () => {
    const item = await factory.attrs<Item>('Item');
    const [item_id] = await connection('items').insert(item);

    const city = faker.address.city();
    const uf = faker.address.stateAbbr();

    const points = await factory.attrsMany<Point>(
      'Point',
      3,
      Array.from(Array(3).keys()).map(() => ({
        city,
        uf,
      })),
    );

    const savedPoints = await Promise.all(
      points.map(point => {
        return connection('points').insert(point);
      }),
    );

    const promises: Promise<{ point_id: string; item_id: string }>[] = [];
    savedPoints.forEach(([point_id]) => {
      promises.push(
        connection('points_items').insert({
          point_id,
          item_id,
        }),
      );
    });

    await Promise.all(promises);

    const response = await request(app).get(
      `/v1/points?city=${city}&uf=${uf}&items=${item_id}`,
    );

    points.forEach(point => {
      expect(response.body).toContainEqual({
        id: expect.any(Number),
        image_url: `${url}/uploads/points/${point.image}`,
        ...point,
      });
    });
  });

  it('should be able to get one point', async () => {
    const item = await factory.attrs<Item>('Item');
    const [item_id] = await connection('items').insert(item);

    const point = await factory.attrs<Point>('Point');

    const [point_id] = await connection('points').insert(point);

    await connection('points_items').insert({
      point_id,
      item_id,
    });

    const response = await request(app).get(`/v1/points/${point_id}`);

    expect(response.body).toStrictEqual({
      point: {
        id: point_id,
        image_url: `${url}/uploads/points/${point.image}`,
        ...point,
      },
      items: [
        {
          title: item.title,
        },
      ],
    });
  });

  it('should not be able to get one point that not exists', async () => {
    const point_id = faker.datatype.number();

    const response = await request(app)
      .get(`/v1/points/${point_id}`)
      .expect(404);

    expect(response.body).toStrictEqual({
      code: 144,
      docs: process.env.DOCS_URL,
      error: 'Not Found',
      message: 'Point not found',
      statusCode: 404,
    });
  });

  it('should be able to create a new point', async () => {
    const item = await factory.attrs<Item>('Item');
    const [item_id] = await connection('items').insert(item);

    const {
      name,
      city,
      uf,
      email,
      whatsapp,
      latitude,
      longitude,
    } = await factory.attrs<Point>('Point');

    const response = await request(app)
      .post(`/v1/points`)
      .field('name', name)
      .field('email', email)
      .field('whatsapp', whatsapp)
      .field('latitude', latitude)
      .field('longitude', longitude)
      .field('city', city)
      .field('uf', uf)
      .field('items', item_id)
      .attach('image', path.resolve(__dirname, '..', 'utils', 'image.jpg'));

    expect(response.body).toStrictEqual({
      id: expect.any(Number),
      name,
      city,
      uf,
      email,
      whatsapp,
      latitude,
      longitude,
      image: expect.stringMatching(/^\w+-image\.jpg$/),
    });

    fs.unlinkSync(
      path.resolve(
        __dirname,
        '..',
        '..',
        'uploads',
        'points',
        response.body.image,
      ),
    );
  });
});
