function Hello(props) {
    return H('div', `Hello ${props.toWhat}`);
}

function FinalImage(props) {
    return H('img', { src: props.src });
}

function Dropdown(props) {
    return H('select', { className: 'dropdown' },
        props.options.map(o => H('option', o))
    );
}

function Clickable(props, state, setState) {
    const { clicks = 0 } = state;

    return H('button',
        {
            onclick() {
                setState({ clicks: clicks + 1 })
            }
        },
        `Clicked ${clicks} times`
    );
}