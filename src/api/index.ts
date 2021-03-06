import Axios from 'axios'
import AppModule from "@/store/modules/app";
import {getToken} from "@/utils/auth";

let instance = Axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
    },
    timeout: 30000
});

// 接口请求拦截器
instance.interceptors.request.use(request => {
    request.headers.Authorization = getToken();
    request.headers.AppVersion = AppModule.appVersion;
    return request
});

// 接口回调拦截器
instance.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        if (!error.response) {
            return {
                code: 400,
                msg: error.message
            }
        }
        switch (error.response.status) {
            case 401:
                localStorage.clear();
                if (window.$route.name !== 'Login') {
                    window.$router.replace({name: 'Login'});
                }
                break;
            case 500:
                break
        }
        return error
    }
);

export default instance
