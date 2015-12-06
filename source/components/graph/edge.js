import React from 'react';

export class Edge extends React.Component {
    constructor(props){
        super(props);

        let {process, port} = props.target;
        this.process = props.processes[process];
        this.portIdx = props.components[this.process.component].inPorts.indexOf(port);

        if(this.portIdx < 0) throw new Error('Port ' + props.target.port + ' does not exist');
    }
    render() {
        //TODO replace with bezier curve
        let endX = this.process.metadata.x;
        let endY = this.process.metadata.y + 10 + this.portIdx * 20;

        return <line x1={this.props.startX} y1={this.props.startY} x2={endX} y2={endY} strokeWidth="2" stroke="black"/>;
    }
}
