import { ColorModeContext, useMode } from '.././theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { MyProSidebarProvider } from '.././pages/global/sidebar/sidebarContext';
import { toast, ToastContainer } from 'react-toastify';
import Topbar from '.././pages/global/Topbar';

import Dashboard from '.././pages/dashboard';
import Team from '.././pages/team';
import Invoices from '.././pages/invoices';
import Form from '.././pages/form';
import Calendar from '.././pages/calendar';
import Bar from '.././pages/bar';
import Line from '.././pages/line';
import Pie from '.././pages/pie';
import FAQ from '.././pages/faq';
import Geography from '.././pages/geography';
import Recommend from '.././pages/recommend';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

const Layout = () => {
  // const [cookies] = useCookies(['token']);
  // const token = cookies.token; // Lấy giá trị cookie
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   const fetchApiUser = async () => {
  //     try {
  //       const response = await fetch('https://api.newmoviesz.online/api/profile', {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       // Phân tích phản hồi JSON
  //       const result = await response.json();
  //       if (result.status === true) {
  //         dispatch(getUserProfile(result.data));
  //       }
  //     } catch (error) {}
  //   };
  //   if (token) {
  //     fetchApiUser();
  //   }
  // }, [token, dispatch]);
  const [theme, colorMode] = useMode();
  // const LayoutRoutes = PrivateRoute();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MyProSidebarProvider>
          <div style={{ height: '100%', width: '100%' }}>
            <main>
              <Topbar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/team" element={<Team />} />
                <Route path="/recommend" element={<Recommend />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/form" element={<Form />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/line" element={<Line />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/geography" element={<Geography />} />

                {/* {LayoutRoutes.map((route, index) => {
                  const Page = route.component;
                  let Layout = DefaultLayout;

                  if (route.layout) {
                    Layout = route.layout;
                  } else if (route.layout === null) {
                    Layout = Fragment;
                  }

                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        <Layout>
                          <Suspense fallback={<p>Loading....</p>}>
                            <Page />
                          </Suspense>
                        </Layout>
                      }
                    />
                  );
                })} */}
              </Routes>
            </main>
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
          </div>
        </MyProSidebarProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Layout;
