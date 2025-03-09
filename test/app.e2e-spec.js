"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const request = require("supertest");
const app_module_1 = require("./../src/app.module");
describe("AppController (e2e)", () => {
    let app;
    beforeEach(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            transform: true,
        }));
        await app.init();
    });
    afterEach(async () => {
        await app.close();
    });
    it("/ (GET) should return 404 as there is no root endpoint", () => {
        return request(app.getHttpServer()).get("/").expect(404);
    });
});
//# sourceMappingURL=app.e2e-spec.js.map