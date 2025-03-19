import axios, { CanceledError } from 'axios';

export { CanceledError };

const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
});
export const fetchRecipeOfTheDay = async () => {
    try {
        const response = await apiClient.get('/api/recipe');
        return response.data;
    } catch (error) {
        console.error('Error fetching recipe of the day:', error);
        throw error;
    }
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }
        const originalRequest = error.config;
        if (!error.response) {
            console.error("Network or unknown error occurred", error.message);
            return Promise.reject(error);
        }
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = JSON.parse(localStorage.getItem('refreshToken') || '""');
            if (!refreshToken) {
                console.error("Refresh token not found");
                return Promise.reject(new Error('Refresh token not found'));
            }
            try {
                const res = await apiClient.post('/auth/refresh', { refreshToken });
                const { accessToken } = res.data;
                localStorage.setItem('accessToken', accessToken);
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                if(refreshError instanceof Error)
                console.error('Failed to refresh token:', refreshError.message);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
export default apiClient;
