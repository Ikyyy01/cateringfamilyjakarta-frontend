import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // Public
  {
    path: '/',
    component: () => import('@/layouts/CustomerLayout.vue'),
    children: [
      { path: '',              name: 'Home',      component: () => import('@/pages/customer/HomePage.vue') },
      { path: 'menu',          name: 'Menu',      component: () => import('@/pages/customer/MenuPage.vue') },
      { path: 'menu/:id',      name: 'MenuDetail',component: () => import('@/pages/customer/MenuDetailPage.vue') },
      { path: 'track',         name: 'Track',     component: () => import('@/pages/customer/TrackPage.vue') },
      { path: 'tentang-kami',  name: 'About',     component: () => import('@/pages/customer/AboutPage.vue') },
    ],
  },

  // Auth — hanya login, tidak ada register
  { path: '/login', name: 'Login', component: () => import('@/pages/LoginPage.vue') },

  // Customer — bisa diakses tanpa login (guest order)
  {
    path: '/customer',
    component: () => import('@/layouts/CustomerLayout.vue'),
    children: [
      { path: 'cart',             name: 'Cart',     component: () => import('@/pages/customer/CartPage.vue') },
      { path: 'checkout',         name: 'Checkout', component: () => import('@/pages/customer/CheckoutPage.vue') },
      { path: 'payment/:orderId', name: 'Payment',  component: () => import('@/pages/customer/PaymentPage.vue') },
    ],
  },

  // Customer — perlu login (opsional, untuk yang punya akun)
  {
    path: '/customer',
    component: () => import('@/layouts/CustomerLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'orders',     name: 'Orders',      component: () => import('@/pages/customer/OrdersPage.vue') },
      { path: 'orders/:id', name: 'OrderDetail', component: () => import('@/pages/customer/OrderDetailPage.vue') },
      { path: 'profile',    name: 'Profile',     component: () => import('@/pages/customer/ProfilePage.vue') },
    ],
  },

  // Admin
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard',     name: 'AdminDashboard',      component: () => import('@/pages/admin/DashboardPage.vue') },
      { path: 'orders',        name: 'AdminOrders',         component: () => import('@/pages/admin/OrdersPage.vue') },
      { path: 'orders/:id',    name: 'AdminOrderDetail',    component: () => import('@/pages/admin/OrderDetailPage.vue') },
      { path: 'payments',      name: 'AdminPayments',       component: () => import('@/pages/admin/PaymentsPage.vue') },
      { path: 'menus',         name: 'AdminMenus',          component: () => import('@/pages/admin/MenusPage.vue') },
      { path: 'categories',    name: 'AdminCategories',     component: () => import('@/pages/admin/CategoriesPage.vue') },
      { path: 'customers',     name: 'AdminCustomers',      component: () => import('@/pages/admin/CustomersPage.vue') },
      { path: 'customers/:id', name: 'AdminCustomerDetail', component: () => import('@/pages/admin/CustomerDetailPage.vue') },
      { path: 'coupons',       name: 'AdminCoupons',        component: () => import('@/pages/admin/CouponsPage.vue') },
      { path: 'reviews',       name: 'AdminReviews',        component: () => import('@/pages/admin/ReviewsPage.vue') },
      { path: 'activity-log',  name: 'AdminActivityLog',    component: () => import('@/pages/admin/ActivityLogPage.vue') },
      { path: 'settings',      name: 'AdminSettings',       component: () => import('@/pages/admin/SettingsPage.vue') },
    ],
  },

  // 404
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/pages/NotFoundPage.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (auth.token && !auth.user) await auth.fetchUser()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return { name: 'Login', query: { redirect: to.fullPath } }
  if (to.meta.requiresAdmin && !auth.isAdmin) return { name: 'Home' }
})

export default router
