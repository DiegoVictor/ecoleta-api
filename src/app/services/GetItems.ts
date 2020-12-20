import knex from '../../database/connection';

interface Item {
  id: number;
  title: string;
  image: string;
}

class GetItemsService {
  public async execute(): Promise<Item[]> {
    const items = await knex<Item>('items').select('*');

    const serializedItems = items.map(({ id, title, image }) => ({
      id,
      title,
      image,
    }));

    return serializedItems;
  }
}

export default GetItemsService;
