import { User } from 'src/users/entities/user.entity';

export const mockedUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'user@gmail.com',
  password: 'strongPassword',
  address: {
    id: 1,
    street: 'streetName',
    city: 'cityName',
    country: 'countryName',
  },
};
