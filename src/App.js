import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import Login from './pages/Login';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const hasCookie = () => {
      return document.cookie.split(';').some((item) => item.trim().startsWith('token='));
    };

    setIsAuthenticated(hasCookie());
  });

  return <>{isAuthenticated ? <Layout /> : <Login />}</>;
};

export default App;
