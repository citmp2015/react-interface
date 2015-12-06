import React from 'react';
import Edge from './edge';
import dragHandler from '../../lib/dragHandler';

export class Port extends React.Component {
    constructor(props) {
        super(props);

        this.onMouseDown = dragHandler(
            e => this.setState({
                dragging: true,
                mouseX: e.pageX,
                mouseY: e.pageY
            }),
            //TODO check if close to any port, highlight port
            e => this.setState({
                mouseX: e.pageX,
                mouseY: e.pageY
            }),
            () => this.setState({dragging: false})
        );

        this.state = {
            dragging: false,
            mouseX: 0,
            mouseY: 0
        };
    }

    render(){
        let connections = this.props.connections;

        let yPos = this.props.y + this.props.offsetY;

        return <g onMouseDown={this.onMouseDown.bind(this)}>
            <circle r="7" cx={this.props.x + this.props.offsetX} cy={yPos}/>
            {connections.map(c => {
                    let {process, port} = c.tgt;
                    process = this.props.processes[process];
                    let {inPorts} = this.props.components[process.component];
                    let portIdx = inPorts.indexOf(port);

                    if(portIdx < 0) throw new Error(`Port $(c.tgt.port) does not exist`);

                    let endY = process.metadata.y + 10 + portIdx * 20;

                    return <Edge
                        key={`${c.tgt.process}_${c.tgt.port}`}
                        startX={this.props.x + this.props.offsetX}
                        startY={yPos}
                        endX={process.metadata.x + this.props.offsetX}
                        endY={endY + this.props.offsetY}
                    />;
            })}
            {this.state.dragging ?
                <Edge key="drag" startX={this.props.x} startY={yPos} endX={this.state.mouseX} endY={this.state.mouseY}/> :
                []
            }
        </g>;
    }
}

Port.propTypes = {
    type: React.PropTypes.oneOf(['in', 'out']).isRequired
};
