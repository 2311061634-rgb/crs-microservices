
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor tu Buoi 7, giu nguyen
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('crs_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor MOI o Buoi 8: Xu ly ca 401 va 403 de tu dong chuyen ve /login
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            axios.isAxiosError(error) &&
            (error.response?.status === 401 || error.response?.status === 403)
        ) {
            localStorage.removeItem('crs_token');
            localStorage.removeItem('crs_user');
            // Dung window.location thay vi useNavigate() vi day la file thuan TypeScript,
            // khong phai component khong the dung React Hook o day
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;