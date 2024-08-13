import { INestApplication, ValidationPipe } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { mockedUser } from './user.mock';
import { Test } from '@nestjs/testing';
import { AuthenticationController } from '../authentication.controller';
import { UsersService } from 'src/users/users.service';
import { AuthenticationService } from '../authentication.service';
import { ConfigService } from '@nestjs/config';
import { mockedConfigService } from 'src/utils/mocks/config.service';
import { JwtService } from '@nestjs/jwt';
import { mockedJwtService } from 'src/utils/mocks/jwt.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';

describe('The AuthenticationController', () => {
  let app: INestApplication;
  let userData: User;
  beforeEach(async () => {
    userData = { ...mockedUser };
    const usersRepository = {
      create: jest.fn().mockResolvedValue(userData),
      save: jest.fn().mockReturnValue(Promise.resolve()),
    };

    const module = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        UsersService,
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository,
        },
      ],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('when registering', () => {
    describe('and using valid data', () => {
      it('should respond with the data of the user without the password', () => {
        const expectedData = { ...userData };
        delete expectedData.password;
        return request(app.getHttpServer())
          .post('/authentication/register')
          .send({
            email: mockedUser.email,
            name: mockedUser.name,
            password: 'strongPassword',
          })
          .expect(201)
          .expect(expectedData);
      });
    });
    describe('and using invalid data', () => {
      it('should throw an error', async () => {
        return request(app.getHttpServer())
          .post('/authentication/register')
          .send({
            name: mockedUser.name,
          })
          .expect(400);
      });
    });
  });
});
