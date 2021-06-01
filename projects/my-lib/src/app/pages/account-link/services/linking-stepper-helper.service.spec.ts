import { TestBed } from '@angular/core/testing';

import { LinkingStepperHelperService } from './linking-stepper-helper.service';

describe('LinkingStepperHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LinkingStepperHelperService = TestBed.get(LinkingStepperHelperService);
    expect(service).toBeTruthy();
  });
});
