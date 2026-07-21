import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

interface TareaRespuesta {
  id: number;
  titulo: string;
  descripcion: string | null;
  estado: 'PENDIENTE' | 'HECHA';
}

describe('Tareas (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    prisma = moduleFixture.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.tarea.deleteMany({
      where: { titulo: { startsWith: '[e2e]' } },
    });
    await app.close();
  });

  it('/health (GET) responde ok', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect((res.body as { status: string }).status).toBe('ok');
  });

  it('recorre el CRUD completo de una tarea', async () => {
    const crear = await request(app.getHttpServer())
      .post('/tareas')
      .send({
        titulo: '[e2e] tarea de prueba',
        descripcion: 'creada por el test e2e',
      })
      .expect(201);

    expect(crear.body).toMatchObject({
      titulo: '[e2e] tarea de prueba',
      estado: 'PENDIENTE',
    });
    const id = (crear.body as TareaRespuesta).id;

    await request(app.getHttpServer()).get(`/tareas/${id}`).expect(200);

    const listar = await request(app.getHttpServer())
      .get('/tareas')
      .expect(200);
    expect(
      (listar.body as Array<{ id: number }>).some((t) => t.id === id),
    ).toBe(true);

    const actualizar = await request(app.getHttpServer())
      .patch(`/tareas/${id}`)
      .send({ estado: 'HECHA' })
      .expect(200);
    expect((actualizar.body as TareaRespuesta).estado).toBe('HECHA');

    await request(app.getHttpServer()).delete(`/tareas/${id}`).expect(200);
    await request(app.getHttpServer()).get(`/tareas/${id}`).expect(404);
  });

  it('rechaza crear una tarea con titulo vacio (400)', async () => {
    await request(app.getHttpServer())
      .post('/tareas')
      .send({ titulo: '' })
      .expect(400);
  });

  it('devuelve 404 al pedir una tarea que no existe', async () => {
    await request(app.getHttpServer()).get('/tareas/999999999').expect(404);
  });
});
