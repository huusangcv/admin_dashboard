import React, { useState, useEffect } from 'react';
import { Avatar, Box, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import AddIcon from '@mui/icons-material/Add';
import Header from '../../components/Header';
import Button2 from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import user from '~/services/user';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
const formatDate = (dateString) => {
  const date = new Date(dateString);

  // Lấy các phần của ngày
  const day = String(date.getDate()).padStart(2, '0'); // Ngày
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng (0-11)
  const year = date.getFullYear(); // Năm

  // Lấy giờ và phút
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Trả về định dạng mong muốn
  return `${month}/${day}/${year} ${hours}:${minutes}`;
};
const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [dataNewUser, setDataNewUser] = useState(null);
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [alert, setAlert] = useState(null);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  //Fetch Movies recommends
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/movies');
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const { data, success } = await response.json();
        if (success) {
          setData(data.data);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchApi();
  }, [dataNewUser]);

  const columns = [
    { field: 'id', headerName: 'Id', width: 50 },
    {
      field: 'name_vi',
      headerName: 'Tên',
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
  const handleRowClick = (params) => {
    setSelectedRow(params.row);
  };

  const handleCloseDialog = () => {
    setSelectedRow(null);
  };

  const handleAddNewUser = (e) => {
    setDataNewUser({
      name: 'duyen',
      email,
      password,
    });

    const fetchApi = async () => {
      try {
        const { message, success, data } = await user.SignUp(dataNewUser);

        // Phân tích phản hồi JSON
        if (success) {
          setData((prevData) => [...prevData, data]);
          setName('');
          setEmail('');
          setPassword('');
          setDataNewUser(null);
          alert(message);
          handleClose();
        } else {
          alert(message);
        }
      } catch (error) {}
    };

    fetchApi();
  };

  const handleDeleteUser = async (id) => {
    handleClose();
    handleCloseDialog();
    let fetchDeleteUser;
    if (id) {
      fetchDeleteUser = async () => {
        const { success, message } = await user.Delete(id);
        if (success) {
          setAlert(true);
          setData((prev) => prev);
        } else {
          setAlert(false);
        }
        try {
        } catch (error) {}
      };
    }
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Bạn có chắc muốn xoá người dùng này.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => fetchDeleteUser(),
        },
        {
          label: 'No',
          onClick: () => handleShow(),
        },
      ],
    });
  };

  const hanleVerify = (e) => {
    const newStatus = e.target.value;
    if (newStatus) {
      setStatus(newStatus);
    } else {
      setStatus('');
    }
  };

  const handleUpdateUser = () => {
    if (status) {
      const fetchUpdateProfileUser = async () => {
        const { success, message } = await user.Update(selectedRow.id, status);
        if (success) {
          alert(message);
        } else {
          alert('Cập nhật thất bại');
        }
        try {
        } catch (error) {}
      };
      fetchUpdateProfileUser();
    }

    console.log('checkk, ', selectedRow.id);
  };

  return (
    <>
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
          <DataGrid rows={data} columns={columns} onRowClick={handleRowClick}></DataGrid>
        </Box>
      </Box>

      <Modal show={selectedRow !== null} onHide={handleCloseDialog} style={{ padding: 0 }}>
        <Modal.Header closeButton>
          <Modal.Title className="form-label">Chi tiết phim</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Tên</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                value={selectedRow && selectedRow.name}
                disabled
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                autoFocus
                value={selectedRow && selectedRow.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                aria-label="Default select example"
                defaultValue={selectedRow && selectedRow.email_verified_at === 'Chưa xác thực' ? 'null' : 'verified'}
                onChange={hanleVerify}
              >
                <option value="null">Huỷ bỏ xác thực</option>
                <option value="verified">Xác thực</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" type="submit" onClick={() => handleDeleteUser(selectedRow.id)}>
            Xoá
          </Button>

          <Button className="ms-auto" variant="secondary" onClick={handleCloseDialog}>
            Huỷ
          </Button>
          <Button variant="primary" type="submit" onClick={handleUpdateUser}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="modal"></div>
    </>
  );
};

export default Contacts;
