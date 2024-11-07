import { validate } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

const getStarterDTO = (): UpdateUserDto => {
  const result = new UpdateUserDto();
  result.username = 'test@test.com'
  result.firstName = 'test'
  result.lastName = 'test'
  result.cellPhone = '1234567890'
  result.units = 'miles'
  return result;
}

describe('UpdateUserDto', () => {
  it('should accept a valid 10-digit phone number', async () => {
    const dto = getStarterDTO();
    dto.cellPhone = '1234567890';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should reject a phone number with less than 10 digits', async () => {
    const dto = getStarterDTO();
    dto.cellPhone = '123456789';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toMatchObject({
      matches: 'Phone number should be exactly 10 digits.'
    });
  });

  it('should reject a phone number with more than 10 digits', async () => {
    const dto = getStarterDTO();
    dto.cellPhone = '12345678901';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toMatchObject({
      matches: 'Phone number should be exactly 10 digits.'
    });
  });

  it('should accept an empty string as a valid phone number', async () => {
    const dto = getStarterDTO();
    dto.cellPhone = '';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should reject a phone number with non-numeric characters', async () => {
    const dto = getStarterDTO();
    dto.cellPhone = '12345a7890';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toMatchObject({
      matches: 'Phone number should be exactly 10 digits.'
    });
  });

    it('should reject anything but km or miles for units', async () => {
    const dto = getStarterDTO();
    dto.units = 'yards';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toMatchObject({
      matches: 'Units should be either "km" or "miles".'
    });
  });

  it('should allow km or miles for units', async () => {
    const dto = getStarterDTO();
    dto.units = 'km';
    const kmErrors = await validate(dto);
    expect(kmErrors.length).toBe(0);
    dto.units = 'miles';
    const milesErrors = await validate(dto);
    expect(milesErrors.length).toBe(0);
  });

});