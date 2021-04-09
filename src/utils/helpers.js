import router from "@/router";

export function getError(error) {
    const errorMessage = { apiError: ["API Error, please try again."] };

    if(error.response.status === 404) {
        if(router.currentRoute.name !== "notFound")
            router.push({ path: "/404" });
    }

    if(error.response.data && error.response.data.errors) {
        return error.response.data.errors;
    }

    return errorMessage;
}

export function pluck(array, key) {
    return array.map(function(item) {
        return item[key];
    });
}