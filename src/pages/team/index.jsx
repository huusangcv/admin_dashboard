import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, IconButton, InputBase } from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AddIcon from '@mui/icons-material/Add';
import ErrorIcon from '@mui/icons-material/Error';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import Header from '../../components/Header';
import Button2 from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ClearIcon from '@mui/icons-material/Clear';
import GradeIcon from '@mui/icons-material/Grade';
import { ToastContainer } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import user from '~/services/user';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import './users.scss';
import Spinner from '~/components/Spinner';
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
const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [dataUsersSearch, setDataUsersSearch] = useState('');
  const [dataNewUser, setDataNewUser] = useState('');
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [idDeleteUser, setIdDeleteUser] = useState('');
  const [dataUpdateUser, setDataUpdateUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [dataSearch, setDataSearch] = useState('');
  const handleClose = () => {
    setShow(false);
  };
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const { data, success } = await user.List();
        if (success) {
          const result = data.data.map((newdata) => {
            const formattedDate = formatDate(newdata.created_at);
            if (newdata.email_verified_at !== null) {
              return {
                id: newdata.id,
                name: newdata.name,
                access: newdata.access,
                email: newdata.email,
                email_verified_at: 'Đã xác thực',
                created_at: formattedDate,
              };
            }

            return {
              id: newdata.id,
              name: newdata.name,
              access: newdata.access,
              email: newdata.email,
              email_verified_at: 'Chưa xác thực',
              created_at: formattedDate,
            };
          });
          setData(result);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchApi();
  }, [dataNewUser, idDeleteUser, dataUpdateUser]);

  const columns = [
    { field: 'id', headerName: 'Id' },
    {
      field: 'name',
      headerName: 'Tên',
      width: 200,
      cellClassName: 'name-column--cell',
    },

    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'created_at',
      headerName: 'Ngày tham gia',
      width: 120,
    },
    {
      field: 'email_verified_at',
      headerName: 'Trạng thái',
      renderCell: ({ row: { email_verified_at } }) => {
        return (
          <Box
            width="100%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={email_verified_at !== 'Đã xác thực' ? colors.redAccent[600] : colors.greenAccent[800]}
            borderRadius="4px"
            cursor="pointer"
          >
            {(email_verified_at === 'Chưa xác thực' && <ErrorIcon />) || <CheckCircleIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
              {email_verified_at}
            </Typography>
          </Box>
        );
      },
      width: 150,
    },

    {
      field: 'access',
      headerName: 'Access Llvel',
      width: 150,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="100%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={access === 'Quản trị viên' ? colors.greenAccent[600] : colors.greenAccent[800]}
            borderRadius="4px"
          >
            {access === 'Quản trị viên' && <AdminPanelSettingsOutlinedIcon />}
            {access === 'Vip' && <GradeIcon />}
            {access === 'Người dùng' && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
  ];

  //Fetch api add new user
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const { message, success } = await user.SignUp(dataNewUser);
        // Phân tích phản hồi JSON
        if (success) {
          setLoading(false);
          alert(message);
          setName('');
          setEmail('');
          setPassword('');
          setDataNewUser('');
          handleClose();
          handleCloseDialog();
        } else {
          alert(message);
        }
      } catch (error) {}
    };

    if (dataNewUser !== '') {
      fetchApi();
    }
  }, [dataNewUser]);

  //fetch api update user
  useEffect(() => {
    const fetchUpdateUser = async () => {
      const { success, message } = await user.Update(selectedRow.id, dataUpdateUser);
      if (success) {
        setLoading(false);
        alert(message);
        setStatus('');
        setEmail('');
        setDataUpdateUser('');
        handleClose();
        handleCloseDialog();
      } else {
        alert(message);
      }
      try {
      } catch (error) {}
    };
    if (status !== '') {
      fetchUpdateUser();
    }
  }, [dataUpdateUser]);

  //fetch api delete user
  useEffect(() => {
    const fetchDeleteUser = async () => {
      const { success, message } = await user.Delete(idDeleteUser);
      if (success) {
        setLoading(false);
        alert(message);
        setIdDeleteUser('');
        handleClose();
        handleCloseDialog();
      } else {
        alert(message);
      }
      try {
      } catch (error) {}
    };
    if (idDeleteUser !== '') {
      fetchDeleteUser();
    }
  }, [idDeleteUser]);

  //fetch api search user
  useEffect(() => {
    const fetchSearchUser = async () => {
      const { success, message, data } = await user.Search(searchName);
      if (success) {
        const result = data.data.map((newdata) => {
          const formattedDate = formatDate(newdata.created_at);
          if (newdata.email_verified_at !== null) {
            return {
              id: newdata.id,
              name: newdata.name,
              access: newdata.access,
              email: newdata.email,
              email_verified_at: 'Đã xác thực',
              created_at: formattedDate,
            };
          }

          return {
            id: newdata.id,
            name: newdata.name,
            access: newdata.access,
            email: newdata.email,
            email_verified_at: 'Chưa xác thực',
            created_at: formattedDate,
          };
        });
        setDataUsersSearch(result);
      } else {
        alert(message);
      }
      try {
      } catch (error) {}
    };
    if (dataSearch !== '') {
      fetchSearchUser();
    }
  }, [dataSearch]);

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    setName(params.row.name);
    setEmail(params.row.email);
  };

  const handleCloseDialog = () => {
    setSelectedRow(null);
  };

  const handleAddNewUser = (e) => {
    setDataNewUser({
      name,
      email,
      password,
    });
    setLoading(true);
  };

  const handleUpdateUser = () => {
    setDataUpdateUser({
      email: (email !== selectedRow.email && email) || 'null',
      email_verified_at: (status !== '' && status) || '',
    });
    setLoading(true);
  };

  const handleDeleteUser = async () => {
    confirmAlert({
      title: 'Xác nhận xoá',
      message: 'Bạn có chắc muốn xoá người dùng này.',
      buttons: [
        {
          label: (loading && <Spinner />) || 'Yes',
          onClick: () => {
            setLoading(true);
            setIdDeleteUser(selectedRow.id);
          },
        },
        {
          label: 'No',
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
              setDataUsersSearch('');
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
          <Header title="Người dùng" subtitle="Danh sách người dùng" />
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
              <AddIcon /> Thêm mới người dùng
            </Button2>
          </Stack>
          <DataGrid
            rows={(dataSearch !== '' && dataUsersSearch) || data}
            columns={columns}
            onRowClick={handleRowClick}
          ></DataGrid>
        </Box>
      </Box>

      <Modal show={selectedRow !== null} onHide={handleCloseDialog} style={{ padding: 0 }}>
        <Modal.Header closeButton>
          <Modal.Title className="form-label">Chi tiết người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Tên</Form.Label>
              <Form.Control type="text" value={selectedRow && selectedRow.name} disabled />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                aria-label="Default select example"
                defaultValue={selectedRow && selectedRow.email_verified_at === 'Chưa xác thực' ? 'null' : 'verify'}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="null">Huỷ bỏ xác thực</option>
                <option value="verify">Xác thực</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" type="submit" onClick={handleDeleteUser}>
            Xoá
          </Button>

          <Button className="ms-auto" variant="secondary" onClick={handleCloseDialog}>
            Huỷ
          </Button>
          <Button variant="primary" type="submit" onClick={handleUpdateUser}>
            {(loading && <Spinner />) || 'Cập nhật'}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show} onHide={handleClose} style={{ padding: 0 }}>
        <Modal.Header closeButton>
          <Modal.Title className="form-label">Thêm người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddNewUser}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Tên</Form.Label>
              <Form.Control type="text" placeholder="Từ 4 kí tự" autoFocus onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="example@gmail.com" onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control type="password" placeholder="Từ 6 kí tự" onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Huỷ
          </Button>
          <Button variant="primary" type="submit" onClick={handleAddNewUser}>
            {(loading && <Spinner />) || 'Thêm'}
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default Team;
