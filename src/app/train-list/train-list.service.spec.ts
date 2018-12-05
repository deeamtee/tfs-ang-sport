import { TestBed } from '@angular/core/testing';

import { TrainListService } from './train-list.service';

describe('TrainListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrainListService = TestBed.get(TrainListService);
    expect(service).toBeTruthy();
  });
});
