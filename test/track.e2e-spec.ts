import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ConfigProps } from '../src/config/interfaces/config-props.interface';
import { DataSource } from 'typeorm';
import { User } from '../src/auth/entities/user.entity';
import { Session } from '../src/auth/entities/session.entity';
import { Track } from '../src/track/entities/track.entity';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as TestData from './tracks/test-data.json';
import { AuthResult } from 'src/auth/dto/auth-result.dto';
import { PaginatedResult } from 'src/common/dtos/paginated-result.dto';

describe('TrackController (e2e)', () => {
  let app: NestExpressApplication;
  let dataSource: DataSource;
  let accessToken: string;
  let userId: string;

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

    // Create a user and get access token
    const registerDto = {
      email: `test.track@test.com`,
      password: 'test123',
      fullName: 'Test User',
    };

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(200);

    const body = registerResponse.body as AuthResult;
    accessToken = body.accessToken;

    // Get user ID from database
    const user = await dataSource
      .getRepository(User)
      .findOne({ where: { email: registerDto.email } });

    // save user id for filtering by authorId tests
    userId = user!.id;
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.createQueryBuilder().delete().from(Track).execute();
      await dataSource.createQueryBuilder().delete().from(Session).execute();
      await dataSource.createQueryBuilder().delete().from(User).execute();
    }
    await app.close();
  });

  describe('GET /tracks', () => {
    it('should return empty list when no tracks exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/tracks')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const body = response.body as PaginatedResult<Track>;

      expect(body).toHaveProperty('items');
      expect(body).toHaveProperty('total');
      expect(body).toHaveProperty('hasMore');
      expect(Array.isArray(body.items)).toBe(true);
      expect(body.items.length).toBe(0);
      expect(body.total).toBe(0);
      expect(body.hasMore).toBe(false);
    });
  });

  describe('POST /tracks', () => {
    it('should create track', async () => {
      await Promise.all(
        Array.from(TestData).map(async (track: (typeof TestData)[number]) => {
          const response = await request(app.getHttpServer())
            .post('/tracks')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(track)
            .expect(201);

          expect(response.body).toHaveProperty('id');
          expect(response.body).toHaveProperty('title', track.title);
          expect(response.body).toHaveProperty(
            'description',
            track.description,
          );
          expect(response.body).toHaveProperty('location', track.location);
          expect(response.body).toHaveProperty('route', track.route);
          expect(response.body).toHaveProperty('totalTime', track.totalTime);
          expect(response.body).toHaveProperty('status', track.status);
          expect(response.body).toHaveProperty('authorId', userId);
          expect(response.body).toHaveProperty('public', true);
        }),
      );
    });
  });

  describe('GET /tracks with filters', () => {
    it('should list all tracks after creation', async () => {
      const response = await request(app.getHttpServer())
        .get('/tracks')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const body = response.body as PaginatedResult<Track>;

      expect(body).toHaveProperty('items');
      expect(body).toHaveProperty('total');
      expect(body).toHaveProperty('hasMore');
      expect(Array.isArray(body.items)).toBe(true);
      expect(body.total).toBe(TestData.length);
      expect(body.items.length).toBe(TestData.length);
    });

    it('should filter tracks by query keyword', async () => {
      const keyword = 'Riverside';
      const response = await request(app.getHttpServer())
        .get('/tracks')
        .query({ query: keyword })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const body = response.body as PaginatedResult<Track>;

      expect(body).toHaveProperty('items');
      expect(body).toHaveProperty('total');
      expect(body).toHaveProperty('hasMore');
      expect(Array.isArray(body.items)).toBe(true);
      expect(body.total).toBeGreaterThanOrEqual(1);
      expect(body.items.length).toBeGreaterThanOrEqual(1);

      // Check that all returned tracks contain the keyword
      body.items.forEach((track: Track) => {
        const titleMatch = track.title
          ?.toLowerCase()
          .includes(keyword.toLowerCase());
        const descMatch = track.description
          ?.toLowerCase()
          .includes(keyword.toLowerCase());
        expect(titleMatch || descMatch).toBe(true);
      });
    });

    it('should filter tracks by distance', async () => {
      const response = await request(app.getHttpServer())
        .get('/tracks')
        .query({
          'distance[location]': '16.450072,48.255864',
          'distance[radius]': 10000, // 10km radius
        })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const body = response.body as PaginatedResult<Track>;

      expect(body).toHaveProperty('items');
      expect(body).toHaveProperty('total');
      expect(body).toHaveProperty('hasMore');
      expect(Array.isArray(body.items)).toBe(true);
      expect(body.total).toBeGreaterThanOrEqual(1);
      expect(body.items[0].distance).toBeTruthy();
    });

    it('should filter tracks by authorId', async () => {
      const response = await request(app.getHttpServer())
        .get('/tracks')
        .query({ authorId: userId })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const body = response.body as PaginatedResult<Track>;

      expect(body).toHaveProperty('items');
      expect(body).toHaveProperty('total');
      expect(body).toHaveProperty('hasMore');
      expect(Array.isArray(body.items)).toBe(true);
      expect(body.total).toBe(2);

      // Check that all returned tracks belong to the user
      body.items.forEach((track: Track) => {
        expect(track.author).toHaveProperty('id', userId);
      });
    });
  });
});
