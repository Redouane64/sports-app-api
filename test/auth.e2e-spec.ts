import request from 'supertest';
import { DataSource } from 'typeorm';
import { User } from '../src/auth/entities/user.entity';
import { Session } from '../src/auth/entities/session.entity';
import { Track } from '../src/track/entities/track.entity';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AuthResult } from 'src/auth/dto/auth-result.dto';
import { CreateNestApplication } from './common/create-nest-application.factory';

describe('Auth (e2e)', () => {
  let app: NestExpressApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    app = await CreateNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.createQueryBuilder().delete().from(Track).execute();
      await dataSource.createQueryBuilder().delete().from(Session).execute();
      await dataSource.createQueryBuilder().delete().from(User).execute();
    }
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should successfully register a new user', async () => {
      const registerData = {
        email: `john.doe@test.com`,
        password: 'john123',
        fullName: 'John Doe',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(200);

      const body = response.body as AuthResult;

      expect(body).toHaveProperty('accessToken');
      expect(body).toHaveProperty('refreshToken');
      expect(typeof body.accessToken).toBe('string');
      expect(typeof body.refreshToken).toBe('string');
      expect(body.accessToken.length).toBeGreaterThan(0);
      expect(body.refreshToken.length).toBeGreaterThan(0);
    });

    it('should return 400 Bad Request when request body is {}', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({})
        .expect(400);

      const body = response.body as Record<'message', string[]>;
      expect(body).toHaveProperty('message');
      expect(Array.isArray(body.message)).toBe(true);
      expect(body.message.length).toBeGreaterThan(0);
    });
  });

  describe('POST /auth/login', () => {
    it('should successfully login a user', async () => {
      // First register a user
      const registerData = {
        email: `jane.doe@test.com`,
        password: 'jane123',
        fullName: 'Jane Doe',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(200);

      // Then login with the same credentials
      const loginData = {
        email: registerData.email,
        password: registerData.password,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      const body = response.body as AuthResult;

      expect(body).toHaveProperty('accessToken');
      expect(body).toHaveProperty('refreshToken');
      expect(typeof body.accessToken).toBe('string');
      expect(typeof body.refreshToken).toBe('string');
      expect(body.accessToken.length).toBeGreaterThan(0);
      expect(body.refreshToken.length).toBeGreaterThan(0);
    });

    it('should return 400 Bad Request when request body is {}', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400);

      const body = response.body as Record<'message', string[]>;

      expect(body).toHaveProperty('message');
      expect(Array.isArray(body.message)).toBe(true);
      expect(body.message.length).toBeGreaterThan(0);
    });
  });
});
