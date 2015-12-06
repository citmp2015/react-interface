import React from 'react';
import Edge from './edge';

export class Port extends React.Component {
    constructor(props) {
        super(props);
    }
    render(){
        let connections = [];
        if(this.props.type === 'out'){
             connections = this.props.connections.filter(
                 con => con.src && con.src.process === this.props.process && con.src.port === this.props.name
             );
        }

        let yPos = this.props.y + 10 + this.props.index * 20;

        return <g>
            <circle r="7" cx={this.props.x} cy={yPos}></circle>
            {connections.map(c => {
                    let {process, port} = c.tgt;
                    process = this.props.processes[process];
                    let component = this.props.components[process.component];
                    let portIdx = component.inPorts.indexOf(port);

                    if(portIdx < 0) throw new Error(`Port $(c.tgt.port) does not exist`);

                    let endY = process.metadata.y + 10 + portIdx * 20;

                    return <Edge
                        key={`${c.tgt.process}_${c.tgt.port}`}
                        startX={this.props.x} startY={yPos}
                        endX={process.metadata.x} endY={endY}
                    />;
            })}
        </g>;
    }
}

Port.propTypes = {
    name: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,
    type: React.PropTypes.oneOf(['in', 'out']).isRequired
};
