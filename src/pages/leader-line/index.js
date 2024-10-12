import LeaderLine from 'lib/leader-line.min';
import './style.less';

const baseOption = {
    color: '#D4D6D9',
    endPlug: 'disc',
    endPlugSize: 4,
    size: 1
};

const GROUP_NODE_NAMES = ['NAT网关', '弹性网卡', 'VPN网关'];
let lines = [];

const renderNodes = () => {
    let nodes = '';
    for (let i = 0; i < 8; i++) {
        nodes += `
            <div class="node node-${i + 1}">
                <i class="icon-node"></i>
                192.168.0.${i + 1}
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
    lines.forEach(line => line.remove());  // 调用 remove 方法清除连线
    lines = [];
}

export default function(app) {
    const template = `
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
            <div class="column">
                ${renderNodes()}
            </div>
            <div class="column">
                ${renderGroup()}
            </div>
        </div>
    `;

    app.innerHTML = template;

    const container = document.querySelector('.container');
    const internetNode = document.querySelector('.internet');
    const publicNetworkBorderNode = document.querySelector('.public-network-border');

    const drawLeaderLine = () => {
        // 第一组连线
        lines.push(new LeaderLine(
            internetNode,
            publicNetworkBorderNode,
            baseOption
        ));

        // 第二组连线
        for (let i = 1; i <= 8; i++) {
            lines.push(new LeaderLine(
                publicNetworkBorderNode,
                document.querySelector(`.node-${i}`),
                baseOption
            ));
        }

        // 第三组连线
        for (let i = 1; i <= 8; i++) {
            const startNode = document.querySelector(`.node-${i}`);
            const group = document.querySelector(`.group-${i % 3 + 1}`)
            const groupNodes = group.querySelector('.group-nodes').children;
            const len = groupNodes.length;
            const endNode = groupNodes[i % len];
            lines.push(new LeaderLine(
                startNode,
                endNode,
                baseOption
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

    // 暴露一个卸载钩子函数
    return function unmount() {
        clearAllLines();
        observer.disconnect();
    }
}

