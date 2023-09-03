import { faker } from '@faker-js/faker';
import factory from 'factory-girl';

factory.define(
  'Item',
  {},
  {
    title: faker.commerce.productName,
    image: () => `${faker.lorem.word()}.jpg`,
  },
);

factory.define(
  'Point',
  {},
  {
    name: faker.company.name,
    email: faker.internet.email,
    whatsapp: faker.phone.number,
    latitude: () => Number(faker.location.latitude()),
    longitude: () => Number(faker.location.longitude()),
    city: faker.location.city,
    uf: () => faker.location.state({ abbreviated: true }),
    image: () => `${faker.lorem.word()}.jpg`,
  },
);

export default factory;
