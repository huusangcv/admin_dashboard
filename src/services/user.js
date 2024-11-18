import axios from '~/utils/custonizeAxiosAuth';
const API_URL = 'https://api.newmoviesz.online/api';

const user = {
  SignUp: async (data) => {
    const result = await axios.post(`${API_URL}/users`, data);
    return result;
  },
  Update: async (id, data) => {
    const result = await axios.post(`${API_URL}/users/${id}`, data);
    return result;
  },
  Delete: async (id) => {
    const result = await axios.delete(`${API_URL}/users/${id}`);
    return result;
  },
};

export default user;
