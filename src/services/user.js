import axios from '~/utils/custonizeAxiosAuth';
const API_URL = 'https://api.newmoviesz.online/api';

const user = {
  SignUp: async (data) => {
    const result = await axios.post(`${API_URL}/users`, data);
    return result;
  },
};

export default user;
