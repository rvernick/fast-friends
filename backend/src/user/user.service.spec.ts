import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Bike } from '../bike/bike.entity';
import { User } from './user.entity';

describe('UserService', () => {
  it('should be defined but isnt', () => {
  });

  it('a new strava bike should have maintenance items', () => {
    // Arrange
    const service = new UserService(null, null, null, null, null);
    const user = new User('username', 'password');
    const stravaBike = {
      name: 'Test Bike',
      stravaId: 1234,
      type: 'Road',
      user: '',
      distance: 1000,
    }
    // Act
    const bike = service.addStravaBike(user, stravaBike);

    // Assert
    expect(bike.maintenanceItems).toBeTruthy();
    expect(bike.maintenanceItems.length).toBeGreaterThan(4);
  });
});

// describe('UsersService', () => {
//   let service: UsersService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UsersService],
//       providers: [UsersService],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });
