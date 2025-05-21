import { Test, TestingModule } from '@nestjs/testing';
import { SwaggerController } from './swagger.controller';

describe('SwaggerController', () => {
  let controller: SwaggerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwaggerController],
    }).compile();

    controller = module.get<SwaggerController>(SwaggerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
