import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from '../entities/user.entity';

describe('The UsersService', () => {
  let usersService: UsersService;
  let findOneBy: jest.Mock;

  beforeEach(async () => {
    findOneBy = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy,
          },
        },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
  });

  describe('When getting a user by email', () => {
    describe('and the use is matched', () => {
      let user: User;

      beforeEach(async () => {
        user = new User();
        findOneBy.mockReturnValue(Promise.resolve(user));
      });
      it('should return the user', async () => {
        const fetchedUser = await usersService.getUserByEmail('test@gmail.com');
        expect(fetchedUser).toEqual(user);
      });
    });

    describe('and the user is not matched', () => {
      beforeEach(async () => {
        findOneBy.mockReturnValue(undefined);
      });
      it('should throw an error', async () => {
        await expect(
          usersService.getUserByEmail('test@test.com'),
        ).rejects.toThrow();
      });
    });
  });
});
