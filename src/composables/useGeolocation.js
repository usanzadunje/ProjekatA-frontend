import { Geolocation } from '@capacitor/geolocation';


export function useGeolocation() {
    /* Methods */
    const getCurrentPosition = async() => {
        const position = await Geolocation.getCurrentPosition();

        return position.coords;
    };

    const watchPosition = () => {
        Geolocation.watchPosition({}, (position, err) => {
            if(err) alert(err);
            console.log(position);
        });
    };

    return {
        /* Methods */
        getCurrentPosition,
        watchPosition,
    };
}
