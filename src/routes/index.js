const routes = [
    {
        path: '/',
        name: '首页',
        component: () => import('@/pages/app'),
    },
    {
        path: '/echarts',
        name: 'echarts',
        component: () => import('@/pages/echarts'),
    },
]

export default routes;