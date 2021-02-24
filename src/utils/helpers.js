import router from "@/router";

export const getError = (error) => {
    const errorMessage = "API Error, please try again.";

    if(error.response.status === 404) {
        if(router.currentRoute.name !== "notFound")
            router.push({ path: "/404" });
    }

    if(error.response.data && error.response.data.errors) {
        return error.response.data.errors;
    }

    return errorMessage;
};