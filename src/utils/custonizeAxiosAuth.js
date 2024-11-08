import axios from 'axios';

const instanceUser = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

const hasCookie = () => {
  return document.cookie.split(';').some((item) => item.trim().startsWith('token='));
};

// Add a request interceptor
instanceUser.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = hasCookie();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
instanceUser.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return error && error.response ? error.response.data : Promise.reject(error);
  },
);

export default instanceUser;
