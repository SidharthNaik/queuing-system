import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Tokens (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /tokens issues a token number', async () => {
    const res = await request(app.getHttpServer()).post('/tokens').expect(201);
    expect(res.body).toMatchObject({ number: 1, waitingAhead: 0 });
    expect(res.body.id).toEqual(expect.any(String));
    expect(res.body.createdAt).toEqual(expect.any(String));
  });

  it('POST /tokens/next serves tokens first-in, first-out', async () => {
    const server = app.getHttpServer();
    await request(server).post('/tokens').expect(201);
    await request(server).post('/tokens').expect(201);

    const first = await request(server).post('/tokens/next').expect(200);
    const second = await request(server).post('/tokens/next').expect(200);
    expect(first.body.number).toBe(1);
    expect(second.body.number).toBe(2);
  });

  it('POST /tokens/next returns 404 when the queue is empty', async () => {
    await request(app.getHttpServer()).post('/tokens/next').expect(404);
  });
});
