import './recommend.scss';
import user from '~/services/user';
import getMovies from '~/services/getMovies';
import Header from '../../components/Header';
import { tokens } from '../../theme';
import { Avatar, Box, Typography, useTheme, IconButton, InputBase } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import Button2 from '@mui/material/Button';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Stack from '@mui/material/Stack';
import React, { useState, useEffect, useRef } from 'react';
import { RiArrowGoBackFill } from 'react-icons/ri';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { FaFilter, FaSearch, FaBackspace } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import Spinner from '~/components/Spinner';
import { confirmAlert } from 'react-confirm-alert'; // Import
const Recommend = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [dataMovie, setDataMovie] = useState('');
  const [movies, setMovies] = useState();
  const [moviesSearch, setMoviesSearch] = useState();
  const [movie, setMovie] = useState();
  const [show, setShow] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearchMovies, setShowSearchMovies] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [slug, setSlug] = useState();
  const [page, setPage] = useState(1);
  const [nameMovie, setNameMovies] = useState('');
  const [dataSearchMovies, setDataSearchMovies] = useState('');
  const [loading, setLoading] = useState(false);
  const [nameVi, setNameVi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [thumb, setThumb] = useState('');
  const [dataUpdateMovie, setDataUpdateMovie] = useState('');
  const [idDeleteMovieRecommend, setIdDeleteMovieRecommend] = useState('');
  const [searchName, setSearchName] = useState('');
  const [dataSearch, setDataSearch] = useState('');
  const [dataMoviesRecommendSearch, setDataMoviesRecommendSearch] = useState('');
  const tableRef = useRef(null);

  //Fetch Movies All
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await fetch(`https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page}`);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const movies = await response.json();
        if (movies.status) {
          setMovies(movies);
        }
      } catch (error) {}
    };
    fetchApi();
  }, [page]);

  //Fetch Movies recommends
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const { data, success } = await user.getListMoviesRecommend();
        if (success) {
          setData(data.data);
        }
      } catch (error) {}
    };
    fetchApi();
  }, [dataMovie, dataUpdateMovie, idDeleteMovieRecommend]);

  //Fetch movie detail
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const movie = await getMovies.Detail(slug);
        if (movie) {
          setMovie(movie.item);
        }
      } catch (error) {}
    };
    fetchDetail();
  }, [slug]);

  //[POST] => Fetch: add new movie
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const movie = await user.AddNewMovie(dataMovie);
        if (movie.status) {
          alert(movie.message);
          setData((prev) => [...prev, movie.data]);
          setDataMovie('');
          setShow(false);
          setShowDetail(false);
          setLoading(false);
        } else {
          alert(movie.message);
        }
      } catch (error) {}
    };

    if (dataMovie !== '') {
      fetchDetail();
    } else {
      setLoading(false);
    }
  }, [dataMovie, dataMovie !== '']);

  //Fetch  Movies search
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const movies = await getMovies.Search(nameMovie);
        if (movies) {
          setMoviesSearch(movies.items);
          setLoading(false);
          setShowSearchMovies(false);
          setDataSearchMovies('');
          setNameMovies('');
        } else {
          alert('Lỗi khi tìm phim');
          setLoading(false);
        }
      } catch (error) {}
    };

    if (dataSearchMovies !== '' && nameMovie !== '') {
      fetchDetail();
    }
  }, [dataSearchMovies]);

  //fetch Update movie recommend
  useEffect(() => {
    const fetchUpdateMovieRecommend = async () => {
      const { success, message } = await user.updateMovieRecommend(selectedRow.id, dataUpdateMovie);
      if (success) {
        alert(message);
        setNameVi('');
        setNameEn('');
        setThumb('');
        setDataUpdateMovie('');
        setSelectedRow(null);
      } else {
        alert('Cập nhật thất bại');
      }
      try {
      } catch (error) {}
    };
    if (dataUpdateMovie !== '') {
      fetchUpdateMovieRecommend();
    }
  }, [dataUpdateMovie]);

  //fetch delete movie recommend
  useEffect(() => {
    const fetchDeleteMovieRecommend = async () => {
      const { success, message } = await user.deleteMovieRecommend(idDeleteMovieRecommend);
      if (success) {
        alert(message);
        setIdDeleteMovieRecommend('');
        setSelectedRow(null);
      } else {
        alert('Cập nhật thất bại');
      }
      try {
      } catch (error) {}
    };
    if (idDeleteMovieRecommend !== '') {
      fetchDeleteMovieRecommend();
    }
  }, [idDeleteMovieRecommend]);

  //fetch api search movies recommend
  useEffect(() => {
    const fetchSearchMovies = async () => {
      const { success, message, data } = await getMovies.SearchRecommend(searchName);
      if (success) {
        setDataMoviesRecommendSearch(data.data);
      } else {
        alert(message);
      }
      try {
      } catch (error) {}
    };
    if (dataSearch !== '') {
      fetchSearchMovies();
    }
  }, [dataSearch]);

  //Settings column for list movies recommending
  const columns = [
    { field: 'id', headerName: 'Id', width: 50 },
    {
      field: 'name_vi',
      headerName: 'Tên',
      width: 200,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'name_en',
      headerName: 'Tên tiếng anh',
      width: 200,
      cellClassName: 'name-column--cell',
    },
    {
      field: 'thumb',
      headerName: 'Ảnh',
      width: 100,
      renderCell: ({ row: { thumb } }) => {
        return (
          <Avatar
            alt="Image"
            src={`https://ophim17.cc/_next/image?url=http%3A%2F%2Fimg.ophim1.com%2Fuploads%2Fmovies%2F${thumb}&w=384&q=75`}
            sx={{ width: 50, height: 50 }}
          />
        );
      },
    },
    {
      field: 'rate',
      headerName: 'Đánh giá',
      width: 120,
      renderCell: ({ row: { rate } }) => {
        return (
          <Box width="100%" m="0 auto" p="5px" display="flex" alignItems="center" borderRadius="4px">
            <Typography color={colors.grey[100]}>
              <ThumbUpIcon /> {rate}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'vote_count',
      headerName: 'Lượt đánh giá',
      width: 120,
    },
    {
      field: 'year',
      headerName: 'Năm công chiếu',
      width: 120,
    },
    {
      field: 'slug',
      headerName: 'Xem phim',
      width: 120,
      renderCell: ({ row: { slug } }) => {
        return (
          <Box
            width="100%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={colors.greenAccent[800]}
            borderRadius="4px"
            cursor="pointer"
          >
            <Typography
              color={colors.grey[100]}
              sx={{ ml: '5px' }}
              onClick={() => (window.href = `https://newmoviesz.online/movie/${slug}`)}
            >
              Xem phim
            </Typography>
          </Box>
        );
      },
    },
  ];

  const handlePageClick = (e) => {
    setPage(e.selected + 1);

    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddNewMovie = () => {
    setDataMovie({
      name_en: movie?.origin_name,
      name_vi: movie?.name,
      thumb: movie?.thumb_url,
      slug: movie?.slug,
      year: movie?.year,
      rate: movie?.tmdb.vote_average,
      vote_count: movie?.tmdb.vote_count,
    });

    setLoading(true);
  };

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    setNameVi(params.row.name_vi);
    setNameEn(params.row.name_en);
    setThumb(params.row.thumb);
  };

  const handleSubmitSearchMovies = () => {
    setDataSearchMovies(nameMovie);
    setLoading(true);
  };

  const handleUpdateMovie = () => {
    setDataUpdateMovie({
      name_en: (nameEn !== selectedRow.name_en && nameEn) || 'null',
      name_vi: (nameVi !== selectedRow.name_vi && nameVi) || 'null',
      thumb: (thumb !== selectedRow.thumb && thumb) || 'null',
    });
  };

  const handleDeleteMovieRecommend = async () => {
    confirmAlert({
      title: 'Xác nhận xoá',
      message: 'Bạn có chắc muốn xoá phim này.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            setIdDeleteMovieRecommend(selectedRow.id);
            setShowModal(false);
          },
        },
        {
          label: 'No',
          onClick: () => setShowModal(true),
        },
      ],
    });
  };

  const handleDataSearch = () => {
    setDataSearch(searchName);
  };

  return (
    <>
      <Box display="flex" backgroundColor={colors.primary[400]} p={0.2} borderRadius={1}>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search"
          onChange={(e) => setSearchName(e.target.value)}
          value={searchName}
        />
        {searchName !== '' && (
          <IconButton
            type="button"
            onClick={() => {
              setSearchName('');
              setDataMoviesRecommendSearch('');
            }}
          >
            <ClearIcon />
          </IconButton>
        )}
        <IconButton type="button" onClick={handleDataSearch}>
          <SearchIcon />
        </IconButton>
      </Box>
      <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="Đề cử" subtitle="Phim đề cử" />
        </Box>
        <Box
          m="8px 0 0 0"
          height="80vh"
          sx={{
            '& .MuiDataGrid-root': {
              border: 'none',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: 'none',
            },
            '& .name-column--cell': {
              color: colors.greenAccent[300],
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: colors.blueAccent[700],
              borderBottom: 'none',
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: colors.primary[400],
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: 'none',
              backgroundColor: colors.blueAccent[700],
            },
            '& .MuiCheckbox-root': {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Button2
              size="small"
              sx={{ color: '#fff', background: '#5ebbff' }}
              className="btn-primary"
              onClick={() => setShow(true)}
            >
              <AddIcon /> Thêm mới phim đề cử
            </Button2>
          </Stack>
          <DataGrid
            rows={(dataSearch !== '' && dataMoviesRecommendSearch) || data}
            columns={columns}
            onRowClick={handleRowClick}
          ></DataGrid>
        </Box>
      </Box>

      <Modal show={selectedRow !== null} onHide={() => setSelectedRow(null)} style={{ padding: 0 }}>
        <Modal.Header closeButton>
          <Modal.Title className="form-label">Chi tiết phim đề cử</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Tên Tiếng Việt</Form.Label>
              <Form.Control type="text" value={nameVi} autoFocus onChange={(e) => setNameVi(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Tên Tiếng Anh</Form.Label>
              <Form.Control type="text" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Slug Ảnh</Form.Label>
              <Form.Control type="text" value={thumb} onChange={(e) => setThumb(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlFile">
              <img
                style={{ width: 50 }}
                src={`https://ophim17.cc/_next/image?url=http%3A%2F%2Fimg.ophim1.com%2Fuploads%2Fmovies%2F${thumb}&w=192&q=75`}
                alt=""
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" type="submit" onClick={handleDeleteMovieRecommend}>
            Xoá
          </Button>

          <Button className="ms-auto" variant="secondary" onClick={() => setSelectedRow(null)}>
            Huỷ
          </Button>
          <Button variant="primary" type="submit" onClick={handleUpdateMovie}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>

      <div className={(show && 'modal-recommend') || 'hide'}>
        <table className="table table-striped" ref={tableRef}>
          <thead>
            <tr>
              <th>TÊN</th>
              <th>NĂM</th>
              <th>ĐÁNH GIÁ</th>
              <th>ĐỊNH DẠNG</th>
              <th>NGÀY CẬP NHẬT</th>
              <th>TiỆN ÍCH</th>
            </tr>
          </thead>
          {(moviesSearch && (
            <tbody>
              {moviesSearch &&
                moviesSearch.length > 0 &&
                moviesSearch.map((movie) => {
                  return (
                    <tr key={movie._id}>
                      <td>
                        <div className="d-flex align-items-center gap-10">
                          <div>
                            <img
                              src={`https://ophim17.cc/_next/image?url=http%3A%2F%2Fimg.ophim1.com%2Fuploads%2Fmovies%2F${movie.thumb_url}&w=192&q=75`}
                              alt=""
                              style={{ width: 48, marginRight: 10 }}
                            />
                          </div>
                          <div>
                            <div className="name-vi fw-medium text-truncate text-primary">{movie.name}</div>
                            <div className="name-eng">{movie.origin_name}</div>
                          </div>
                        </div>
                      </td>
                      <td>{movie.year}</td>
                      <td style={{ fontWeight: 600 }}>
                        <span>
                          <svg style={{ width: 25 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                            <path
                              d="M44 13H4c-2.2 0-4 1.8-4 4v16c0 2.2 1.8 4 4 4h40c2.2 0 4-1.8 4-4V17c0-2.2-1.8-4-4-4z"
                              fill="#ffc107"
                            ></path>
                            <path
                              d="M28.102 18h-3.704v13.102h3.704c2 0 2.796-.403 3.296-.704.602-.398.903-1.097.903-1.796v-7.903c0-.898-.403-1.699-.903-2-.796-.5-1.097-.699-3.296-.699zm.699 10.3c0 .598-.7.598-1.301.598V20c.602 0 1.3 0 1.3.602zM33.8 18v13.3h2.802s.199-.902.398-.698c.398 0 1.5.597 2.2.597.698 0 1.1 0 1.5-.199.6-.398.698-.7.698-1.3v-7.802c0-1.097-1.097-1.796-2-1.796-.898 0-1.796.597-2.199.898v-3zm3.598 4.2c0-.4 0-.598.403-.598.199 0 .398.199.398.597v6.602c0 .398 0 .597-.398.597-.2 0-.403-.199-.403-.597zM22.7 31.3V18h-4.4l-.8 6.3-1.102-6.3h-4v13.3h2.903v-7.402l1.3 7.403h2l1.297-7.403v7.403zM7.602 18h3.097v13.3H7.602z"
                              fill="#263238"
                            ></path>
                          </svg>
                        </span>
                      </td>
                      <td style={{ maxWidth: 250 }}>
                        {movie?.category.map((categori, index) => {
                          return (
                            <span key={categori?.id}>
                              {categori.name}
                              {index < movie?.category?.length - 1 && ', '}
                            </span>
                          );
                        })}
                      </td>
                      <td>{movie.modified.time}</td>
                      <td>
                        <button
                          style={{ borderRadius: 0 }}
                          className="btn btn-warning"
                          onClick={() => {
                            setShowDetail(true);
                            setSlug(movie.slug);
                            window.scroll({
                              top: 0,
                            });
                          }}
                        >
                          Xem
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          )) || (
            <tbody>
              {movies &&
                movies.items.length > 0 &&
                movies.items.map((movie) => {
                  return (
                    <tr key={movie._id}>
                      <td>
                        <div className="d-flex align-items-center gap-10">
                          <div>
                            <img
                              src={`https://ophim17.cc/_next/image?url=http%3A%2F%2Fimg.ophim1.com%2Fuploads%2Fmovies%2F${movie.thumb_url}&w=192&q=75`}
                              alt=""
                              style={{ width: 48, marginRight: 10 }}
                            />
                          </div>
                          <div>
                            <div className="name-vi fw-medium text-truncate text-primary">{movie.name}</div>
                            <div className="name-eng">{movie.origin_name}</div>
                          </div>
                        </div>
                      </td>
                      <td>{movie.year}</td>
                      <td style={{ fontWeight: 600 }}>
                        {movie.tmdb.vote_average}{' '}
                        <span>
                          <svg style={{ width: 25 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                            <path
                              d="M44 13H4c-2.2 0-4 1.8-4 4v16c0 2.2 1.8 4 4 4h40c2.2 0 4-1.8 4-4V17c0-2.2-1.8-4-4-4z"
                              fill="#ffc107"
                            ></path>
                            <path
                              d="M28.102 18h-3.704v13.102h3.704c2 0 2.796-.403 3.296-.704.602-.398.903-1.097.903-1.796v-7.903c0-.898-.403-1.699-.903-2-.796-.5-1.097-.699-3.296-.699zm.699 10.3c0 .598-.7.598-1.301.598V20c.602 0 1.3 0 1.3.602zM33.8 18v13.3h2.802s.199-.902.398-.698c.398 0 1.5.597 2.2.597.698 0 1.1 0 1.5-.199.6-.398.698-.7.698-1.3v-7.802c0-1.097-1.097-1.796-2-1.796-.898 0-1.796.597-2.199.898v-3zm3.598 4.2c0-.4 0-.598.403-.598.199 0 .398.199.398.597v6.602c0 .398 0 .597-.398.597-.2 0-.403-.199-.403-.597zM22.7 31.3V18h-4.4l-.8 6.3-1.102-6.3h-4v13.3h2.903v-7.402l1.3 7.403h2l1.297-7.403v7.403zM7.602 18h3.097v13.3H7.602z"
                              fill="#263238"
                            ></path>
                          </svg>
                        </span>
                      </td>
                      <td>{(movie.tmdb.type === 'tv' && 'Phim bộ') || 'Phim lẻ'}</td>
                      <td>{movie.modified.time}</td>
                      <td>
                        <button
                          style={{ borderRadius: 0 }}
                          className="btn btn-warning"
                          onClick={() => {
                            setShowDetail(true);
                            setSlug(movie.slug);
                            window.scroll({
                              top: 0,
                            });
                          }}
                        >
                          Xem
                        </button>
                      </td>
                    </tr>
                  );
                })}
              <tr>
                <td colSpan="6">
                  <ReactPaginate
                    nextLabel="Trang kế"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={movies?.pagination?.totalItems}
                    previousLabel="Trang trước"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                    renderOnZeroPageCount={null}
                    forcePage={movies?.pagination?.currentPage - 1}
                  />
                </td>
              </tr>
            </tbody>
          )}
        </table>
        <div className={(show && 'close') || 'hide'}>
          {(showMenu && (
            <button className="btn btn-danger close-toggle" onClick={() => setShowMenu(false)}>
              {'>>'}
            </button>
          )) || (
            <button className="btn btn-danger close-toggle" onClick={() => setShowMenu(true)}>
              {'<<'}
            </button>
          )}
          <div className={(showMenu && 'close__content') || 'hide'}>
            <p className="close__content-func">
              <FaFilter /> Lọc phim
            </p>
            <p className="close__content-func" onClick={() => setShowSearchMovies(true)}>
              <FaSearch /> Tìm kiếm
            </p>
            <p className="close__content-func" onClick={() => setMoviesSearch()}>
              <RiArrowGoBackFill /> Trở lại
            </p>
            <p className="close__content-func" onClick={() => setShow(false)}>
              <FaBackspace /> Thoát
            </p>
            {/* <button className="btn btn-danger">Đóng</button> */}
          </div>
        </div>

        <div className="filter-movies__modal"></div>

        <div className={(showSearchMovies && 'search-movies__modal') || 'hide'}>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <input
              type="text"
              className={'search-movies__input'}
              placeholder="Nhập tên phim..."
              onChange={(e) => setNameMovies(e.target.value)}
            />
            <button className="btn btn-primary search-movies__btn" onClick={handleSubmitSearchMovies}>
              {(loading && <Spinner />) || 'Tìm'}
            </button>
            <button className="btn btn-danger search-movies__btn" onClick={() => setShowSearchMovies(false)}>
              Đóng
            </button>
          </div>
          <div></div>
        </div>

        <div className={(showDetail && 'modal-detail') || 'hide'}>
          <div className="modal-detail__inner d-flex">
            <div className="modal-detail__left">
              <img
                src={`https://ophim17.cc/_next/image?url=http%3A%2F%2Fimg.ophim1.com%2Fuploads%2Fmovies%2F${movie?.thumb_url}&w=256&q=75`}
                alt={movie?.name}
              />
              <div>
                <button className="btn" style={{ background: '#8b5cf6', color: '#fff' }}>
                  Xem phim
                </button>
                <button className="btn btn-primary">Trailer</button>
              </div>
            </div>
            <div className="modal-detail__content">
              <div className="text-center rounded-md">
                <h1 className="heading title">{movie?.name}</h1>
                <h2 className="italic text-sky-500 " style={{ color: '#0ea5e9', fontSize: '1.6rem' }}>
                  {movie?.origin_name}
                </h2>
              </div>
              <table className="table-detail table table-striped" style={{ background: '#ccc' }}>
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Trạng thái</td>
                    <td>{movie?.episode_current}</td>
                  </tr>
                  <tr>
                    <td>Số tập</td>
                    <td>{movie?.episode_total}</td>
                  </tr>
                  <tr>
                    <td>Thời Lượng</td>
                    <td>{movie?.time}</td>
                  </tr>
                  <tr>
                    <td>Năm Phát Hành</td>
                    <td>{movie?.year}</td>
                  </tr>
                  <tr>
                    <td>Chất Lượng</td>
                    <td>{movie?.quality}</td>
                  </tr>
                  <tr>
                    <td>Ngôn Ngữ</td>
                    <td>{movie?.lang}</td>
                  </tr>

                  <tr>
                    <td>Diễn Viên</td>
                    <td style={{ maxWidth: 250 }}>
                      {movie?.actor.map((actori, index) => {
                        return (
                          <span key={actori?.id}>
                            {actori}
                            {index < movie?.actor?.length - 1 && ', '}
                          </span>
                        );
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>Thể Loại</td>
                    <td style={{ maxWidth: 250 }}>
                      {movie?.category.map((categori, index) => {
                        return (
                          <span key={categori?.id}>
                            {categori.name}
                            {index < movie?.category?.length - 1 && ', '}
                          </span>
                        );
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td>Quốc Gia</td>
                    <td style={{ maxWidth: 250 }}>
                      {movie?.country.map((countri, index) => {
                        return (
                          <span key={countri.id}>
                            {countri.name}
                            {index < movie?.country?.length - 1 && ', '}
                          </span>
                        );
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-end">
            <button className="btn btn-primary" style={{ borderRadius: 0 }} onClick={handleAddNewMovie}>
              {(loading && <Spinner />) || ' Thêm'}
            </button>
            <button
              className="btn btn-danger btn-back"
              onClick={() => {
                setShowDetail(false);
                setDataMovie('');
              }}
            >
              <RiArrowGoBackFill />
            </button>
          </div>
        </div>
        <div className={showDetail && 'overlay'}></div>
      </div>
    </>
  );
};

export default Recommend;
