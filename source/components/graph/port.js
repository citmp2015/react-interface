import React from 'react';
import Edge from './edge';
import dragHandler from 'lib/dragHandler';

export class Port extends React.Component {
    constructor(props) {
        super(props);

        this._dragMouseX = 0;
        this._dragMouseY = 0;

        this.onMouseDown = dragHandler(
            e => {
                this._dragMouseX = e.pageX;
                this._dragMouseY = e.pageY;
                this.setState({dragging: true, mouseX: 0, mouseY: 0});
            },
            //TODO check if close to any port, highlight port
            e => {
                this.setState({
                    mouseX: this.state.mouseX + Math.round((e.pageX - this._dragMouseX) * this.props.appState.scale),
                    mouseY: this.state.mouseY + Math.round((e.pageY - this._dragMouseY) * this.props.appState.scale)
                });
                this._dragMouseX = e.pageX;
                this._dragMouseY = e.pageY;
            },
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

        return <g onMouseDown={this.onMouseDown}>
            <circle r="7" cx={this.props.x} cy={this.props.y}/>
            {connections.map(c => {
                    let {process, port} = c.tgt;
                    process = this.props.processes[process];
                    let {inPorts} = this.props.components[process.component];
                    let portIdx = inPorts.indexOf(port);

                    if(portIdx < 0) throw new Error(`Port $(c.tgt.port) does not exist`);

                    let endY = process.metadata.y + 10 + portIdx * 20;

                    return <Edge
                        key={`${c.tgt.process}_${c.tgt.port}`}
                        startX={this.props.x}
                        startY={this.props.y}
                        endX={process.metadata.x}
                        endY={endY}
                    />;
            })}
            {this.state.dragging ?
                [
                    <Edge
                        key="drag"
                        startX={this.props.x} startY={this.props.y}
                        endX={this.props.x + this.state.mouseX}
                        endY={this.props.y + this.state.mouseY}
                    />,
                    <circle key="dragc" r="7" cx={this.props.x + this.state.mouseX} cy={this.props.y + this.state.mouseY}/>
                ] :
                []
            }
        </g>;
    }
}

Port.propTypes = {
    type: React.PropTypes.oneOf(['in', 'out']).isRequired
};
