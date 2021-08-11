/*
    Middleware that handles whether staff user is trying to access routes
    for end-user(routes that are not for staff users) and redirect accordingly
*/

export default function redirectIfStaff({ next, store }) {
    const homeStaffRoute = { name: 'staff.home' };

    if(store.getters["auth/isStaff"]) {
        next(homeStaffRoute);
    }else {
        next();
    }
}