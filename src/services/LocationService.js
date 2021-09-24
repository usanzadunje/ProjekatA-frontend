import { AndroidPermissions }    from '@ionic-native/android-permissions';
import { LocationAccuracy }      from '@ionic-native/location-accuracy';
import { Capacitor }             from "@capacitor/core";

const LocationService = {
    // Checks if application has permissions to use GPS
    checkGPSPermission: async() => {
        return await new Promise((resolve) => {
            if(Capacitor.getPlatform() !== 'web') {
                AndroidPermissions.checkPermission(AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
                    (result) => {
                        if(result.hasPermission) {
                            // Shows 'Turn On GPS' dialogue
                            resolve(true);
                        }else {
                            // Doesn't have permission
                            resolve(false);
                        }
                    },
                    () => {
                        alert('Something is wrong with location settings.');
                    },
                );
            }else {
                resolve(true);
            }
        });
    },

    requestGPSPermission: async() => {
        return await new Promise((resolve) => {
            LocationAccuracy.canRequest().then((canRequest) => {
                if(canRequest) {
                    resolve('CAN_REQUEST');
                }else {
                    // Show 'GPS Permission Request' dialogue
                    AndroidPermissions.requestPermission(AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
                                      .then(
                                          (result) => {
                                              if(result.hasPermission) {
                                                  // call method to turn on GPS
                                                  resolve('GOT_PERMISSION');
                                              }else {
                                                  resolve('DENIED_PERMISSION');
                                              }
                                          },
                                          () => {
                                              // Show alert if users click on 'No Thanks'
                                              alert('Location features might not work correctly.')
                                          },
                                      );
                }
            });
        });
    },

    askToTurnOnGPS: async() => {
        return await new Promise((resolve) => {
            LocationAccuracy.canRequest().then((canRequest) => {
                if(canRequest) {
                    // the accuracy option will be ignored by iOS
                    LocationAccuracy.request(LocationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                        () => {
                            resolve(true);
                        },
                        () => {
                            resolve(false);
                        });
                }else {
                    resolve(false);
                }
            });
        });
    },
};
export default LocationService;