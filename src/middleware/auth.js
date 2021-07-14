/* Middleware that handles whether user is logged in or not and lets them continue to another route accordingly */

export default async function auth({ next, store }) {
    const loginRoute = { name: "login" };

    if(await store.dispatch("auth/getAuthUser")) {
        next();
    }else {
        next(loginRoute)
    }
}