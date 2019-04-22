import { TestBed, inject } from '@angular/core/testing';

import { CollectdataService } from './collectdata.service';

describe('CollectdataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollectdataService]
    });
  });

  it('should be created', inject([CollectdataService], (service: CollectdataService) => {
    expect(service).toBeTruthy();
  }));
});
