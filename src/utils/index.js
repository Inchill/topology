export function insertBefore(newNode, referenceNode) {
    // 获取参考节点的父节点
    const parent = referenceNode.parentNode;

    if (parent) {
        // 将新节点插入到参考节点之前
        parent.insertBefore(newNode, referenceNode);
    } else {
        console.error('Reference node does not have a parent.');
    }
}

/**
 * 使用模板字符串创建节点并将其插入到参考节点之前
 *
 * @param template 模板字符串，用于创建新的 DOM 元素
 * @param referenceNode 参考节点，新创建的节点将被插入到这个节点之前
 *
 * @returns 无返回值
 *
 * @throws 如果参考节点没有父节点或者模板字符串解析的节点无效，将抛出错误
 */
export function insertBeforeFromTemplate(template, referenceNode) {
    // 创建一个临时的容器来解析模板字符串
    const container = document.createElement('div');
    container.innerHTML = template;

    // 获取解析后的所有 DOM 元素
    const newNodes = Array.from(container.children);

    // 获取参考节点的父节点
    const parent = referenceNode.parentNode;

    if (parent && newNodes.length > 0) {
        // 遍历所有节点并插入到参考节点之前
        newNodes.forEach(node => {
            parent.insertBefore(node, referenceNode);
        });
    } else {
        console.error('Reference node does not have a parent or no new nodes found.');
    }
}

/**
 * 创建贝塞尔曲线
 *
 * @param startElement 起始元素
 * @param endElement 结束元素
 * @param options 选项配置
 * @param options.color 线条颜色，默认为 'black'
 * @param options.size 线条粗细，默认为 2
 * @param options.endPlugSize 终点圆点大小，默认为 4
 * @param options.appendTo 插入到的 DOM 元素，默认为 document.body
 * @param options.startSocket 起始点位置（top, right, bottom, left），默认为 'right'
 * @param options.endSocket 结束点位置（top, right, bottom, left），默认为 'left'
 * @param options.endSocketOffset 结束点偏移，默认为 { left: 0, top: 0 }
 * @param options.endPlugColor 终点颜色，默认为线条颜色
 * @returns 包含 position, updateColor, remove 方法的对象
 */
export function createBezierCurve(startElement, endElement, options = {}) {
    if (!startElement || !endElement) {
        console.error('Start or end element is missing.');
        return;
    }

    const {
        color = 'black', // 线条颜色
        size = 2, // 线条粗细
        endPlugSize = 4, // 终点圆点大小
        appendTo = document.body, // 默认插入到 body 中
        startSocket = 'right', // 起始点位置（top, right, bottom, left）
        endSocket = 'left', // 结束点位置（top, right, bottom, left）
        endSocketOffset = { left: 0, top: 0 }, // 结束点偏移
        endPlugColor = color, // 终点颜色
        endSocketBorderColor = 'transparent', // 终点圆点边框颜色
        endSocketBorderWidth = 0, // 终点圆点边框宽度
        zIndex = 0
    } = options;
    let lastPosition = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    // 获取元素的边界框和中心坐标
    const getOffset = (element) => {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left,
            y: rect.top,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2,
            width: rect.width,
            height: rect.height
        };
    };

    // 计算起始点和结束点坐标
    const calculateSocketPosition = (element, socket) => {
        const offset = getOffset(element);
        switch (socket) {
        case 'top':
            return { x: offset.centerX, y: offset.y };
        case 'bottom':
            return { x: offset.centerX, y: offset.y + offset.height };
        case 'left':
            return { x: offset.x, y: offset.centerY };
        case 'right':
            return { x: offset.x + offset.width, y: offset.centerY };
        default:
            return { x: offset.centerX, y: offset.centerY }; // 默认返回中心点
        }
    };

    // 创建 SVG 容器
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'custom-bezier-line');
    svg.style.position = 'absolute';
    svg.style.pointerEvents = 'none'; // 允许事件穿透
    zIndex && (svg.style.zIndex = zIndex);
    appendTo.appendChild(svg);

    // 创建贝塞尔曲线路径
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', size);
    svg.appendChild(path);

    // 创建终点小圆点
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', endPlugSize - endSocketBorderWidth / 2);
    circle.setAttribute('fill', endPlugColor);
    if (endSocketBorderWidth > 0) {
        circle.setAttribute('stroke', endSocketBorderColor);
        circle.setAttribute('stroke-width', endSocketBorderWidth);
    }
    svg.appendChild(circle);


    // 辅助函数：获取容器偏移量
    const getContainerOffset = () => {
        if (appendTo === document.body) {
            return { left: 0, top: 0 }; // 不偏移，直接使用页面坐标
        }
        const rect = appendTo.getBoundingClientRect();
        return { left: rect.left, top: rect.top };
    };

    // 设置贝塞尔路径和终点圆点位置
    const setPosition = () => {
        const startPoint = calculateSocketPosition(startElement, startSocket);
        const endPoint = calculateSocketPosition(endElement, endSocket);

        // 应用偏移量到结束点
        endPoint.x += endSocketOffset.left || 0;
        endPoint.y += endSocketOffset.top || 0;

        // 定义最小包围矩形的边界
        const padding = endPlugSize; // 添加一个最小 padding 值来防止端点被隐藏
        const minX = Math.min(startPoint.x, endPoint.x) - padding;
        const minY = Math.min(startPoint.y, endPoint.y) - padding;
        const width = Math.abs(endPoint.x - startPoint.x) + padding * 2;
        const height = Math.abs(endPoint.y - startPoint.y) + padding * 2;

        const shouldUpdate = lastPosition.x === minX
            && lastPosition.y === minY
            && lastPosition.width === width
            && lastPosition.height === height;

        if (shouldUpdate) {
            return; // 位置没有变化，不更新
        }

        // 获取相对于容器的偏移量
        const containerOffset = getContainerOffset();

        // 设置 SVG 的位置和大小
        svg.style.left = `${minX - containerOffset.left}px`;
        svg.style.top = `${minY - containerOffset.top}px`;
        svg.setAttribute('width', width || size); // 防止宽度为 0
        svg.setAttribute('height', height || size); // 防止高度为 0
        lastPosition = { x: minX, y: minY, width, height }; // 记录位置信息

        // 转换起点和终点到相对坐标
        const startPointRelative = { x: startPoint.x - minX, y: startPoint.y - minY };
        const endPointRelative = { x: endPoint.x - minX, y: endPoint.y - minY };

        // 定义控制点
        const controlPoint1 = {
            x: startPointRelative.x + (endPointRelative.x - startPointRelative.x) / 2,
            y: startPointRelative.y
        };
        const controlPoint2 = {
            x: endPointRelative.x - (endPointRelative.x - startPointRelative.x) / 2,
            y: endPointRelative.y
        };

        // 设置贝塞尔曲线路径数据
        const pathData = `
            M ${startPointRelative.x},${startPointRelative.y}
            C ${controlPoint1.x},${controlPoint1.y}
              ${controlPoint2.x},${controlPoint2.y}
              ${endPointRelative.x},${endPointRelative.y}
        `;
        path.setAttribute('d', pathData);

        // 设置终点小圆点位置
        circle.setAttribute('cx', endPointRelative.x);
        circle.setAttribute('cy', endPointRelative.y);
        circle.setAttribute('fill', endPlugColor);
        if (endSocketBorderWidth > 0) {
            circle.setAttribute('stroke', endSocketBorderColor);
            circle.setAttribute('stroke-width', endSocketBorderWidth);
            circle.setAttribute('r', endPlugSize - endSocketBorderWidth / 2);
        } else {
            circle.setAttribute('r', endPlugSize);
        }
    };

    // 初始渲染
    setPosition();

    // 更新连线位置
    const position = () => setPosition();

    // 更新线条颜色
    const updateColor = (newColor, newEndPlugColor) => {
        path.setAttribute('stroke', newColor);
        circle.setAttribute('fill', newEndPlugColor || newColor);
    };

    // 返回销毁和更新方法
    return {
        position,
        updateColor,
        remove: () => svg.remove()
    };
}