import { Test, TestingModule } from '@nestjs/testing';
import { Source, User, createNewUser } from './user.entity';

describe('User Creation', () => {
  it('should create a new user with hashed password', async () => {
    const user = createNewUser('username', 'password', Source.STRAVA);
    expect(user.password).not.toEqual('password');
    expect(user.username).toEqual('username');
  });

  it('Hashed password should compare correctly', async () => {
    const user = createNewUser('username', 'password', Source.PEDAL_ASSISTANT);
    expect(user.comparePassword('password')).toBeTruthy();
    expect(user.comparePassword('wrong')).toBeFalsy();
  });
});
