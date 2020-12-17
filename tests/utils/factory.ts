import faker from 'faker';
import factory from 'factory-girl';

factory.define(
  'Item',
  {},
  {
    title: faker.name.title,
    image: () => `${faker.random.word()}.jpg`,
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
    image: () => `${faker.random.word()}.jpg`,
  },
);

export default factory;
