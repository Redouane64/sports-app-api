import { Test, TestingModule } from '@nestjs/testing';
import { RecordController } from './records.controller';

describe('RecordController', () => {
  let controller: RecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordController],
    }).compile();

    controller = module.get<RecordController>(RecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
