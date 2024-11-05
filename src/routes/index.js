import Login from '../components/Login';
import Register from '../components/Register';
import MainLayout from '../layouts/MainLayout';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import CourseDetailPage from '../pages/CourseDetailPage';
import CourseSchedulePage from '../pages/CourseSchedulePage';
import CoursesPage from '../pages/CoursesPage';
import HomePage from '../pages/HomePage';
import LearningPage from '../pages/LearningPage';
import MyCoursesPage from '../pages/MyCoursesPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import OrdersPage from '../pages/OrdersPage';
import ProfilePage from '../pages/ProfilePage';

const publicRoutes = [
    {
        path: '/',
        component: HomePage,
        layout: null, 
    },
    {
        path: '/login',
        component: Login,
        layout: null,
    },
    {
        path: '/register', 
        component: Register,
        layout: null, 
    },
    {
        path: '/courses',
        component: CoursesPage,
        layout: MainLayout,
    },
    {
        path: '/profile',
        component: ProfilePage,
        layout: MainLayout,
        protected: true, // Thêm thuộc tính protected
    },
    {
        path: '/courses/:id',
        component: CourseDetailPage,
        layout: MainLayout,
    },
    {
        path: '/my-courses',
        component: MyCoursesPage,
        layout: MainLayout,
        protected: true, // Thêm thuộc tính protected
    },
    {
        path: '/learning/:courseId', 
        component: LearningPage,
        layout: (props) => <MainLayout showHeaderFooter={false} {...props} />,
        protected: true, // Thêm thuộc tính protected
    },
    {
        path: '/courses/:courseId/schedule',
        component: CourseSchedulePage,
        layout: (props) => <MainLayout showHeaderFooter={false} {...props} />,
        protected: true, // Thêm thuộc tính protected
    },
    {
        path: '/my-cart',
        component: CartPage,
        layout: MainLayout,
    },
    {
        path: '/checkout',
        component: CheckoutPage,
        layout: MainLayout,
    },
    {
        path: '/orders',
        component: OrdersPage,
        layout: MainLayout,
        protected: true,
    },
    {
        path: '/orders/:id',
        component: OrderDetailPage,
        layout: MainLayout,
        protected: true,
    },
];

export { publicRoutes };