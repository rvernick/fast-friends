import { validate } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

const getStarterDTO = (): UpdateUserDto => {
  const result = new UpdateUserDto();
  result.username = 'test@test.com'
  result.firstName = 'test'
  result.lastName = 'test'
  return result;
}

describe('UpdateUserDto', () => {
  it('should accept a valid 10-digit phone number', async () => {
    const dto = getStarterDTO();
    dto.mobile = '1234567890';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should reject a phone number with less than 10 digits', async () => {
    const dto = getStarterDTO();
    dto.mobile = '123456789';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toMatchObject({
      matches: 'Phone number should be exactly 10 digits.'
    });
  });

  it('should reject a phone number with more than 10 digits', async () => {
    const dto = getStarterDTO();
    dto.mobile = '12345678901';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toMatchObject({
      matches: 'Phone number should be exactly 10 digits.'
    });
  });

  it('should accept an empty string as a valid phone number', async () => {
    const dto = getStarterDTO();
    dto.mobile = '';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should reject a phone number with non-numeric characters', async () => {
    const dto = getStarterDTO();
    dto.mobile = '12345a7890';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toMatchObject({
      matches: 'Phone number should be exactly 10 digits.'
    });
  });
});