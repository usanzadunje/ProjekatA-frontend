/*
    Middleware that handles whether staff user is trying to access routes
    for end-user(routes that are not for staff users) and redirect accordingly
*/

export default function redirectIfStaff({ to, next, store }) {
    const homeStaffRoute = { name: 'staff.home' };
    let isStaffRoute = to.path.split('/')[1] === 'staff';

    if(store.getters["auth/loggedIn"]) {
        if(store.getters["auth/isStaff"] && !isStaffRoute) {
            next(homeStaffRoute);
        }else {
            next();
        }
    }else {
        next();
    }
}