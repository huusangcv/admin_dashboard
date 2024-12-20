import axios from '~/utils/custonizeAxiosAuth';
const API_URL = 'https://api.newmoviesz.online/api';

const user = {
  List: async () => {
    const result = await axios.get(`${API_URL}/users`);
    return result;
  },
  Login: async (data) => {
    const result = await axios.post(`${API_URL}/login`, data);
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
  Search: async (searchName, page = 1) => {
    const result = await axios.get(`${API_URL}/users?q=${searchName}&page=${page}`);
    return result;
  },
  getListMoviesRecommend: async () => {
    const result = await axios.get(`${API_URL}/movies`);
    return result;
  },
  AddNewMovie: async (data) => {
    const result = await axios.post(`${API_URL}/movies`, data);
    return result;
  },
  updateMovieRecommend: async (id, data) => {
    const result = await axios.put(`${API_URL}/movies/${id}`, data);
    return result;
  },
  deleteMovieRecommend: async (id) => {
    const result = await axios.delete(`${API_URL}/movies/${id}`);
    return result;
  },
};

export default user;
