<p align="center">

</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
</p>

## Description

There are two servers in FastFriends: backend and frontend.  Refer to each subdirectory's readme to install and run those servers.

## Stay in touch

- Author - [Russ Vernick](mailto:rvernick@yahoo.com)
- ToDo - [FastFriends Pivot](https://www.pivotaltracker.com/n/projects/2639100)
- iOS App - Coming soon

## Rebuilt with Expo Navigator and Paper
Followed instructions on Themes with Expo Router https://hemanshum.medium.com/the-ultimate-guide-to-custom-theming-with-react-native-paper-expo-and-expo-router-8eba14adcab3
Resetting the project move examples from app to app-example (super helpful)

Started with the following steps:
```
npx create-expo-app@latest
cd frontend/
npm i @tanstack/react-query
npm install react-native-safe-area-context
npx expo install expo-secure-store
npm run reset-project
npm install react-native-paper
```
Tweaked index and layout files to incorporate light/dark modes and most of the theme info