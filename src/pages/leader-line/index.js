import LeaderLine from 'lib/leader-line.min';
import './style.less';
import {
    insertBeforeFromTemplate
} from '@/utils';

let initialWidth = 0;
let currentScale = 1; // 画布缩放
const minScale = 0.5;
const maxScale = 6;
const scalingFactor = 0.05;

let isDragging = false;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;

// let isScrolling = true; // 标记是否在平滑滚动

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

const highlightOption = {
    color: '#30BF13',
    endPlugColor: '#30BF13'
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
            <div class="node node-${eipInex + 1}" data-index="${eipInex + 1}">
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
                VPC ${i + 1}
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
    const columnEip = document.querySelector('.column-eip');

    btnLoadmore.addEventListener('click', () => {
        const nodes = renderNodes();
        insertBeforeFromTemplate(nodes, btnLoadmore);
        drawLeaderLine(currentScale);
        btnLoadmore.scrollIntoView({
            block: 'end'
        });
    });

    columnEip.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('node')) {
            toggleDrawer(); // 显示抽屉
            setTimeout(() => {
                drawLeaderLine(currentScale, target);
            }, 50);
        }
    });

    initialWidth = container.offsetWidth;

    // 监听鼠标滚轮事件来实现缩放
    container.addEventListener('wheel', (event) => {
        // 防止页面滚动
        event.preventDefault();

        if (event.deltaY < 0) {
            currentScale *= 1 + scalingFactor; // 放大
        } else {
            currentScale /= 1 + scalingFactor; // 缩小
        }
        
        currentScale = currentScale > maxScale ? maxScale : currentScale < minScale ? minScale : currentScale;

        // 设置容器的缩放和平移
        container.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;

        // 重新绘制连线
        drawLeaderLine(currentScale);
    });

    // 获取当前 translate 的值，默认值为0
    const getTranslateValues = () => {
        const style = window.getComputedStyle(container);
        const transform = style.transform || 'matrix(1, 0, 0, 1, 0, 0)';
        let _translateX = 0;
        let _translateY = 0;
    
        // 使用 DOMMatrix 尝试解析 transform
        if (typeof DOMMatrix !== 'undefined') {
            const matrix = new DOMMatrix(transform);
            _translateX = matrix.m41; // 获取 X 轴平移值
            _translateY = matrix.m42; // 获取 Y 轴平移值
        } else {
            // 如果不支持 DOMMatrix，退回到正则解析
            const regex = /translate\(([-\d.]+)px?,\s?([-\d.]+)px?\)/;
            const match = transform.match(regex);
    
            if (match) {
                _translateX = parseFloat(match[1]);
                translateY = parseFloat(match[2]);
            } else {
                _translateX = 0;
                _translateY = 0;
            }
        }
    
        return {
            tx: _translateX,
            ty: _translateY
        };
    };

    // 监听鼠标拖动事件实现容器的移动
    outerContainer.addEventListener('mousedown', (event) => {
        isDragging = true;
        // 记录鼠标初始点击位置
        startX = event.pageX;
        startY = event.pageY;

        // 获取当前的 translate 值
        const { tx, ty} = getTranslateValues();
        translateX = tx / currentScale;
        translateY = ty / currentScale;
    });

    outerContainer.addEventListener('mousemove', (event) => {
        if (!isDragging) return;

        // 计算鼠标移动的距离
        const deltaX = event.pageX - startX;
        const deltaY = event.pageY - startY;

        // 更新 translateX 和 translateY 以反映移动
        const newTranslateX = translateX + deltaX;
        const newTranslateY = translateY + deltaY;
        // console.log(newTranslateX, newTranslateY);

        // 更新容器的 transform 样式
        container.style.transform = `scale(${currentScale}) translate(${newTranslateX}px, ${newTranslateY}px)`;
    });

    outerContainer.addEventListener('mouseup', () => {
        isDragging = false;
    });

    outerContainer.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    /**
     * 绘制连线
     *
     * @param scale 缩放比例，默认为1
     */
    const drawLeaderLine = (scale = 1, target) => {
        clearAllLines();

        const eipNodesLen = document.querySelector('.column-eip').children.length - 1;

        // 绘制公网边界节点到互联网节点的连线
        lines.push(new LeaderLine(
            internetNode,
            publicNetworkBorderNode,
            baseOption
        ));

        let dataIndex = 0;
        if (target) {
            dataIndex = parseInt(target.getAttribute('data-index'));
        }

        for (let i = 1; i <= eipNodesLen; i++) {
            const startNode = document.querySelector(`.node-${i}`);
            // 连接公网边界节点
            lines.push(new LeaderLine(
                publicNetworkBorderNode,
                startNode,
                { ...baseOption, ...(i === dataIndex ? highlightOption : {}) }
            ));
            // 连接 VPC
            const group = document.querySelector(`.group-${i % 3 + 1}`)
            const groupNodes = group.querySelector('.group-nodes').children;
            const len = groupNodes.length;
            const endNode = groupNodes[i % len];
            lines.push(new LeaderLine(
                startNode,
                endNode,
                { ...baseOption, ...(i === dataIndex ? highlightOption : {}) }
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

    // 暴露一个卸载钩子函数
    return function unmount() {
        clearAllLines();
        observer.disconnect();
        resizeObserver.disconnect();
        eipInex = 0;
    }
}