import { DomainValidationException } from './domain-validation-exception';
import { HttpStatus } from '@nestjs/common';

describe('DomainValidationException', () => {
  it('should create an exception with the default message and status', () => {
    const exception = new DomainValidationException();

    expect(exception.message).toBe('Domain validation exception');
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should create an exception with a custom message', () => {
    const customMessage = 'Custom validation error';
    const exception = new DomainValidationException(customMessage);

    expect(exception.message).toBe(customMessage);
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });
});
