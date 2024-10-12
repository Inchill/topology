import * as d3 from 'd3';

export default function renderLeftToRightTree(app) {
    const { width, height } = app.getBoundingClientRect(); // 获取容器大小

    // 设置树形图数据
    const treeData = {
        name: "Internet",
        children: [
            {
                name: "Node 1",
                children: [{ name: "Child 1" }, { name: "Child 2" }]
            },
            {
                name: "Node 2",
                children: [{ name: "Child 3" }]
            }
        ]
    };

    // 创建树的布局
    const treemap = d3.tree().size([height, width - 200]); // 保留空间给节点显示

    // 转换数据为层次布局
    const root = d3.hierarchy(treeData);
    treemap(root);

    // 清空之前的内容
    d3.select(app).selectAll('*').remove();

    // 创建SVG容器
    const svg = d3.select(app).append("svg")
        .attr("width", width)
        .attr("height", height)
        .style('overflow', 'visible');

    // 定义 y 方向偏移量，避免节点被隐藏
    const yOffset = 100; // 偏移 100px

    // 添加连线
    svg.selectAll(".link")
        .data(root.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y + yOffset)  // 为 y 坐标添加偏移量
            .y(d => d.x))
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2);

    // 添加节点组
    const node = svg.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.y + yOffset},${d.x})`); // 同样为节点位置增加 y 偏移量

    // 为每个节点添加圆角矩形
    node.append("rect")
        .attr("width", 100)  // 矩形宽度
        .attr("height", 40)  // 矩形高度
        .attr("x", -50)      // 水平方向居中
        .attr("y", -20)      // 垂直方向居中
        .attr("fill", "#D4E5FF")
        .attr("stroke", "#333")
        .attr("stroke-width", 1.5)
        .attr("rx", 6)       // 设置圆角
        .attr("ry", 6);      // 设置圆角

    // 为每个节点添加文本，并让其在矩形中间显示
    node.append("text")
        .attr("dy", "0.35em")  // 垂直居中
        .attr("text-anchor", "middle")  // 水平居中
        .text(d => d.data.name)
        .style("font-size", "12px")
        .style("fill", "#333");
}