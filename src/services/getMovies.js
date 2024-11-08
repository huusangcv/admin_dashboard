import axios from '~/utils/customizeAxios';

const getMovies = {
  Single: async (page) => {
    const result = await axios.get(`danh-sach/phim-le?page=${page}`);
    return result.data;
  },
  Series: async (page) => {
    const result = await axios.get(`danh-sach/phim-bo?page=${page}`);
    return result.data;
  },
  New: async (page) => {
    const result = await axios.get(`danh-sach/phim-moi?page=${page}`);
    return result.data;
  },
  Top: async (page, movieType = '') => {
    const result = await axios.get(`danh-sach/${movieType}?page=${page}&sort_field=view&year=2024`);
    return result.data;
  },
  Browse: async (moviesType, page, type = '', nation = '', year = '', sortBy = '') => {
    const result = await axios.get(
      `danh-sach/${moviesType}?page=${page}&sort_field=${sortBy}&category=${type}&country=${nation}&year=${year}`,
    );
    return result.data;
  },
  Detail: async (slug) => {
    const result = await axios.get(`phim/${slug}`);
    return result.data;
  },
  Search: async (keyword, page = 1) => {
    const result = await axios.get(`tim-kiem?keyword=${keyword}&page=${page}`);
    return result.data;
  },
  newUpdateSeries: async () => {
    const result = await axios.get(`danh-sach/phim-bo-dang-chieu?sort_field=modified.time&category=&country=&year=`);
    return result.data;
  },
  newUpdateSingle: async () => {
    const result = await axios.get(`danh-sach/phim-le?sort_field=modified.time&category=&country=&year=2024`);
    return result.data;
  },
};

export default getMovies;
