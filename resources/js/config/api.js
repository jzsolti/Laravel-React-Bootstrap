import axios from 'axios';

/*
const instance = axios.create({
    headers: { 'Content-Type': 'application/json' },
    baseURL: 'http://127.0.0.1:8000/api',
    withCredentials: true
});
function createAxiosResponseInterceptor(axiosInstance) {
    axiosInstance.interceptors.response.use(function (response) {
        return response;
      }, function (error) {
        if (error.response && error.response.status === 404) {
    
            alert('404');
            //history.push("/_404");
        }
        return Promise.reject(error);
      });
}
createAxiosResponseInterceptor(instance);
export default instance;
*/
export default axios.create({
    headers: { 'Content-Type': 'multipart/form-data' },
    baseURL: 'http://127.0.0.1:8000/api',
    withCredentials: true
});