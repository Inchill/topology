import LeaderLine from 'lib/leader-line.min';
import './style.less';
import {
    insertBeforeFromTemplate
} from '@/utils';

let initialWidth = 0;
let currentScale = 1; // 画布缩放

let isDragging = false;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;

let isScrolling = true; // 标记是否在平滑滚动

const baseOption = {
    color: '#D4D6D9',
    endPlug: 'disc',
    endPlugSize: 4,
    startSocket: 'right',
    endSocket: 'left',
    size: 1,
    dash: {
        animation: true
    },
    path: 'fluid',
};

const GROUP_NODE_NAMES = ['NAT网关', '弹性网卡', 'VPN网关'];
let lines = [];

let eipInex = 0;

const toggleDrawer = () => {
    const drawer = document.querySelector('.drawer');
    drawer.classList.toggle('open');
}

const renderNodes = () => {
    let nodes = '';
    for (let len = eipInex + 8; eipInex < len; eipInex++) {
        nodes += `
            <div class="node node-${eipInex + 1}">
                <i class="icon-node"></i>
                192.168.0.${eipInex + 1}
            </div>
        `;
    }
    return nodes;
}

const renderGroupNodes = (n) => {
    let nodes = '';
    for (let i = 0; i < n; i++) {
        nodes += `
            <div class="group-node">
                <i class="icon-node"></i>
                ${GROUP_NODE_NAMES[i]}
            </div>
        `;
    }
    return nodes;
}

const renderGroup = () => {
    let group = '';
    for (let i = 0; i < 3; i++) {
        group += `
            <div class="group group-${i + 1}">
                Group ${i + 1}
                <div class="group-nodes">
                    ${renderGroupNodes(3 - i)}
                </div>
            </div>
        `;
    }
    return group;
}

// 清除所有连线
function clearAllLines() {
    lines.forEach(line => line.remove()); // 调用 remove 方法清除连线
    lines = [];
}

export default function (app) {
    const template = `
        <div class="demo-page">
            <div class="outer-container">
                <div class="container">
                    <div class="column">
                        <div class="internet">
                            <i class="icon-internet"></i>Internet
                        </div>
                    </div>
                    <div class="column">
                        <div class="public-network-border">
                            <h2>公网边界</h2>
                            <div class="row">
                                <div class="ddos">DDos防护</div>
                                <div class="firewall">云防火墙</div>
                            </div>
                        </div>
                    </div>
                    <div class="column column-eip">
                        ${renderNodes()}
                        <button class="btn-loadmore">加载更多</button>
                    </div>
                    <div class="column">
                        ${renderGroup()}
                    </div>
                </div>
            </div>
            <div class="drawer">这是详情</div>
        </div>
    `;

    app.innerHTML = template;

    const container = document.querySelector('.container');
    const outerContainer = document.querySelector('.outer-container');
    const internetNode = document.querySelector('.internet');
    const publicNetworkBorderNode = document.querySelector('.public-network-border');
    const btnLoadmore = document.querySelector('.btn-loadmore');

    btnLoadmore.addEventListener('click', () => {
        const nodes = renderNodes();
        insertBeforeFromTemplate(nodes, btnLoadmore);
        drawLeaderLine(currentScale);
        btnLoadmore.scrollIntoView({
            block: 'end'
        });
    });

    initialWidth = container.offsetWidth;

    container.addEventListener('click', (event) => {
        const target = event.target;

        // 判断点击的是节点
        if (target.classList.contains('node') || target.closest('.node')) {
            toggleDrawer(); // 显示抽屉
        }

        // 判断点击的是 group-node
        if (target.classList.contains('group-node') || target.closest('.group-node')) {
            console.log('Group node clicked:', target.innerText);
        }
    });

    // 监听鼠标滚轮事件来实现缩放
    container.addEventListener('wheel', (event) => {
        // 防止页面滚动
        event.preventDefault();

        if (event.deltaY < 0) {
            currentScale *= 1.1; // 放大
        } else {
            currentScale /= 1.1; // 缩小
        }

        // 设置容器的缩放和平移
        container.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;

        // 重新绘制连线
        drawLeaderLine(currentScale);
    });

    // 监听鼠标滚轮事件来实现缩放
    outerContainer.addEventListener('wheel', (event) => {
        // 防止页面滚动
        event.preventDefault();
        const scrollSpeed = 0.7; // 设置滚动速度的调整因子
        let deltaY = event.deltaY * scrollSpeed; // 根据滚轮的移动计算平移距离

        // 启动惯性平滑滚动
        if (!isScrolling) {
            isScrolling = true;
            smoothScroll(deltaY);
        }
    });

    // 平滑滚动函数
    function smoothScroll(deltaY) {
        const dampingFactor = 0.9; // 减速因子，值越接近1，惯性越强
        let currentDeltaY = deltaY;

        function step() {
            // 每次迭代减少滚动量，模拟减速
            currentDeltaY *= dampingFactor;

            // 更新 Y 轴平移值
            translateY -= currentDeltaY;

            // 设置容器的缩放和平移
            container.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;

            // 重新绘制连线
            drawLeaderLine(currentScale);

            // 当滚动量足够小的时候停止滚动
            if (Math.abs(currentDeltaY) > 0.5) {
                requestAnimationFrame(step); // 继续下一帧
            } else {
                isScrolling = false; // 滚动结束
            }
        }

        requestAnimationFrame(step); // 启动惯性动画
    }

    // 监听鼠标拖动事件实现容器的移动
    outerContainer.addEventListener('mousedown', (event) => {
        isDragging = true;
        // 记录鼠标初始点击位置
        startX = event.pageX;
        startY = event.pageY;

        // 获取当前的 translate 值
        const {
            translateX: tx,
            translateY: ty
        } = getTranslateValues();
        translateX = tx;
        translateY = ty;
    });

    outerContainer.addEventListener('mousemove', (event) => {
        if (!isDragging) return;

        // 计算鼠标移动的距离
        const deltaX = event.pageX - startX;
        const deltaY = event.pageY - startY;

        // 更新 translateX 和 translateY 以反映移动
        const newTranslateX = translateX + deltaX;
        const newTranslateY = translateY + deltaY;
        console.log(newTranslateX, newTranslateY);

        // 更新容器的 transform 样式
        container.style.transform = `scale(${currentScale}) translate(${newTranslateX}px, ${newTranslateY}px)`;
    });

    outerContainer.addEventListener('mouseup', () => {
        isDragging = false;
    });

    outerContainer.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    const drawLeaderLine = (scale = 1) => {
        clearAllLines();

        const scaledOption = {
            ...baseOption,
            size: baseOption.size * scale
        };

        const eipNodesLen = document.querySelector('.column-eip').children.length - 1;

        // 第一组连线
        lines.push(new LeaderLine(
            internetNode,
            publicNetworkBorderNode,
            scaledOption
        ));

        // 第二组连线
        for (let i = 1; i <= eipNodesLen; i++) {
            lines.push(new LeaderLine(
                publicNetworkBorderNode,
                document.querySelector(`.node-${i}`),
                scaledOption
            ));
        }

        // 第三组连线
        for (let i = 1; i <= eipNodesLen; i++) {
            const startNode = document.querySelector(`.node-${i}`);
            const group = document.querySelector(`.group-${i % 3 + 1}`)
            const groupNodes = group.querySelector('.group-nodes').children;
            const len = groupNodes.length;
            const endNode = groupNodes[i % len];
            lines.push(new LeaderLine(
                startNode,
                endNode,
                scaledOption
            ));
        }
    };

    drawLeaderLine();

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                drawLeaderLine();
                break;
            }
        }
    });

    observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true
    });

    // 监听 container 尺寸变化，重新绘制连线
    const resizeObserver = new ResizeObserver(() => {
        const currentWidth = container.offsetWidth;

        // 计算宽度和高度的缩放比例（可以按比例最小的缩放）
        currentScale = currentWidth / initialWidth;

        container.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;

        drawLeaderLine(currentScale); // 尺寸变化时重新绘制连线
    });

    resizeObserver.observe(container);

    // 获取当前 translate 的值，默认值为0
    const getTranslateValues = () => {
        const style = window.getComputedStyle(container);
        const transform = style.transform || 'matrix(1, 0, 0, 1, 0, 0)';

        // 使用 DOMMatrix 尝试解析 transform
        if (typeof DOMMatrix !== 'undefined') {
            const matrix = new DOMMatrix(transform);
            translateX = matrix.m41; // 获取 X 轴平移值
            translateY = matrix.m42; // 获取 Y 轴平移值
        } else {
            // 如果不支持 DOMMatrix，退回到正则解析
            const regex = /translate\(([-\d.]+)px?,\s?([-\d.]+)px?\)/;
            const match = transform.match(regex);

            if (match) {
                translateX = parseFloat(match[1]);
                translateY = parseFloat(match[2]);
            } else {
                translateX = 0;
                translateY = 0;
            }
        }

        return {
            translateX,
            translateY
        };
    };

    // 暴露一个卸载钩子函数
    return function unmount() {
        clearAllLines();
        observer.disconnect();
        resizeObserver.disconnect();
    }
}