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
    name: faker.company.companyName,
    email: faker.internet.email,
    whatsapp: faker.phone.phoneNumber,
    latitude: () => Number(faker.address.latitude()),
    longitude: () => Number(faker.address.longitude()),
    city: faker.address.city,
    uf: faker.address.stateAbbr,
    image: () => `${faker.lorem.word()}.jpg`,
  },
);

export default factory;
