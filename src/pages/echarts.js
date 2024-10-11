// src/demos/echarts-demo.js
import * as echarts from 'echarts';

export default function renderEChartsTopology(app) {
  const chartDiv = document.createElement('div');
  chartDiv.style.width = '600px';
  chartDiv.style.height = '400px';
  app.appendChild(chartDiv);

  const chart = echarts.init(chartDiv);
  const option = {
    series: [{
      type: 'graph',
      layout: 'force',
      data: [
        { name: 'Node 1', value: 10 },
        { name: 'Node 2', value: 20 },
        { name: 'Node 3', value: 30 }
      ],
      edges: [
        { source: 'Node 1', target: 'Node 2' },
        { source: 'Node 2', target: 'Node 3' },
      ]
    }]
  };

  chart.setOption(option);
}