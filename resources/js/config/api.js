import axios from 'axios';

export default axios.create({
    headers: { 'Content-Type': 'application/json' },
    baseURL: 'http://127.0.0.1:8000/api',
    withCredentials: true
});