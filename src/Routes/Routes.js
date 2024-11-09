import routes from '~/Configs/Routes';
import Dashboard from '~/pages/dashboard';
import Login from '~/pages/Login';
import Team from '~/pages/team';

const publicRoutes = [
  { path: routes.dashboard, component: Dashboard },
  { path: routes.team, component: Team },
  { path: routes.login, component: Login },
];
const privateRoutes = [];

export { publicRoutes, privateRoutes };
