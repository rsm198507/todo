import axios from "axios";

axios.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // token expired
        if (error.response.status === 404) {
            alert("error")
        }
        return Promise.reject(error)
    }
);
