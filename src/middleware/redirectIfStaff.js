/*
    Middleware that handles whether staff user is trying to access routes
    for end-user(routes that are not for staff users) and redirect accordingly
*/

export default async function redirectIfStaff({ next, store, router }) {
    if(store.getters["auth/isStaff"]) {
        router.replace({ name: 'staff.dashboard' });
    }else {
        next();
    }
}