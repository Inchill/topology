import { Graph, re } from '@antv/g6';
import './style.less';

// 定义节点和边数据
const data = {
    nodes: [
        { id: 'publicBoundary', label: '公网边界', layer: 1 },
        // 第二层 EIP 节点
        { id: 'eip1', label: 'EIP 1', layer: 2 },
        { id: 'eip2', label: 'EIP 2', layer: 2 },
        { id: 'eip3', label: 'EIP 3', layer: 2 },
        // 第三层 VPC 节点及网关子节点
        { id: 'vpc1', label: 'VPC 1', layer: 3 },
        { id: 'vpc1-gateway1', label: '网关 1', parent: 'vpc1', layer: 3 },
        { id: 'vpc1-gateway2', label: '网关 2', parent: 'vpc1', layer: 3 },
        { id: 'vpc2', label: 'VPC 2', layer: 3 },
        { id: 'vpc2-gateway1', label: '网关 1', parent: 'vpc2', layer: 3 },
    ],
    edges: [
        // 公网边界连接到 EIP 节点
        { source: 'publicBoundary', target: 'eip1' },
        { source: 'publicBoundary', target: 'eip2' },
        { source: 'publicBoundary', target: 'eip3' },
        // EIP 节点连接到对应 VPC 网关
        { source: 'eip1', target: 'vpc1-gateway1' },
        { source: 'eip2', target: 'vpc1-gateway2' },
        { source: 'eip3', target: 'vpc2-gateway1' },
    ],
};

export default function (app) {
    const template = `<div class="container"></div>`;
    app.innerHTML = template;

    const container = document.querySelector('.container');

    // 初始化图表容器
    const graph = new Graph({
        container,   // DOM 容器 ID
        width: 800,
        height: 600,
        data,
        modes: {
            default: ['drag-canvas', 'zoom-canvas'],
        },
        layout: {
            type: 'dagre',
            rankdir: 'LR',   // 从左到右布局
            nodesep: 80,     // 节点间距
            ranksep: 80,    // 层级间距
        },
        defaultNode: {
            type: 'rect',
            size: [120, 40],
            style: {
                radius: 6,
                fill: '#C6E5FF',
                stroke: '#5B8FF9',
            },
            labelCfg: {
                style: {
                    fill: '#000',
                    fontSize: 14,
                },
            },
        },
        defaultEdge: {
            type: 'cubic-horizontal',
            style: {
                stroke: '#5B8FF9',
                lineWidth: 2,
            },
        },
    });
  
    graph.render();

    return function unmount() {};
}