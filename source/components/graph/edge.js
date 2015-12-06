import React from 'react';

export default props => {
    //TODO replace with bezier curve
    return <line x1={props.startX} y1={props.startY} x2={props.endX} y2={props.endY} strokeWidth="2" stroke="blue"/>;
};
