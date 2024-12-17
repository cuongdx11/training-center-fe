import AdminLogin from '../components/admin/AdminLogin';
import RecurringScheduleForm from '../components/admin/courses/RecurringScheduleForm';
import Login from '../components/Login';
import Register from '../components/Register';
import AdminAuthLayout from '../layouts/AdminAuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import MainLayout from '../layouts/MainLayout';
import AccountActivation from '../pages/AccountActivationPage';
import CourseManagementPage from '../pages/admin/CourseManagementPage';
import CourseRoadmapPage from '../pages/admin/CourseRoadmapPage';
import DashboardPage from '../pages/admin/DashboardPage';
import RoleManagementPage from '../pages/admin/RoleManagementPage';
import ScheduleManagementPage from '../pages/admin/ScheduleManagementPage';
import StudentProgressManagementPage from '../pages/admin/StudentProgressManagementPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import UserRoleManagementPage from '../pages/admin/UserRoleManagementPage';
import CartPage from '../pages/CartPage';
import CheckoutFlashPage from '../pages/CheckoutFlashPage';
import CheckoutPage from '../pages/CheckoutPage';
import CourseDetailPage from '../pages/CourseDetailPage';
import CourseSchedulePage from '../pages/CourseSchedulePage';
import CoursesPage from '../pages/CoursesPage';
import HomePage from '../pages/HomePage';
import LearningPage from '../pages/LearningPage';
import MyCoursesPage from '../pages/MyCoursesPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import OrdersPage from '../pages/OrdersPage';
import PaymentResult from '../pages/PaymentResultPage';
import ProfilePage from '../pages/ProfilePage';
import CreateCourseClass from '../components/admin/courses/CreateCourseClass'
import UserCalendarPage from '../pages/UserCalendarPage';
import RegisteredCoursesClassPage from '../pages/RegisteredCoursesClassPage';
import AttendanceManagement from '../components/AttendanceManagement';
import OrderManagementPage from '../pages/admin/OrderManagementPage';
import PaymentManagementPage from '../pages/admin/PaymentManagementPage';
import CreateAttendanceSession from '../pages/instructor/CreateAttendanceSession';
import AttendanceQRPage from '../pages/instructor/AttendanceQRPage ';
import CheckinPage from '../pages/instructor/CheckinPage';
import CourseClassesPage from '../pages/CourseClassesPage';
import SearchResults from '../components/SearchResults';
import AdminProfile from '../components/admin/AdminProfile';
import AttendanceManagementPage from '../pages/instructor/AttendanceManagementPage';
import Invoice from '../components/Invoice';
import ReviewManagementPage from '../pages/admin/ReviewManagementPage';
import CourseReviewPage from '../pages/admin/CourseReviewPage';
import CategoryManagementPage from '../pages/admin/CategoryManagementPage';
import CreateNotificationForm from '../components/admin/notification/CreateNotificationForm';
import SendNotificationForm from '../components/instructor/SendNotificationForm';
import InstructorSchedule from '../components/instructor/InstructorSchedule';

const publicRoutes = [
    {
        path: '/',
        component: HomePage,
        layout: null, 
    },
    {
        path: '/login',
        component: Login,
        layout: (props) => <MainLayout showHeaderFooter={false} {...props} />,
    },
    {
        path: '/register', 
        component: Register,
        layout: (props) => <MainLayout showHeaderFooter={false} {...props} />, 
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
        path: '/calendar',
        component: UserCalendarPage,
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
        path: '/register-class',
        component: RegisteredCoursesClassPage,
        layout: MainLayout,
    },
    {
        path: '/courses/:courseId/classes',
        component: CourseClassesPage,
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
    {
        path: '/checkout/:id',
        component: CheckoutFlashPage,
        layout: MainLayout,
    },
    {
        path: '/activate-account',
        component: AccountActivation,
        layout: MainLayout,
    },
    {
        path: '/payments',
        component: PaymentResult,
        layout: MainLayout,
    },
    {
        path: '/search',
        component: SearchResults,
        layout: MainLayout,
    },
    {
        path: '/test',
        component: Invoice,
        layout: MainLayout,
    },
    {
        path: '/admin/login',
        component: AdminLogin,
        layout: AdminAuthLayout,
    },
    { path: "attendance-qr", component: AttendanceQRPage,layout: (props) => <MainLayout showHeaderFooter={false} {...props} />, },
    { path: "checkin", component: CheckinPage,layout: (props) => <MainLayout showHeaderFooter={false} {...props} />, },
    {
        path: "/admin",
        layout: AdminLayout, // Chỉ định layout là AdminLayout
        protected: true,
        children: [
          { path: "courses", component: CourseManagementPage },
          { path: "dashboard", component: DashboardPage},
          { path: "courses/schedules", component: ScheduleManagementPage},
          { path: "courses/roadmap", component: CourseRoadmapPage},
          { path: "courses/recurring", component: RecurringScheduleForm},
          {path : "roles", component: RoleManagementPage },
          { path : "user-role", component: UserRoleManagementPage},
          { path : "users", component: UserManagementPage},
          { path :"student-process" , component: StudentProgressManagementPage},
          { path: "courses/create-class", component: CreateCourseClass},
          { path: "attendances", component: AttendanceManagement},
          { path: "orders", component: OrderManagementPage},
          { path: "payments", component: PaymentManagementPage},
          { path: "profile", component: AdminProfile },
          { path: "reviews", component: ReviewManagementPage},
          { path: "reviews/:courseId", component: CourseReviewPage},
          { path: "categories", component: CategoryManagementPage},

          { path: "create-notification", component: CreateNotificationForm },
          
        ]
          
      },
      {
        path: "/instructor",
        layout: AdminLayout, 
        protected: true,
        children: [
          { path: "courses", component: CourseManagementPage },
          { path: "dashboard", component: DashboardPage},
          { path: "courses/schedules", component: ScheduleManagementPage},
          { path: "courses/roadmap", component: CourseRoadmapPage},
          { path: "courses/recurring", component: RecurringScheduleForm},
          {path : "roles", component: RoleManagementPage },
          { path : "user-role", component: UserRoleManagementPage},
          { path : "users", component: UserManagementPage},
          { path :"student-process" , component: StudentProgressManagementPage},
          { path: "courses/create-class", component: CreateCourseClass},
          { path: "attendances", component: AttendanceManagement},
          { path: "create-attendance", component: CreateAttendanceSession},
          { path: "attendance", component: AttendanceManagementPage},
          { path: "send-notification", component: SendNotificationForm },
          { path: "schedules", component: InstructorSchedule },
          
        ]
          
      },
];

export { publicRoutes };