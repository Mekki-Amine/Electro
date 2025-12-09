import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
