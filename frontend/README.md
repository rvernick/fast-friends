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

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Rebuilt with Expo Navigator and Paper
Followed instructions on Themes with Expo Router https://hemanshum.medium.com/the-ultimate-guide-to-custom-theming-with-react-native-paper-expo-and-expo-router-8eba14adcab3
Resetting the project move examples from app to app-example (super helpful)

Started with the following steps:
```
npx create-expo-app@latest
cd frontend/
npm i @tanstack/react-query
# npm install react-native-safe-area-context
npx expo install expo-secure-store
npm run reset-project
npm install react-native-paper
# npm i react-native-app-auth
npm i react-native-error-boundary
npm i @react-native-async-storage/async-storage
npm i react-native-paper-dropdown
```
Tweaked index and layout files to incorporate light/dark modes and most of the theme info