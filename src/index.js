import routes from './routes';
import './style.css';

/**
 * 异步加载页面内容
 *
 * @param hash 页面哈希值，用于匹配路由
 * @returns 无返回值
 *
 * 此函数用于根据提供的哈希值（hash）异步加载页面内容。首先，它会清空页面上的现有内容，
 * 然后根据哈希值在路由配置（routes）中查找对应的路由。如果找到了匹配的路由，它会异步加载该路由对应的组件，
 * 并将组件应用到页面上；如果没有找到匹配的路由，则会在页面上显示“Page not found.”。
 */
function loadPage(hash) {
    const app = document.getElementById('app');
    app.innerHTML = ''; // 清空页面内容

    const route = routes.find(route => route.path === hash);
    if (!route) {
        app.innerHTML = '<p>Page not found.</p>';
        return;
    }

    route.component().then(module => {
        module.default(app, routes)
    });
}

/**
 * 处理URL哈希变化事件
 *
 * 当URL的哈希部分发生变化时，该函数会被触发。函数会获取哈希部分的值（去除开头的"#/"），
 * 并调用loadPage函数加载对应的演示。
 */
function handleHashChange() {
    const hasHash = window.location.href.includes('#');
    const hash = hasHash ? window.location.href.split('#')?.[1] : '/'; // 去掉前面的 #/
    loadPage(hash);
}

// 初始加载
handleHashChange();

// 监听 hash 变化
window.addEventListener('hashchange', handleHashChange);