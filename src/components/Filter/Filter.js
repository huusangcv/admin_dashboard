import classNames from 'classnames/bind';
import filter from './Options';
import styles from './Filter.module.scss';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { moviesOnMultiline } from '~/redux/selector/selector';
import { useNavigate } from 'react-router-dom';
import { getMoviesOnMultiline } from '~/redux/actions';
import { useQueryParams, StringParam, NumberParam } from 'use-query-params';

const cx = classNames.bind(styles);

const Filter = ({ noneMultiline, movieType, genreCurrent, index }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMultiline = useSelector(moviesOnMultiline);

  const [query, setQuery] = useQueryParams({
    type: StringParam,
    genre: StringParam,
    country: StringParam,
    year: NumberParam,
    sort: StringParam,
  });

  const { type, genre, country, year, sort } = query;

  const isOnBrowsePage = window.location.pathname.startsWith('/browse');
  const handleSelectMovies = (e) => {
    const newType = e.target.value;
    if (newType === '') {
      setQuery({ genre, country, year, sort }, 'push');
    } else {
      if (!isOnBrowsePage) {
        const queryString = new URLSearchParams({ type: newType }).toString();
        navigate(`/browse?${queryString}`);
      }
      setQuery({ type: newType, genre, country, year, sort }, 'push');
    }
  };

  const handleSelectType = (e) => {
    const newGenre = e.target.value;
    if (newGenre === '') {
      setQuery({ type, country, year, sort }, 'push');
    } else {
      if (!isOnBrowsePage) {
        let queryString;
        if (movieType) {
          queryString = new URLSearchParams({ type: movieType, genre: newGenre }).toString();
        } else {
          queryString = new URLSearchParams({ genre: newGenre }).toString();
        }
        navigate(`/browse?${queryString}`);
      }

      if (movieType) {
        setQuery({ type: movieType, genre: newGenre, country, year, sort }, 'push');
      } else {
        setQuery({ type, genre: newGenre, country, year, sort }, 'push');
      }
    }
  };

  const handleSelectNations = (e) => {
    const newCountry = e.target.value;
    if (newCountry === '') {
      setQuery({ type, genre, year, sort }, 'push');
    } else {
      if (!isOnBrowsePage) {
        let queryString;
        if (movieType) {
          queryString = new URLSearchParams({ type: movieType, country: newCountry }).toString();
        } else {
          queryString = new URLSearchParams({ country: newCountry }).toString();
        }
        navigate(`/browse?${queryString}`);
      }
      if (movieType) {
        setQuery({ type: movieType, genre, country: newCountry, year, sort }, 'push');
      } else {
        setQuery({ type, genre, country: newCountry, year, sort }, 'push');
      }
    }
  };

  const handleSelectYears = (e) => {
    const newYear = e.target.value;
    if (newYear === '') {
      setQuery({ type, genre, country, sort }, 'push');
    } else {
      if (!isOnBrowsePage) {
        let queryString;
        if (movieType) {
          queryString = new URLSearchParams({ type: movieType, year: newYear }).toString();
        } else {
          queryString = new URLSearchParams({ year: newYear }).toString();
        }
        navigate(`/browse?${queryString}`);
      }

      if (movieType) {
        setQuery({ type: movieType, genre, country, year: newYear, sort }, 'push');
      } else {
        setQuery({ type, genre, country, year: newYear, sort }, 'push');
      }
    }
  };

  const handleSelectSortBy = (e) => {
    const newSort = e.target.value;
    if (newSort === '') {
      setQuery({ type, genre, country, year }, 'push');
    } else {
      if (!isOnBrowsePage) {
        let queryString;
        if (movieType) {
          queryString = new URLSearchParams({ type: movieType, sort: newSort }).toString();
        } else {
          queryString = new URLSearchParams({ sort: newSort }).toString();
        }
        navigate(`/browse?${queryString}`);
      }

      if (movieType) {
        setQuery({ type: movieType, genre, country, year, sort: newSort }, 'push');
      } else {
        setQuery({ type, genre, country, year, sort: newSort }, 'push');
      }
    }
  };

  const handleActiveIsMultiline = () => {
    if (!isMultiline) {
      dispatch(getMoviesOnMultiline(true));
    }
  };

  const handleActiveIsPanel = () => {
    if (isMultiline) {
      dispatch(getMoviesOnMultiline(false));
    }
  };

  return (
    <div className={cx('wapper')}>
      <div className={cx('filter')}>
        <div className={cx('columns', noneMultiline && 'noneMultiline')}>
          <div className={cx('column')}>
            <div className={cx('field')}>
              <label htmlFor="" className={cx('label')}>
                Loại phim:
              </label>
              <div className={cx('control')}>
                <div className={cx('select')}>
                  <select
                    name=""
                    id=""
                    value={(movieType && movieType) || (type && type) || ''}
                    onChange={handleSelectMovies}
                  >
                    <option value="">- Tất cả -</option>
                    {filter?.movies.map((movie) => {
                      return (
                        <option value={movie.slug} key={movie.id}>
                          {movie.text}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className={cx('column')}>
            <div className={cx('field')}>
              <label htmlFor="" className={cx('label')}>
                Thể loại:
              </label>
              <div className={cx('control')}>
                <div className={cx('select')}>
                  <select
                    name=""
                    id=""
                    onChange={handleSelectType}
                    value={(genreCurrent === 'genre' && index) || (genre && genre) || ''}
                  >
                    <option value="">- Tất cả -</option>
                    {filter?.types.map((type) => (
                      <option value={type.slug} key={type.id}>
                        {type.text}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className={cx('column')}>
            <div className={cx('field')}>
              <label htmlFor="" className={cx('label')}>
                Quốc gia:
              </label>
              <div className={cx('control')}>
                <div className={cx('select')}>
                  <select
                    name=""
                    id=""
                    onChange={handleSelectNations}
                    value={(genreCurrent === 'country' && index) || (country && country) || ''}
                  >
                    <option value="">- Tất cả -</option>
                    {filter?.nations.map((nation) => (
                      <option value={nation.slug} key={nation.id}>
                        {nation.text}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className={cx('column')}>
            <div className={cx('field')}>
              <label htmlFor="" className={cx('label')}>
                Năm:
              </label>
              <div className={cx('control')}>
                <div className={cx('select')}>
                  <select
                    name=""
                    id=""
                    onChange={handleSelectYears}
                    value={(genreCurrent === 'year' && index) || (year && year) || ''}
                  >
                    <option value="">- Tất cả -</option>
                    {filter?.years.map((year) => (
                      <option value={year.slug} key={year.id}>
                        {year.text}
                      </option>
                    ))}
                    <option value={Math.floor(Math.random() * 10) + 1990}>Trước 2000</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className={cx('column')}>
            <div className={cx('field')}>
              <label htmlFor="" className={cx('label')}>
                Sắp xếp:
              </label>
              <div className={cx('control')}>
                <div className={cx('select')}>
                  <select name="" id="" onChange={handleSelectSortBy} value={(sort && sort) || ''}>
                    {filter?.sortBy.map((sort) => (
                      <option value={sort.slug} key={sort.id}>
                        {sort.text}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          {noneMultiline || (
            <div className={cx('column', 'view', 'is-6-mobile', 'is-narrow')}>
              <div className={cx('field')}>
                <label className={cx('label')}>Hiển thị:</label>
              </div>
              <div>
                <a href="#!" className={isMultiline && cx('active')} onClick={handleActiveIsMultiline}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M96 96c0 26.51-21.49 48-48 48S0 122.51 0 96s21.49-48 48-48 48 21.49 48 48zM48 208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm0 160c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm96-236h352c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h352c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h352c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
                  </svg>
                </a>
                <a href="#!" className={!isMultiline && cx('active')} onClick={handleActiveIsPanel}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M149.333 56v80c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24h101.333c13.255 0 24 10.745 24 24zm181.334 240v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm32-240v80c0 13.255 10.745 24 24 24H488c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24zm-32 80V56c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm-205.334 56H24c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24zM0 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zm386.667-56H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zm0 160H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zM181.333 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24z"></path>
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(Filter);
