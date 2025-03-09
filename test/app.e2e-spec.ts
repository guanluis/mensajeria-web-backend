import { Test, type TestingModule } from "@nestjs/testing"
import { type INestApplication, ValidationPipe } from "@nestjs/common"
import * as request from "supertest"
import { AppModule } from "./../src/app.module"

describe("AppController (e2e)", () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })

  it("/ (GET) should return 404 as there is no root endpoint", () => {
    return request(app.getHttpServer()).get("/").expect(404)
  })

  // Aquí irían más pruebas e2e para los endpoints de la API
})

