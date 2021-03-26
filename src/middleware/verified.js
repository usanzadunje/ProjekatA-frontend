/* Middleware that handles whether logged in user has verified their e-mail or not and lets them continue to another route accordingly */

export default function verified({ next, store }) {
    const emailVerificationRoute = { name: 'email.notice' };
    const loginRoute = { name: 'login' };

    if(!store.getters["auth/loggedIn"]) {
        store.dispatch("auth/getAuthUser")
             .then(() => {
                 if(!store.getters["auth/emailVerified"]) next(emailVerificationRoute);
                 else next();
             }).catch(() => next(loginRoute));
    }else {
        if(store.getters["auth/emailVerified"]) next();
        else next(emailVerificationRoute);
    }
}