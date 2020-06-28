import { TestBed } from '@angular/core/testing';

import { AuthGuardLoginService } from './auth-guard-login.service';

describe('AuthGuardLoginService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthGuardLoginService = TestBed.get(AuthGuardLoginService);
    expect(service).toBeTruthy();
  });
});
