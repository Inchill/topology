import { createBezierCurve } from '../../utils';
import './style.less';

/** 绘制直线 */
export function createLine(container, startElem, endElem) {
    // 获取容器内的 SVG 元素
    const svg = container.querySelector('.line-container');
    
    // 获取节点的位置
    const startRect = startElem.getBoundingClientRect();
    const endRect = endElem.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // 计算连线的起点和终点相对于 SVG 容器的位置
    const startX = startRect.left - containerRect.left + startRect.width / 2;
    const startY = startRect.top - containerRect.top + startRect.height / 2;
    const endX = endRect.left - containerRect.left + endRect.width / 2;
    const endY = endRect.top - containerRect.top + endRect.height / 2;

    // 创建或更新线条
    let line = svg.querySelector(`#line-${startElem.id}-${endElem.id}`);
    if (!line) {
        line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.id = `line-${startElem.id}-${endElem.id}`;
        line.setAttribute('stroke', 'black');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
    }

    // 设置线条起点和终点
    line.setAttribute('x1', startX);
    line.setAttribute('y1', startY);
    line.setAttribute('x2', endX);
    line.setAttribute('y2', endY);
}

/**
 * 绘制三次贝塞尔曲线
 * @param {*} container 
 * @param {*} startElem 
 * @param {*} endElem 
 */
// export function createBezierCurve(startElement, endElement, options = {}) {
//     const {
//         color = 'black',         // 线条颜色
//         size = 2,                // 线条粗细
//         endPlugSize = 4,             // 终点圆点大小
//         appendTo = document.body, // 默认插入到 body 中
//         startSocket = 'right',   // 起始点位置（top, right, bottom, left）
//         endSocket = 'left'       // 结束点位置（top, right, bottom, left）
//     } = options;

//     // 获取元素的边界框和中心坐标
//     const getOffset = (element) => {
//         const rect = element.getBoundingClientRect();
//         return {
//             x: rect.left,
//             y: rect.top,
//             centerX: rect.left + rect.width / 2,
//             centerY: rect.top + rect.height / 2,
//             width: rect.width,
//             height: rect.height
//         };
//     };

//     // 计算起始点和结束点坐标
//     const calculateSocketPosition = (element, socket) => {
//         const offset = getOffset(element);
//         switch (socket) {
//         case 'top':
//             return { x: offset.centerX, y: offset.y };
//         case 'bottom':
//             return { x: offset.centerX, y: offset.y + offset.height };
//         case 'left':
//             return { x: offset.x, y: offset.centerY };
//         case 'right':
//             return { x: offset.x + offset.width, y: offset.centerY };
//         default:
//             return { x: offset.centerX, y: offset.centerY }; // 默认返回中心点
//         }
//     };

//     // 创建 SVG 容器
//     const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//     svg.setAttribute("class", "custom-bezier-line");
//     svg.style.position = 'absolute';
//     svg.style.top = 0;
//     svg.style.left = 0;
//     svg.style.width = `100%`;
//     svg.style.height = `100%`;
//     svg.style.pointerEvents = 'none'; // 允许事件穿透
//     appendTo.appendChild(svg); // 将 SVG 插入到指定容器中

//     // 创建贝塞尔曲线路径
//     const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
//     path.setAttribute("fill", "none");
//     path.setAttribute("stroke", color);
//     path.setAttribute("stroke-width", size);
//     svg.appendChild(path);

//     // 创建终点小圆点
//     const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
//     circle.setAttribute("r", endPlugSize);
//     circle.setAttribute("fill", color);
//     svg.appendChild(circle);

//     // 设置贝塞尔路径和终点圆点位置
//     const setPosition = () => {
//         const startPoint = calculateSocketPosition(startElement, startSocket);
//         const endPoint = calculateSocketPosition(endElement, endSocket);

//         // 定义控制点，使线条平滑地连接两个节点
//         const controlPoint1 = { x: startPoint.x + (endPoint.x - startPoint.x) / 2, y: startPoint.y };
//         const controlPoint2 = { x: endPoint.x - (endPoint.x - startPoint.x) / 2, y: endPoint.y };

//         const pathData = `
//             M ${startPoint.x},${startPoint.y}
//             C ${controlPoint1.x},${controlPoint1.y}
//               ${controlPoint2.x},${controlPoint2.y}
//               ${endPoint.x},${endPoint.y}
//         `;
//         path.setAttribute("d", pathData);

//         // 设置终点圆点位置
//         circle.setAttribute("cx", endPoint.x);
//         circle.setAttribute("cy", endPoint.y);
//     };

//     // 初始渲染
//     setPosition();

//     // 更新连线位置
//     const position = () => setPosition();

//     // 更新线条颜色
//     const updateColor = (newColor) => {
//         path.setAttribute("stroke", newColor);
//         circle.setAttribute("fill", newColor);
//     };

//     // 返回销毁和更新方法
//     return {
//         position,
//         updateColor,
//         remove: () => svg.remove()
//     };
// }

export default function (app) {
    const template = `
        <div class="custom-line">
            <div class="outer-container">
                <div class="container">
                    <!-- 这里放你的拓扑图节点 -->
                    <div id="node1" class="node node-1">节点 1</div>
                    <div id="node2" class="node node-2">节点 2</div>
                    
                    <!-- SVG 用于绘制连线 -->
                    <svg class="line-container" xmlns="http://www.w3.org/2000/svg"></svg>
                </div>
            </div>
        </div>
    `;
    app.innerHTML = template;

    // 获取容器和节点
    const container = document.querySelector('.container');
    const node1 = document.getElementById('node1');
    const node2 = document.getElementById('node2');

    const option = {
        color: '#00788C',
        size: 2,
        endPlugSize: 4,
        appendTo: container,
        startSocket: 'right', // 设置起始点位置为右边中间
        endSocket: 'left',     // 设置结束点位置为左边中间
        endSocketOffset: { left: 1 }
    }

    // 初始化连线
    const line = createBezierCurve(node1, node2, option);

    // 在窗口大小或位置变化时重新绘制连线
    window.addEventListener('resize', () => line.position());

    return function unmount() {};
}