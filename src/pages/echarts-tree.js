import * as echarts from 'echarts';

// 一个节点内部还需要定义子节点，子节点基本结构是左图标右文字，rich 属性支持富文本，
// 但是距离定制化节点还是很麻烦（https://echarts.apache.org/zh/option.html#series-tree.label.rich）
// 最根本的问题是，树只能分叉，不能再收归分支到一个新的节点，比如某一层的节点，最终收归到一个节点，类似总分总的纺锤形布局

export default function renderCustomNodes(app) {
    const chartDiv = document.createElement('div');
    chartDiv.id = 'custom-nodes-demo';
    chartDiv.style.width = '100%';
    chartDiv.style.height = '100%';
    app.appendChild(chartDiv);

    const chart = echarts.init(chartDiv);

    const option = {
        legend: {
            orient: 'vertical',
            icon: 'circle',
            itemHeight: 8,
            itemWidth: 8,
            height: 600,
            width: 300,
            right: '0%',
            top: '5%'
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [{
            type: 'tree',
            data: [{
                name: 'Internet',
                symbol: 'rect',
                symbolSize: [160, 40],
                label: {
                    position: 'inside',
                    verticalAlign: 'middle',
                    align: 'center',
                    fontSize: 16,
                    color: '#fff',
                    formatter: '{icon| } {title|Internet}',
                    rich: {
                        icon: {
                            height: 20,
                            width: 20,
                            backgroundColor: {
                                image: 'https://icon-library.com/images/ie-icon/ie-icon-16.jpg' // IE 图标路径
                            },
                            align: 'left',
                            verticalAlign: 'middle'
                        },
                        title: {
                            color: '#fff',
                            fontSize: 16,
                            align: 'left',
                            verticalAlign: 'middle'
                        }
                    }
                },
                itemStyle: {
                    color: '#D4E5FF',
                    borderColor: '#fff',
                    borderWidth: 1,
                    borderRadius: 4,
                    shadowBlur: 8,
                    shadowColor: 'rgba(7,12,20,0.12)',
                    shadowOffsetX: 0,
                    shadowOffsetY: 2
                },
                children: [{
                    name: '公网边界',
                    symbol: 'rect',
                    symbolSize: [140, 80], // 调整高度以容纳 DDos 防护
                    label: {
                        position: 'inside',
                        verticalAlign: 'middle',
                        align: 'center',
                        fontSize: 14,
                        color: '#000',
                        formatter: function() {
                            return '{title|公网边界}\n\n{ddosBox|{icon| } {ddos|DDos 防护}}';  // 在同一个节点内显示公网边界和 DDos 防护
                        },
                        rich: {
                            icon: {
                                height: 16,
                                width: 16,
                                backgroundColor: {
                                    image: 'https://icon-library.com/images/shield-icon/shield-icon-5.jpg' // DDos 图标路径
                                },
                                align: 'left',
                                verticalAlign: 'middle'
                            },
                            ddosBox: {
                                backgroundColor: '#F7F7F9',
                                borderRadius: 6,
                                padding: [5, 10],
                                align: 'center',
                                verticalAlign: 'middle'
                            },
                            ddos: {
                                color: '#000',
                                fontSize: 12,
                                align: 'left',
                                verticalAlign: 'middle'
                            },
                            title: {
                                color: '#000',
                                fontSize: 14,
                                align: 'center',
                                verticalAlign: 'middle'
                            }
                        }
                    },
                    itemStyle: {
                        color: '#fff',
                        borderColor: '#fff',
                        borderWidth: 1,
                        borderRadius: 4,
                        shadowBlur: 8,
                        shadowColor: 'rgba(7,12,20,0.12)',
                        shadowOffsetX: 0,
                        shadowOffsetY: 2
                    }
                }]
            }],
            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '20%',
            symbolSize: 7,
            label: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                fontSize: 9
            },
            leaves: {
                label: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left'
                }
            },
            emphasis: {
                focus: 'descendant'
            },
            expandAndCollapse: false,
            animationDuration: 550,
            animationDurationUpdate: 750
        }]
    };

    chart.setOption(option);
}

// export default function renderCustomNodes(app) {
//     const chartDiv = document.createElement('div');
//     chartDiv.id = 'custom-nodes-demo';
//     chartDiv.style.width = '100%';
//     chartDiv.style.height = '100%';
//     app.appendChild(chartDiv);

//     const chart = echarts.init(chartDiv);

//     const option = {
//         tooltip: {
//             trigger: 'item',
//             triggerOn: 'mousemove'
//         },
//         series: [{
//             type: 'tree',
//             data: [{
//                 name: '总节点',  // 根节点
//                 symbol: 'rect',
//                 symbolSize: [160, 40],
//                 label: {
//                     position: 'inside',
//                     verticalAlign: 'middle',
//                     align: 'center',
//                     fontSize: 16,
//                     color: '#fff',
//                     formatter: '{title|总节点}'
//                 },
//                 itemStyle: {
//                     color: '#4d9bf5',
//                     borderColor: '#fff',
//                     borderWidth: 1,
//                     borderRadius: 4,
//                     shadowBlur: 8,
//                     shadowColor: 'rgba(7,12,20,0.12)',
//                     shadowOffsetX: 0,
//                     shadowOffsetY: 2
//                 },
//                 children: [
//                     {
//                         name: '子节点 1',
//                         symbol: 'rect',
//                         symbolSize: [140, 40],
//                         label: {
//                             position: 'inside',
//                             verticalAlign: 'middle',
//                             align: 'center',
//                             fontSize: 14,
//                             color: '#000',
//                             formatter: '{title|子节点 1}'
//                         },
//                         itemStyle: {
//                             color: '#ff9f7f',
//                             borderColor: '#fff',
//                             borderWidth: 1,
//                             borderRadius: 4,
//                             shadowBlur: 8,
//                             shadowColor: 'rgba(7,12,20,0.12)',
//                             shadowOffsetX: 0,
//                             shadowOffsetY: 2
//                         },
//                     },
//                     {
//                         name: '子节点 2',
//                         symbol: 'rect',
//                         symbolSize: [140, 40],
//                         label: {
//                             position: 'inside',
//                             verticalAlign: 'middle',
//                             align: 'center',
//                             fontSize: 14,
//                             color: '#000',
//                             formatter: '{title|子节点 2}'
//                         },
//                         itemStyle: {
//                             color: '#ffb77f',
//                             borderColor: '#fff',
//                             borderWidth: 1,
//                             borderRadius: 4,
//                             shadowBlur: 8,
//                             shadowColor: 'rgba(7,12,20,0.12)',
//                             shadowOffsetX: 0,
//                             shadowOffsetY: 2
//                         },
//                     }
//                 ]
//             }, {
//                 name: '第四节点',  // 新增第四节点
//                 symbol: 'rect',
//                 symbolSize: [160, 40],
//                 label: {
//                     position: 'inside',
//                     verticalAlign: 'middle',
//                     align: 'center',
//                     fontSize: 16,
//                     color: '#fff',
//                     formatter: '{title|第四节点}'
//                 },
//                 itemStyle: {
//                     color: '#4d9bf5',
//                     borderColor: '#fff',
//                     borderWidth: 1,
//                     borderRadius: 4,
//                     shadowBlur: 8,
//                     shadowColor: 'rgba(7,12,20,0.12)',
//                     shadowOffsetX: 0,
//                     shadowOffsetY: 2
//                 },
//                 children: [
//                     {
//                         name: '最终子节点 1'
//                     },
//                     {
//                         name: '最终子节点 2'
//                     }
//                 ]
//             }],
//             top: '1%',
//             left: '7%',
//             bottom: '1%',
//             right: '20%',
//             symbolSize: 7,
//             label: {
//                 position: 'left',
//                 verticalAlign: 'middle',
//                 align: 'right',
//                 fontSize: 9
//             },
//             emphasis: {
//                 focus: 'descendant'
//             },
//             expandAndCollapse: true,  // 开启节点的展开和收缩
//             animationDuration: 550,
//             animationDurationUpdate: 750
//         }]
//     };

//     chart.setOption(option);
// }
