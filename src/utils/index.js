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