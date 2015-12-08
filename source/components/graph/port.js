import React from 'react';
import Edge from './edge';
import dragHandler from 'lib/dragHandler';
import getPortYPos from 'lib/getPortYPos';

const MAX_PORT_DISTANCE = 30;

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
                if(this.props.type === 'in') return;

                let target = this.getClosestPort(this.state.mouseX, this.state.mouseY);

                if(target === null) return;

                this.props.dispatch({
                    type: 'ADD_CONNECTION',
                    srcProcess: this.props.process,
                    srcPort: this.props.name,
                    tgtProcess: target.process,
                    tgtPort: target.port
                });

                this.props.dispatch({
                    type: 'DESELECT',
                    kind: 'HIGHLIGHT_PORT'
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
        let mouseX = this.state.mouseX + Math.round(absoluteX * this.props.scale);
        let mouseY = this.state.mouseY + Math.round(absoluteY * this.props.scale);

        this.setState({mouseX, mouseY});
        //TODO support incoming ports
        if(this.props.type === 'out'){
            window.requestAnimationFrame(() => this.searchConnection(mouseX, mouseY));
        }
    }

    searchConnection(mouseX, mouseY){
        let port = this.getClosestPort(mouseX, mouseY);

        if(port === null){
            this.props.dispatch({
                type: 'DESELECT',
                kind: 'HIGHLIGHT_PORT'
            });
            return;
        }

        this.props.dispatch({
            type: 'SELECTION',
            kind: 'HIGHLIGHT_PORT',
            process: port.process,
            port: port.port,
            //TODO direction: 'in',
            add: true
        });
    }

    getClosestPort(mouseX, mouseY){
        let xPos = this.props.x + mouseX;
        let yPos = this.props.y + mouseY;

        let processes = this.props.processes;
        //first, filter procs by their x value (simple speedup)
        let closeProcs = Object.keys(processes).filter(p => Math.abs(processes[p].metadata.x - xPos) < MAX_PORT_DISTANCE);

        if(closeProcs.length === 0) return null;

        let inPorts = closeProcs.map(p => this.props.getState().components[processes[p].component].inPorts);

        let minDistance = MAX_PORT_DISTANCE;
        let minProc = -1;
        let minPort = -1;

        inPorts.forEach((n, procIdx) => n.forEach((portName, portIdx) => {
            let distance = Math.sqrt(
                Math.pow(
                    processes[closeProcs[procIdx]].metadata.x - xPos, 2
                ) + Math.pow(
                    getPortYPos(portIdx) + processes[closeProcs[procIdx]].metadata.y - yPos, 2
                )
            );

            if(distance < minDistance){
                minDistance = distance;
                minProc = procIdx;
                minPort = portIdx;
            }
        }));

        if(minProc === -1) return null;

        return {process: closeProcs[minProc], port: inPorts[minProc][minPort]};
    }

    render(){
        let connections = this.props.connections;
        let state = this.props.getState();

        return <g onMouseDown={this.onMouseDown}>
            {connections.map(c => {
                    let {process, port} = c.tgt;
                    process = this.props.processes[process];
                    let {inPorts} = state.components[process.component];
                    let portIdx = inPorts.indexOf(port);

                    if(portIdx < 0) throw new Error(`Port $(c.tgt.port) does not exist`);

                    let endY = process.metadata.y + getPortYPos(portIdx);

                    return <Edge
                        key={`${c.tgt.process}_${c.tgt.port}`}
                        startX={this.props.x}
                        startY={this.props.y}
                        endX={process.metadata.x}
                        endY={endY}
                        selected={this.props.selections.some(s => s.connection === c)}
                        connection={c}
                        dispatch={this.props.dispatch}
                    />;
            })}
            <circle r="7" cx={this.props.x} cy={this.props.y}
                stroke={this.props.selected ? '#feed1c' : '#000'} strokeWidth="2px"
            />
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
