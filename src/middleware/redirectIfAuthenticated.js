export default function redirectIfAuthenticated({ from, next, store }) {
    if(store.getters["auth/loggedIn"]) {
        next(from);
    }else {
        next();
    }
}