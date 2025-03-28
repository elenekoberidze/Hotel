import { TestBed } from '@angular/core/testing';

import { SelectedRoomsService } from './selected-rooms.service';

describe('SelectedRoomsService', () => {
  let service: SelectedRoomsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedRoomsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
