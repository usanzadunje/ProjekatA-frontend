import {
    Plugins,
} from '@capacitor/core';


export function useGeolocation() {
    /* Global properties */
    const { Geolocation } = Plugins;

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
        getCurrentPosition,
        watchPosition,
    };
}
