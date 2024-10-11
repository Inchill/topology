function App (app, routes = []) {
    const fragement = document.createDocumentFragment();
    const ul = document.createElement('ul');
    routes.forEach(route => {
        const path = route.path;
        const alink = document.createElement('a');
        alink.href = '#' + path;
        alink.innerText = route.name;
        const li = document.createElement('li');
        li.appendChild(alink);
        ul.appendChild(li);
    });
    fragement.appendChild(ul);
    app.appendChild(fragement);
}

export default App