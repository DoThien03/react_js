import { useRoutes } from 'react-router-dom';
import CommonLayout from '../components/layout/commonLayout';
import Home from '../page/home/common/home/Home';
import commonRoutes from './common';
import adminRoute from './admin';
import Admin from '../page/admin/Admin';

const routes = [
    //trang người dùng
    {
        path: '/',
        element: <CommonLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            commonRoutes,
        ],
    },
    // Trang Admin
    {
        path: '/admin',
        element: <CommonLayout />,
        children: [
            {
                index: true,
                element: <Admin />,
            },
            adminRoute,
        ],
    }
]
export default function Routers() {
    return useRoutes(routes);
}