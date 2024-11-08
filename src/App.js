import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { MyProSidebarProvider } from './pages/global/sidebar/sidebarContext';

import Topbar from './pages/global/Topbar';

import Dashboard from './pages/dashboard';
import Team from './pages/team';
import Invoices from './pages/invoices';
import Contacts from './pages/contacts';
import Form from './pages/form';
import Calendar from './pages/calendar';
import Bar from './pages/bar';
import Line from './pages/line';
import Pie from './pages/pie';
import FAQ from './pages/faq';
import Geography from './pages/geography';
import { publicRoutes } from './Routes/Routes';
import { Fragment } from 'react';

const App = () => {
  const [theme, colorMode] = useMode();
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
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/form" element={<Form />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/line" element={<Line />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/geography" element={<Geography />} />
              </Routes>
              {/* <Routes>
                {publicRoutes.map((route) => {
                  const Page = route.component;
                  let Layout;
                  if (route.layout) {
                    Layout = route.layout;
                  } else if (route.layout === null) {
                    Layout = Fragment;
                  }

                  return (
                    <Route
                      path={route.path}
                      element={
                        <Layout>
                          <Page></Page>
                        </Layout>
                      }
                    ></Route>
                  );
                })}
              </Routes> */}
            </main>
          </div>
        </MyProSidebarProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
