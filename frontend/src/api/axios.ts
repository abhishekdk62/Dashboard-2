import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isLoginPage = window.location.pathname === '/login';
    const isRegisterPage = window.location.pathname === '/register';
    
    if (error.response?.status === 401 && !isLoginPage && !isRegisterPage) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
