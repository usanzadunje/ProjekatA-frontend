import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
export default {
    getUserFromProvider(driver) {
        if(driver === 'google') {
            return useGoogle();
        }
        if(driver === 'facebook') {
            useFacebook();
        }
    },
};

const useGoogle = async() => {
    const googleUser = await GoogleAuth.signIn();
    return {
        fname: googleUser.givenName,
        lname: googleUser.familyName,
        email: googleUser.email,
        avatar: googleUser.imageUrl,
        provider_id: googleUser.id,
    };
};
const useFacebook = async() => {
    console.log('facebook');
};