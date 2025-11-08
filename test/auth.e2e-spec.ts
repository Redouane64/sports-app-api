import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ConfigProps } from '../src/config/interfaces/config-props.interface';
import { DataSource } from 'typeorm';
import { User } from '../src/auth/entities/user.entity';
import { Session } from '../src/auth/entities/session.entity';
import { NestExpressApplication } from '@nestjs/platform-express';

describe('Auth (e2e)', () => {
  let app: NestExpressApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.set('query parser', 'extended');
    
    // Apply the same validation pipe configuration as in main.ts
    const configService = app.get(ConfigService);
    const appConfig = configService.get<ConfigProps['app']>('app')!;
    app.useGlobalPipes(
      new ValidationPipe({
        disableErrorMessages: appConfig.nodeEnv === 'production',
        transform: true,
        whitelist: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    
    // Get DataSource for database cleanup
    dataSource = app.get(DataSource);
    
    await app.init();
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
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

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(typeof response.body.accessToken).toBe('string');
      expect(typeof response.body.refreshToken).toBe('string');
      expect(response.body.accessToken.length).toBeGreaterThan(0);
      expect(response.body.refreshToken.length).toBeGreaterThan(0);
    });

    it('should return 400 Bad Request when request body is {}', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.message)).toBe(true);
      expect(response.body.message.length).toBeGreaterThan(0);
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

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(typeof response.body.accessToken).toBe('string');
      expect(typeof response.body.refreshToken).toBe('string');
      expect(response.body.accessToken.length).toBeGreaterThan(0);
      expect(response.body.refreshToken.length).toBeGreaterThan(0);
    });

    it('should return 400 Bad Request when request body is {}', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.message)).toBe(true);
      expect(response.body.message.length).toBeGreaterThan(0);
    });
  });
});