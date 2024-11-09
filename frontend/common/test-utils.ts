// import {jest} from '@jest/globals';

import AppContext from "./app-context";
import AppController from "./AppController";
import { milesToMeters } from "./utils";

export const mockedBikes = [
  {
    id: 10,
    name: "Ten",
    brand: "Shimano",
    model: "Ultegra",
    link: "",
    distanceMeters: 10000,
    type: "Road", // Example: Road, Mountain, etc.
    groupsetSpeed: 11,
    groupsetBrand: "Shimano",
    isElectronic: true,
    odometerMeters: 10000,
    maintenanceItems: [],
    stravaId: '',
  }
];

export const mockedHistory = [
  {
    id: 10,
  //  bike: Bike;
    bikeName: "Forth",
    bikeId: 11,
    distanceMeters: milesToMeters(1000),
    part: "Chain",
    name: "",
    brand: "Shimano",
    model: "Ultegra",
    link: "",
    bikeDistance: 15000,
    dueDistanceMeters: 18000,
    defaultLongevity: 3000,
    autoAdjustLongevity: true,
  },
  {
    id: 40,
  //  bike: Bike;
    bikeName: "First",
    bikeId: 11,
    distanceMeters: milesToMeters(4000),
    part: "Rear Tire",
    name: "",
    brand: "Shimano",
    model: "Ultegra",
    link: "",
    bikeDistance: 45000,
    dueDistanceMeters: 48000,
    defaultLongevity: 3000,
    autoAdjustLongevity: true,
  },
  {
    id: 20,
  //  bike: Bike;
    bikeName: "Third",
    bikeId: 11,
    distanceMeters: milesToMeters(2000),
    part: "Cassette",
    name: "",
    brand: "Shimano",
    model: "Ultegra",
    link: "",
    bikeDistance: 25000,
    dueDistanceMeters: 28000,
    defaultLongevity: 3000,
    autoAdjustLongevity: true,
  },
  {
    id: 30,
  //  bike: Bike;
    bikeName: "Second",
    bikeId: 11,
    distanceMeters: milesToMeters(3000),
    part: "Front Brake Pads",
    name: "",
    brand: "Shimano",
    model: "Ultegra",
    link: "",
    bikeDistance: 35000,
    dueDistanceMeters: 38000,
    defaultLongevity: 3000,
    autoAdjustLongevity: true,
  },
];


/** 
// export const mockUserPreferences = () => {
  jest.mock('./utils', () => {
    const originalModule = jest.requireActual('./utils');
    return {
      __esModule: true,
    ...originalModule,
      getUserPreferences: jest.fn(() => { return Promise.resolve({ "units": "miles" }) }),
    };
  });
// }

jest.mock('./AppController'); // this happens automatically with automocking

const mockUserPreferences = jest.fn(() => { return Promise.resolve({ "units": "miles" }) });

jest.mocked(AppController).mockImplementation((appContext: AppContext) => {
  return {
    _appContext: appContext,
    getUserPreferences: mockUserPreferences,
    getEmail: jest.fn(() => 'test@email.com'),
    getJwtToken: jest.fn(() => 'test-jwt-token'),
    getJwtTokenPromise: jest.fn(() => Promise.resolve('test-jwt-token')),
    appContext,
    getBikes: jest.fn(() => Promise.resolve([
      { id: 1, make: 'Toyota', model: 'Corolla', year: 2022, milage: 100000 },
      { id: 2, make: 'Honda', model: 'Civic', year: 2021, milage: 50000 },
    ])),
   
  };
});
**/