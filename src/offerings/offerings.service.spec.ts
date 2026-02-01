import { Test, TestingModule } from '@nestjs/testing';
import { OfferingsService } from './offerings.service';

describe('OfferingsService', () => {
  let service: OfferingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfferingsService],
    }).compile();

    service = module.get<OfferingsService>(OfferingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
