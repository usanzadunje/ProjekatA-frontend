import { Geolocation } from '@capacitor/geolocation';


export function useGeolocation() {
    /* Methods */
    const getCurrentPosition = async() => {
        const position = await Geolocation.getCurrentPosition();

        return position.coords;
    };

    return {
        /* Methods */
        getCurrentPosition,
    };
}
