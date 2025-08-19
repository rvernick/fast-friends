# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

Clone the repository (if not already cloned)
```bash
$ git clone https://github.com/rvernick/fast-friends.git
```
Move to frontent repository on local device
```bash
$ cd fast-friends/frontend/
```
Install Frontend package.json
```bash
npm run reset-project
```

Building:
For testing
```
eas build -p android --profile development
```
Checking that the plugins work:
```
npx expo prebuild -p android --clean
```
iOS production creation
```
eas build --profile production --platform ios
```


BTW, we have an expo plugin for adding a manifest placeholder to the build.grails file (needed for Strava OAuth use)

https://expo.dev/accounts/fast-friends/projects/fast-friends

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Helpful links

Layout info: https://reactnative.dev/docs/layout-props
Created Apple store images here: https://appscreens.com/user/project/JlcUwadbmAZ3M7aAHZH3

## Migrated from React Native Paper to Gluestack with NativeWind
The layouts with RNP were getting increasingly difficult, and it doesn't support NativeWind
Made sense to switch.  Gluestack is relatively straightforward.
