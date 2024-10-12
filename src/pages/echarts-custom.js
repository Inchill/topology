import * as echarts from 'echarts';

export default function (app) {
    const chartDiv = document.createElement('div');
    chartDiv.id = 'custom-nodes-demo';
    chartDiv.style.width = '100%';
    chartDiv.style.height = '100%';
    app.appendChild(chartDiv);

    const chart = echarts.init(chartDiv);

    const ipNodes = ['123.45.67.89', '98.76.54.32', '192.168.1.1', '192.168.1.2', '192.168.1.3']; // IP 地址数据
    const ipNodeHeight = 50; // 每个 IP 节点的高度
    const ipNodeSpacing = 10; // 节点之间的间距
    const thirdLayerHeight = ipNodes.length * ipNodeHeight + (ipNodes.length - 1) * ipNodeSpacing;

    const thirdLayerTop = 200; // 第三层的顶部 y 坐标
    const thirdLayerMiddleY = thirdLayerTop + thirdLayerHeight / 2; // 第三层的垂直中线

    // 计算第一层和第二层的 y 坐标，使它们居中
    const firstLayerHeight = 50;
    const secondLayerHeight = 150;
    const firstLayerMiddleY = thirdLayerMiddleY - (firstLayerHeight + secondLayerHeight) / 2;
    const secondLayerMiddleY = firstLayerMiddleY + firstLayerHeight / 2 + secondLayerHeight / 2;

    // 第四层的起始 x 坐标
    const fourthLayerX = 1100;
    const fourthLayerSpacing = 50; // 每个组之间的水平间距
    const groupNodeHeight = 40; // 每个组内节点的高度
    const groupNodeSpacing = 10; // 组内节点之间的间距

    const fourthLayerGroups = [{
        title: 'NAT 组',
        nodes: ['NAT Gateway', 'NAT Server']
    },
    {
        title: '云服务器组',
        nodes: ['Cloud Server 1', 'Cloud Server 2', 'Cloud Server 3']
    },
    {
        title: '负载均衡组',
        nodes: ['Load Balancer']
    }
    ];

    const option = {
        xAxis: {
            show: false,
            min: 0,
            max: 1500,
        },
        yAxis: {
            show: false,
            min: 0,
            max: 1500,
        },
        grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            containLabel: true,
        },
        series: [{
            type: 'custom',
            renderItem: function () {
                const group = [];

                // 第一个节点 - IE 浏览器图标和 Internet 文字
                group.push({
                    type: 'rect',
                    shape: {
                        x: 50, // 第一个节点的 x 坐标
                        y: firstLayerMiddleY + firstLayerHeight / 2, // 垂直居中的 y 坐标
                        width: 200,
                        height: firstLayerHeight,
                    },
                    style: {
                        fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#ADD8E6'
                        },
                        {
                            offset: 1,
                            color: '#FFFFFF'
                        }
                        ]),
                        stroke: '#000', // 边框颜色
                    }
                });

                // IE 图标
                group.push({
                    type: 'image',
                    style: {
                        image: 'https://icon-library.com/images/ie-icon/ie-icon-16.jpg', // IE 图标
                        x: 60,
                        y: firstLayerMiddleY + 30,
                        width: 30,
                        height: 30,
                    }
                });

                // Internet 文字
                group.push({
                    type: 'text',
                    style: {
                        text: 'Internet',
                        x: 100,
                        y: firstLayerMiddleY + 40,
                        fill: '#000',
                        font: 'bold 16px Arial',
                    }
                });

                // 第二个节点 - 公网边界
                group.push({
                    type: 'rect',
                    shape: {
                        x: 400, // 公网边界的 x 坐标
                        y: secondLayerMiddleY - secondLayerHeight / 2, // 垂直居中的 y 坐标
                        width: 300,
                        height: secondLayerHeight,
                    },
                    style: {
                        fill: '#E0E0E0',
                        stroke: '#000',
                    }
                });

                // 公网边界标题
                group.push({
                    type: 'text',
                    style: {
                        text: '公网边界',
                        x: 410,
                        y: secondLayerMiddleY - secondLayerHeight / 2 + 20,
                        fill: '#000',
                        font: 'bold 16px Arial',
                    }
                });

                // 第一个小矩形 - DDos
                group.push({
                    type: 'rect',
                    shape: {
                        x: 410,
                        y: secondLayerMiddleY - 25,
                        width: 120,
                        height: 50,
                    },
                    style: {
                        fill: '#ADD8E6',
                        stroke: '#000',
                    }
                });

                // DDos 图标
                group.push({
                    type: 'image',
                    style: {
                        image: 'https://icon-library.com/images/ddos-icon/ddos-icon-16.jpg',
                        x: 420,
                        y: secondLayerMiddleY - 15,
                        width: 30,
                        height: 30,
                    }
                });

                // DDos 文字
                group.push({
                    type: 'text',
                    style: {
                        text: 'DDos',
                        x: 460,
                        y: secondLayerMiddleY + 10,
                        fill: '#000',
                        font: 'bold 14px Arial',
                    }
                });

                // 第二个小矩形 - 防火墙
                group.push({
                    type: 'rect',
                    shape: {
                        x: 540,
                        y: secondLayerMiddleY - 25,
                        width: 120,
                        height: 50,
                    },
                    style: {
                        fill: '#ADD8E6',
                        stroke: '#000',
                    }
                });

                // 防火墙图标
                group.push({
                    type: 'image',
                    style: {
                        image: 'https://icon-library.com/images/firewall-icon-png/firewall-icon-png-16.jpg',
                        x: 550,
                        y: secondLayerMiddleY - 15,
                        width: 30,
                        height: 30,
                    }
                });

                // 防火墙文字
                group.push({
                    type: 'text',
                    style: {
                        text: '防火墙',
                        x: 590,
                        y: secondLayerMiddleY + 10,
                        fill: '#000',
                        font: 'bold 14px Arial',
                    }
                });

                // 添加曲线连接第一个节点和公网边界
                group.push({
                    type: 'line',
                    shape: {
                        x1: 250, // 第一个节点的右边界
                        y1: firstLayerMiddleY + firstLayerHeight, // 第一个节点的垂直中线
                        x2: 400, // 第二个节点的左边界
                        y2: secondLayerMiddleY, // 第二个节点的垂直中线
                        curveness: 0.5, // 使连接线为曲线
                    },
                    style: {
                        stroke: '#000', // 线条颜色
                        lineWidth: 1, // 线条宽度
                        smooth: true, // 曲线
                    }
                });

                // 公网 IP 节点 - 第三层
                ipNodes.forEach((ip, index) => {
                    const yPos = thirdLayerTop + index * (ipNodeHeight + ipNodeSpacing); // 每个节点的 y 坐标动态调整

                    // 节点矩形
                    group.push({
                        type: 'rect',
                        shape: {
                            x: 750, // 公网 IP 的 x 坐标
                            y: yPos,
                            width: 200,
                            height: ipNodeHeight,
                        },
                        style: {
                            fill: '#F0F0F0',
                            stroke: '#000',
                        }
                    });

                    // 公网 IP 图标
                    group.push({
                        type: 'image',
                        style: {
                            image: 'https://icon-library.com/images/ip-icon-png/ip-icon-png-16.jpg', // 公网 IP 图标
                            x: 760,
                            y: yPos + 10,
                            width: 30,
                            height: 30,
                        }
                    });

                    // 公网 IP 地址文本
                    group.push({
                        type: 'text',
                        style: {
                            text: ip,
                            x: 800,
                            y: yPos + 35,
                            fill: '#000',
                            font: 'bold 14px Arial',
                        }
                    });

                    // 连接线从公网边界到公网 IP 节点 - 使用曲线
                    group.push({
                        type: 'line',
                        shape: {
                            x1: 700, // 公网边界右侧中点


                            y1: secondLayerMiddleY,
                            x2: 750, // 公网 IP 节点左侧中点
                            y2: yPos + ipNodeHeight / 2,
                            curveness: 0.5, // 曲线连接
                        },
                        style: {
                            stroke: '#000',
                            lineWidth: 1,
                            smooth: true,
                        }
                    });
                });

                // 第四层节点组绘制
                fourthLayerGroups.forEach((groupData, groupIndex) => {
                    const groupX = fourthLayerX; // 每个组的 x 坐标
                    const groupY = thirdLayerTop + groupIndex * (150 + fourthLayerSpacing); // 每个组从第三层顶部开始

                    // 绘制组矩形框
                    group.push({
                        type: 'rect',
                        shape: {
                            x: groupX,
                            y: groupY,
                            width: 250,
                            height: groupData.nodes.length * (groupNodeHeight + groupNodeSpacing),
                        },
                        style: {
                            fill: '#E0F7FA',
                            stroke: '#000',
                        }
                    });

                    // 组标题
                    group.push({
                        type: 'text',
                        style: {
                            text: groupData.title,
                            x: groupX + 10,
                            y: groupY + 20,
                            fill: '#000',
                            font: 'bold 16px Arial',
                        }
                    });

                    // 绘制组内的节点
                    groupData.nodes.forEach((node, nodeIndex) => {
                        const nodeY = groupY + 40 + nodeIndex * (groupNodeHeight + groupNodeSpacing); // 组内节点的 y 坐标

                        // 节点矩形
                        group.push({
                            type: 'rect',
                            shape: {
                                x: groupX + 10,
                                y: nodeY,
                                width: 230,
                                height: groupNodeHeight,
                            },
                            style: {
                                fill: '#B2EBF2',
                                stroke: '#000',
                            }
                        });

                        // 节点文字
                        group.push({
                            type: 'text',
                            style: {
                                text: node,
                                x: groupX + 20,
                                y: nodeY + 25,
                                fill: '#000',
                                font: '14px Arial',
                            }
                        });

                        // 绘制从公网 IP 到第四层节点的连接线（使用曲线）
                        const ipNodeY = thirdLayerTop + nodeIndex * (ipNodeHeight + ipNodeSpacing); // 与公网 IP 对应的 y 坐标

                        group.push({
                            type: 'line',
                            shape: {
                                x1: 950, // 公网 IP 的右侧中点
                                y1: ipNodeY + ipNodeHeight / 2,
                                x2: groupX, // 第四层节点组左侧
                                y2: nodeY + groupNodeHeight / 2,
                                curveness: 0.5, // 曲线连接
                            },
                            style: {
                                stroke: '#000',
                                lineWidth: 1,
                                smooth: true,
                            }
                        });
                    });
                });


                return {
                    type: 'group',
                    children: group,
                };
            },
            data: [
                [0, 0]
            ], // 自定义节点的数据
        }],
    };

    chart.setOption(option);

    return function unmount() {
        chart.dispose();
    }
}