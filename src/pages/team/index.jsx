import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AddIcon from '@mui/icons-material/Add';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import Header from '../../components/Header';
import Button2 from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { ToastContainer } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
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
  const [dataNewUser, setDataNewUser] = useState(null);
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await fetch('https://api.newmoviesz.online/api/users');
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const { data, success } = await response.json();
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
  }, [dataNewUser]);

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
            {access === 'manager' && <SecurityOutlinedIcon />}
            {access === 'Người dùng' && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
              {access}
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
      name: 'user',
      email,
      password,
    });

    const fetchApi = async () => {
      try {
        const response = await fetch(`https://api.newmoviesz.online/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataNewUser),
        });

        // Phân tích phản hồi JSON
        const result = await response.json();
        if (result.success) {
          setDataNewUser((prevData) => [...prevData, result.data]);
          setName('');
          setEmail('');
          setPassword('');
          handleClose();
        }
      } catch (error) {}
    };

    if (dataNewUser !== null) {
      fetchApi();
    }
  };

  const handleDeleteUser = async (id) => {
    if (id) {
      // const deleteConfirmed = await dialogs.confirm(`Are you sure you want to delete "${id}"?`);
      // // if (deleteConfirmed) {
      // //   try {
      // //     setIsDeleting(true);
      // //     await mockApiDelete(id);
      // //     dialogs.alert('Deleted!');
      // //   } catch (error) {
      // //     const message = error instanceof Error ? error.message : 'Unknown error';
      // //     await dialogs.open(MyCustomDialog, { id, error: message });
      // //   } finally {
      // //     setIsDeleting(false);
      // //   }
      // // }
    }
  };

  const hanleVerify = (e) => {
    console.log('check>>> ', e.target.value);
  };
  return (
    <>
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
          <DataGrid rows={data} columns={columns} onRowClick={handleRowClick}></DataGrid>
        </Box>
      </Box>

      <Modal show={selectedRow !== null} onHide={handleCloseDialog} style={{ padding: 0 }}>
        <Modal.Header closeButton>
          <Modal.Title className="form-label">Chi tiết người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddNewUser}>
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
                <option value="null">Chưa xác thực</option>
                <option value="verified">Đã Xác thực</option>
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
          <Button variant="primary" type="submit" onClick={handleCloseDialog}>
            Cập nhật
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
              <Form.Control
                type="text"
                placeholder="VD: DTH215782"
                autoFocus
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="VD: DTH215782"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control type="text" autoFocus onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Huỷ
          </Button>
          <Button variant="primary" type="submit" onClick={handleAddNewUser}>
            Thêm
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
