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
    {
        path: '/d3-custom',
        name: 'd3-custom',
        component: () => import('@/pages/d3-custom'),
    },
    {
        path: '/leader-line',
        name: 'leader-line',
        component: () => import('@/pages/leader-line'),
    },
    {
        path: '/g6-tree',
        name: 'g6-tree',
        component: () => import('@/pages/g6-tree'),
    },
]

export default routes;