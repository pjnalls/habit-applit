<div align="center">
  <img alt="icon" src="./assets/images/icon.png" width="64">
</div>

<h1 align="center"> 
  Habit AppLit
</h1>

<h3 align="center">
  📆🔥📈 a 'lit'tle habit tracker app for creation, tracking, and streak-visualization of habits for iOS, Android, and the Web
</h3>

<br/>

<div align="center">
  <img alt="iPhone demo image" src="./assets/images/preview/ios.avif" width="200px">
  <img alt="Android-phone demo image" src="./assets/images/preview/android.avif" width="190px">
  <img alt="Web demo image" src="./assets/images/preview/desktop.avif" width="300px">
</div>

This app is also available in dark mode:

<div align="center">
  <img alt="iPhone demo image" src="./assets/images/preview/ios-dark.avif" width="200px">
  <img alt="Android-phone demo image" src="./assets/images/preview/android-dark.avif" width="190px">
  <img alt="Web demo image" src="./assets/images/preview/desktop-dark.avif" width="300px">
</div>

## System Prerequisites

Ensure you have the latest LTS (long-term support) version of [Node.js](https://nodejs.org/) installed on your system.

Recommended installation instructions are available [here](https://nodejs.org/en/download/package-manager).

## Local Project Setup

Somewhere in your file system, run either

```bash
$ git clone https://github.com/pjnalls/habit-applit.git
```

if you aren't connect to GitHub with any SSH keys, **_or_**

```bash
$ git clone git@github.com:pjnalls/habit-applit.git
```

if you are.

Next, navigate to the root of the newly cloned project by running the following:

```bash
$ cd habit-applit/
```

Then, install a `node_modules` folder for all the project's dependencies:

```bash
$ npm i
```

## [EAS](https://docs.expo.dev/build/introduction/) Project Builds

Ensure the `eas-cli` is installed globally on your machine:

```bash
$ npm i -g eas-cli
```

Run the following command and follow the instructions in the CLI to create EAS builds for iOS (Apple Developer account needed) and Android:

```bash
$ eas build --profile development --platform all
```

Alternatively, you can build for a single platform at a time as builds may take some time to complete:

Run

```bash
$ eas build --profile development --platform ios
```

to create EAS builds for iOS only, and run

```bash
$ eas build --profile development --platform android
```

to create EAS builds for iOS only.

## Run iOS, Android, and/or Web Apps

Run the following to run the Expo app:

```bash
$ npm start
```

Then, scan the barcode that appears and run the React Native app from an iOS or and Android device.

Press `w` to open the web version of the React Native app in the browser.

**NOTE**: It's possible to run an iPhone, Android phone, and the browser on the same React Native app instance for cross-platform development. Also, simultaneous, universal Fast Refresh has been enabled for this app.
