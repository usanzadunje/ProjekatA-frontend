import { onMounted } from 'vue';
import { Geolocation } from '@capacitor/geolocation';


export function useGeolocation() {
    let geoPermission = false;
    onMounted(async () => {
        let permission = await Geolocation.checkPermissions();
        geoPermission = permission.location === 'granted'

        if(!geoPermission){
            let permission = await Geolocation.requestPermissions();

            if(permission.location === 'granted'){
                alert('Location permissions not granted.')
            }
        }
    })


    /* Methods */
    const getCurrentPosition = async() => {
        const options = {
            enableHighAccuracy: true,
            timeout: 1000,
        };
        const position = await Geolocation.getCurrentPosition(options);

        const { latitude, longitude } = position.coords;

        return { latitude, longitude };
    };

    return {
        /* Methods */
        getCurrentPosition,
    };
}
