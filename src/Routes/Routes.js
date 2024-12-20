import routes from '~/Configs/Routes';
import Dashboard from '~/pages/dashboard';
import Login from '~/pages/Login';
import Team from '~/pages/team';

const publicLayout = [
  { path: routes.dashboard, component: Dashboard },
  { path: routes.team, component: Team },
  { path: routes.login, component: Login },
];
const privateLayout = [];

const hasCookie = () => {
  return document.cookie.split(';').some((item) => item.trim().startsWith('token='));
};

const PrivateRoute = () => {
  return hasCookie() ? privateLayout : publicLayout;
};

export default PrivateRoute;
