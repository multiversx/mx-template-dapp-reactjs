import { Dashboard, Disclaimer, Home, Unlock } from '@/pages';

// Route names enum equivalent
export const RouteNamesEnum = {
  home: '/',
  unlock: '/unlock',
  dashboard: '/dashboard',
  disclaimer: '/disclaimer'
};

export const routes = [
  {
    path: RouteNamesEnum.home,
    title: 'Home',
    component: Home,
    children: [
      {
        path: RouteNamesEnum.unlock,
        title: 'Unlock',
        component: Unlock
      }
    ]
  },
  {
    path: RouteNamesEnum.dashboard,
    title: 'Dashboard',
    component: Dashboard,
    authenticatedRoute: true
  },
  {
    path: RouteNamesEnum.disclaimer,
    title: 'Disclaimer',
    component: Disclaimer
  }
];
