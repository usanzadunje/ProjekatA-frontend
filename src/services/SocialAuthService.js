import { GoogleAuth }    from '@codetrix-studio/capacitor-google-auth';
import { FacebookLogin } from '@capacitor-community/facebook-login';

export default {
    getUserFromProvider(driver) {
        if(driver === 'google') {
            return useGoogle();
        }
        if(driver === 'facebook') {
            return useFacebook();
        }
    },
};

const useGoogle = async() => {
    const googleUser = await GoogleAuth.signIn();

    return {
        fname: googleUser.givenName || '',
        lname: googleUser.familyName || '',
        email: googleUser.email,
        avatar: googleUser.imageUrl || 'default.png',
        provider_id: googleUser.id,
    };
};
const useFacebook = async() => {
    await FacebookLogin.login({ permissions: ['email'] });

    const facebookUser = await FacebookLogin.getProfile({ fields: ['email', 'name'] });

    return {
        fname: facebookUser.name.split(' ')[0] || '',
        lname: facebookUser.name.split(' ')[1] || '',
        email: facebookUser.email,
        avatar: 'default.png',
        provider_id: facebookUser.id,
    };
};