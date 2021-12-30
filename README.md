## Frontend application of ProjekatA

1. Clone repo ```git clone https://github.com/usanzadunje/ProjekatA-frontend.git```
2. Copy .env.example into .env ```cp .env.example .env``` and populate values
    - VUE_APP_API_URL can be set to http://localhost or any other address backend is running on your device.
    - VUE_APP_STORED_IMAGES_URL can be set to http://localhost/storage/img
    - Before you add Google Maps API keys you will need
      to [enable Maps SDK for Android/iOS and Maps Javascript API](https://console.cloud.google.com/apis/library) (only
      ones you will actually use should be enabled)
    - Then you will need to generate [Google Maps API key](https://console.cloud.google.com/apis/credentials) (same key
      can go for iOS and Android).
    - For locales, you can choose between sr or en locale, Serbian language or English respectively.

### Start application using [Docker](https://docs.docker.com/get-docker/)

###### Note, using docker you are only able to preview application inside browser.

1. Position yourself inside root folder of this application inside terminal.
2. Run ```docker-compose up -d``` to run it in development mode with livereload while changing local files (all files in
   docker container are synced to your local ones be careful to install all dependencies locally).
3. Or you can run ```docker-compose -f docker-compose.prod.yml up -d``` to run production version which will copy files
   and bundle application up and run it despite you running npm install locally.
4. Preview application in browser [development](http://localhost:8100/) | [production](http://localhost/)
5. Application is built for mobile devices so running it in fullscreen may look odd. I suggest you open Chrome dev tools
   and select any mobile device from the list provided.

### Start application without [Docker](https://docs.docker.com/get-docker/)

###### We need to install few things.

#### Prerequisites

- [Nodejs & NPM](https://nodejs.org/en/)
- [Ionic CLI](https://ionicframework.com/docs/cli) or install it running following
  command ```npm install -g @ionic/cli```

###### Building mobile application (Android/iOS) requires few more things

- [Java 11+](https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html) (Android only)
- [Android Studio](https://developer.android.com/studio/)
- [Xcode](https://developer.apple.com/xcode/) (for macOS)

#### Steps for the WEB only

1. Open terminal inside root folder of this application.
2. Run ```npm install```.
3. Serving the application ```npm run serve```.
4. Preview it in a browser, application is built for mobile devices so running it in fullscreen may look odd. I suggest
   you open Chrome dev tools and select any mobile device from the list provided.

#### Steps for Android

1. Open terminal inside root folder of this application.
2. Run ```npm install```.
3. Run ```ionic cap run android``` and select device you want application to be emulated in Android Studio.
4. You could also run ```ionic cap run android --external``` which will do the same thing but also make application
   available in the browser.

#### Steps for iOS

1. Open terminal inside root folder of this application.
2. Run ```npm install```.
3. Position inside iOS App folder ```cd ios/App```.
4. You will need cocoapods pods installed, install them by running ```brew install cocoapods```.
5. Install pod dependencies by running ```pod install```.
6. Run ```ionic cap run ios``` and select device you want application to be emulated in Xcode.
4. You could also run ```ionic cap run ios --external``` which will do the same thing but also make application
   available in the browser.

#### If you do not want to bother with these steps but want to test application on real device you can contact me via e-mail on [dusan.djordjevic.biz@gmail.com](mailto:dusan.djordjevic.biz@gmail.com). I will need e-mail you are using for Google Play Store or App Store to add you as a tester after which you will be able to download application on your device and run it just like in the emulator.

!Hosted application server has been shut down therefore APK file will not work since it points to that server.!
### Download [Android apk file](https://www.mediafire.com/file/k9v1hzbtth57ulv/app-debug.apk/file) | [iOS ipa file](#) (not available yet)

# Contact

- E-mail: [dusan.djordjevic.biz@gmail.com](mailto:dusan.djordjevic.biz@gmail.com)
  | [dussann1997@live.com](mailto:dussann1997@live.comm)

<br>
