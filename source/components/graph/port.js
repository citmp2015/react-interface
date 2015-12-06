import React from 'react';
import Edge from './edge';
import dragHandler from 'lib/dragHandler';
import getPortYPos from 'lib/getPortYPos';

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
            e => {
                this.updateMousePos(e.pageX - this._dragMouseX, e.pageY - this._dragMouseY);
                this._dragMouseX = e.pageX;
                this._dragMouseY = e.pageY;
            },
            () => {
                this.setState({dragging: false});

                //TODO support incoming ports
                if(this.props.type === "in") return;

                let target = this.getClosestPort(this.state.mouseX, this.state.mouseY);

                if(target === null) return;

                this.props.dispatch({
                    type: 'ADD_CONNECTION',
                    srcProcess: this.props.process,
                    srcPort: this.props.name,
                    tgtProcess: target.process,
                    tgtPort: target.port
                });
            }
        );

        this.state = {
            dragging: false,
            mouseX: 0,
            mouseY: 0
        };
    }

    updateMousePos(absoluteX, absoluteY){
        let mouseX = this.state.mouseX + Math.round(absoluteX * this.props.appState.scale);
        let mouseY = this.state.mouseY + Math.round(absoluteY * this.props.appState.scale);

        this.setState({mouseX, mouseY});
        //TODO support incoming ports
        if(this.props.type === "out"){
            window.requestAnimationFrame(() => this.searchConnection(mouseX, mouseY));
        }
    }

    searchConnection(mouseX, mouseY){
        let port = this.getClosestPort(mouseX, mouseY);
        //TODO highlight port
    }

    getClosestPort(mouseX, mouseY){
        let processes = this.props.processes;
        //first, filter procs by their x value
        let closeProcs = Object.keys(processes).filter(p => Math.abs(processes[p].metadata.x - mouseX - this.props.x) < 50);

        if(closeProcs.length === 0) return null;

        let inPorts = closeProcs.map(p => this.props.components[processes[p].component].inPorts);

        let minDistance = 1e3;
        let minProc = 0;
        let minPort = 0;

        inPorts.forEach((n, procIdx) => n.forEach((yPos, portIdx) => {
            //no sqrt (is monotonic anyway)
            let distance = Math.pow(
                processes[closeProcs[procIdx]].metadata.x - this.props.x - mouseX, 2
            ) + Math.pow(
                getPortYPos(portIdx) + processes[closeProcs[procIdx]].metadata.y - this.props.y - mouseY, 2
            );

            if(distance < minDistance){
                minDistance = distance;
                minProc = procIdx;
                minPort = portIdx;
            }
        }));

        return {process: closeProcs[minProc], port: inPorts[minProc][minPort]};
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

                    let endY = process.metadata.y + getPortYPos(portIdx);

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
