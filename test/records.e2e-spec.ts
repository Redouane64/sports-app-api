import request from 'supertest';
import { DataSource } from 'typeorm';
import { User } from '../src/auth/entities/user.entity';
import { Session } from '../src/auth/entities/session.entity';
import { Track } from '../src/track/entities/track.entity';
import { Record } from '../src/records/entities/record.entity';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AuthResult } from 'src/auth/dto/auth-result.dto';
import { PaginatedResult } from 'src/common/dtos/paginated-result.dto';
import { CreateNestApplication } from './common/create-nest-application.factory';

// test data
import * as TestData from './tracks/test-data.json';

describe('RecordController (e2e)', () => {
  let app: NestExpressApplication;
  let dataSource: DataSource;
  let accessToken: string;
  let userId: string;
  let trackId: string;

  beforeAll(async () => {
    app = await CreateNestApplication();
    await app.init();

    dataSource = app.get(DataSource);

    const registerDto = {
      email: `test.record@test.com`,
      password: 'test123',
      fullName: 'Test User',
    };

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(200);

    const tokens = registerResponse.body as AuthResult;
    accessToken = tokens.accessToken;

    const user = await dataSource
      .getRepository(User)
      .findOne({ where: { email: registerDto.email } });
    userId = user!.id;

    const trackResponse = await request(app.getHttpServer())
      .post('/tracks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(TestData[0])
      .expect(201);

    const track = trackResponse.body as Track;
    trackId = track.id;
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.createQueryBuilder().delete().from(Record).execute();
      await dataSource.createQueryBuilder().delete().from(Track).execute();
      await dataSource.createQueryBuilder().delete().from(Session).execute();
      await dataSource.createQueryBuilder().delete().from(User).execute();
    }
    await app.close();
  });

  describe('POST /records/:trackId', () => {
    it('should create record for a given track', async () => {
      const recordData = {
        route: {
          type: 'LineString',
          coordinates: [
            [16.340072, 48.195864, 200.0],
            [16.3401, 48.1959, 201.0],
            [16.34015, 48.19595, 202.0],
          ],
        },
        totalTime: 1800,
      };

      const response = await request(app.getHttpServer())
        .post(`/records/${trackId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(recordData)
        .expect(201);

      const body = response.body as Record;

      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('totalTime', recordData.totalTime);
      expect(body).toHaveProperty('author');
      expect(body.author).toHaveProperty('id', userId);
      expect(body).toHaveProperty('status');
    });
  });

  describe('GET /records/:trackId', () => {
    it('should list records for a given track', async () => {
      const recordData = {
        route: {
          type: 'LineString',
          coordinates: [
            [16.340072, 48.195864, 200.0],
            [16.3401, 48.1959, 201.0],
          ],
        },
        totalTime: 1200,
      };

      await request(app.getHttpServer())
        .post(`/records/${trackId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(recordData)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(`/records/${trackId}`)
        .query({ myRecords: true })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const body = response.body as PaginatedResult<Record>;

      expect(body).toHaveProperty('items');
      expect(body).toHaveProperty('total');
      expect(body).toHaveProperty('hasMore');
      expect(Array.isArray(body.items)).toBe(true);
      expect(body.total).toBeGreaterThanOrEqual(1);
      expect(body.items.length).toBeGreaterThanOrEqual(1);

      body.items.forEach((record: Record) => {
        expect(record).toHaveProperty('id');
        expect(record).toHaveProperty('author');
        expect(record.author).toHaveProperty('id', userId);
      });
    });
  });
});
