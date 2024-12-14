import axios from '~/utils/custonizeAxiosAuth';
const API_URL = 'http://127.0.0.1:8000/api';

const user = {
  List: async () => {
    const result = await axios.get(`${API_URL}/users`);
    return result;
  },
  SignUp: async (data) => {
    const result = await axios.post(`${API_URL}/users`, data);
    return result;
  },
  Update: async (id, data) => {
    const result = await axios.put(`${API_URL}/users/${id}`, data);
    return result;
  },
  Delete: async (id) => {
    const result = await axios.delete(`${API_URL}/users/${id}`);
    return result;
  },
  AddNewMovie: async (data) => {
    const result = await axios.post(`http://127.0.0.1:8000/api/movies`, data);
    return result;
  },
  updateMovieRecommend: async (id, data) => {
    const result = await axios.put(`http://127.0.0.1:8000/api/movies/${id}`, data);
    return result;
  },
  deleteMovieRecommend: async (id) => {
    const result = await axios.delete(`http://127.0.0.1:8000/api/movies/${id}`);
    return result;
  },
};

export default user;
