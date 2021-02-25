/* Middleware that handles whether logged in user has verified their e-mail or not and lets them continue to another route accordingly */

export default function verified({ next, store }) {
    const emailVerificationRoute = { path: "/email/verify" };

    if(!store.getters["auth/emailVerified"]) {
        store.dispatch("auth/getAuthUser").then(() => {
            if(!store.getters["auth/emailVerified"]) next(emailVerificationRoute);
            else next();
        });
    }else {
        next();
    }
}