import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Bike } from '../bike/bike.entity';
import { User } from './user.entity';
import { createSixDigitCode } from '../utils/utils';

const dummyService = () => {
  return new UserService(null, null, null, null, null, null, null);
}

describe('UserService', () => {
  it('should be defined but isnt', () => {
  });

  it("should return null when the bike parameter is null", () => {
    // Arrange
    const service = dummyService();
    const bikes: Bike[] = [
      { stravaId: "1", name: "Bike 1" } as Bike,
      { stravaId: "2", name: "Bike 2" } as Bike,
    ];
  
    // Act
    const result = service['findMatchingBike'](null, bikes);
  
    // Assert
    expect(result).toBeNull();
  });

  it('should return null when no bike with matching stravaId or name is found', () => {
    // Arrange
    const service = dummyService();
    const bikeToMatch = { id: "4", name: "Nonexistent Bike" };
    const bikes: Bike[] = [
      { stravaId: "1", name: "Bike 1" } as Bike,
      { stravaId: "2", name: "Bike 2" } as Bike,
    ];
  
    // Act
    const result = service['findMatchingBike'](bikeToMatch, bikes);
  
    // Assert
    expect(result).toBeNull();
  });

  it('should handle case where bike name is an empty string and not match', () => {
    // Arrange
    const service = dummyService();
    const bikeToMatch = { id: "3", name: "" };
    const bikes: Bike[] = [
      { stravaId: "1", name: "Bike 1" } as Bike,
      { stravaId: "2", name: "Bike 2" } as Bike,
    ];
  
    // Act
    const result = service['findMatchingBike'](bikeToMatch, bikes);
  
    // Assert
    expect(result).toBeNull();
  });

  it('should return the matching bike when a bike with matching name (case insensitive) is found', () => {
    // Arrange
    const service = dummyService();
    const bikeToMatch = { id: "5", name: "bike 2" };
    const bikes: Bike[] = [
      { stravaId: "1", name: "Bike 1" } as Bike,
      { stravaId: "2", name: "Bike 2" } as Bike,
    ];
  
    // Act
    const result = service['findMatchingBike'](bikeToMatch, bikes);
  
    // Assert
    expect(result).toEqual(bikes[1]);
  });

  it('a new strava bike should have maintenance items', () => {
    // Arrange
    const service = dummyService();
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

  it('create random six-digit code', () => {
    var tries = 0;
    const service = dummyService();
    while (tries++ < 100) {
      var code = createSixDigitCode();
      // console.log(code);
      expect(code).toHaveLength(6);
      expect(code).toMatch(/^[0-9]+$/);
    }
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
