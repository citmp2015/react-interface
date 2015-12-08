import React from 'react';

export default props => {
    let onClick = e => {
        e.preventDefault();
        e.stopPropagation();

        if(!props.dispatch) return; //just in case

        props.dispatch({
            type: 'SELECTION',
            kind: 'EDGE',
            process: props.connection.src.process,
            port: props.connection.src.port,
            connection: props.connection,
            add: e.shiftKey
        });
    }
    //TODO replace with bezier curve
    return <line
        x1={props.startX} y1={props.startY}
        x2={props.endX} y2={props.endY}
        strokeWidth="3" stroke={props.selected ? 'lime' : 'blue'}
        onClick={onClick}
    />;
};
