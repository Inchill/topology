const routes = [
    {
        path: '/',
        name: '首页',
        component: () => import('@/pages/app'),
    },
    {
        path: '/echarts-custom',
        name: 'echarts-custom',
        component: () => import('@/pages/echarts-custom'),
    },
    {
        path: '/echarts-tree',
        name: 'echarts-tree',
        component: () => import('@/pages/echarts-tree'),
    },
]

export default routes;