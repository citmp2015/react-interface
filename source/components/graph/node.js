import React from 'react';
import {Port} from './port';
import dragHandler from 'lib/dragHandler';

export class Node extends React.Component {
    constructor(props) {
        super(props);

        let {inPorts, outPorts} = this.props.component;
        let maxPorts = Math.max(inPorts.length, outPorts.length);
        let minHeight = 10 + maxPorts * 20; //FIXME static sizing

        this.minHeight = minHeight;

        this._dragMouseX = 0;
        this._dragMouseY = 0;

        this.onMouseDown = dragHandler(
            e => {
                this._dragMouseX = e.pageX;
                this._dragMouseY = e.pageY;
            },
            e => {
                //update element position
                //TODO update global state
                this.setState({
                    x: this.state.x + Math.round((e.pageX - this._dragMouseX) * this.props.appState.scale),
                    y: this.state.y + Math.round((e.pageY - this._dragMouseY) * this.props.appState.scale)
                });

                //save coordinates
                this._dragMouseX = e.pageX;
                this._dragMouseY = e.pageY;
            }
        );

        this.state = {
            width: 20,
            height: minHeight + 20,
            x: props.metadata.x,
            y: props.metadata.y
        };
    }

    //set size according to iframe size
    componentDidMount(){
        //get dimensions of container
        this.setState({
            width: this.refs.foreignContainer.scrollWidth + 20,
            height: Math.max(this.refs.foreignContainer.scrollHeight + 20, this.minHeight)
        });
    }

    render(){
        let {inPorts, outPorts} = this.props.component;
        let {width, height} = this.state;

        return <g onMouseDown={this.onMouseDown}>
            <rect
                fill="hsla(0, 0%, 0%, 0.75)"
                stroke="hsl(0, 0%, 50%)" strokeWidth="2px"
                rx="4" ry="4"
                width={width} height={height}
                x={this.state.x} y={this.state.y}
            />
            <foreignObject x={this.state.x + 10} y={this.state.y + 10} width={width - 20} height={height - 20}>
                <body xmlns="http://www.w3.org/1999/xhtml">
                    <div ref="foreignContainer">
                        <h3 style={{color: '#fff'}}>{this.props.metadata.label}</h3>
                        <form onMouseDown={e=>e.stopPropagation()}>
                            <label>Text: <input type="text" placeholder="Test"/></label>
                            <label>Number: <input type="number" placeholder="42"/></label>
                        </form>
                    </div>
                </body>
            </foreignObject>
            <g>
                {inPorts.map((n, i) =>
                    <Port
                        key={n}
                        type="in"
                        process={this.props.process}
                        x={this.state.x}
                        y={this.state.y + getPortYPos(i, this.state.height)}
                        processes={this.props.processes}
                        components={this.props.components}
                        connections={[]}
                        appState={this.props.appState}
                    />
                )}
            </g>
            <g>
                {outPorts.map((n, i) => {
                    let connections = this.props.connections.filter(
                        con => con.src && con.src.process === this.props.process && con.src.port === n
                    );

                    return <Port
                        type="out"
                        key={n}
                        process={this.props.process}
                        x={this.state.x + width}
                        y={this.state.y + getPortYPos(i, this.state.height)}
                        processes={this.props.processes}
                        components={this.props.components}
                        connections={connections}
                        appState={this.props.appState}
                    />;
                })}
            </g>
        </g>;
    }
}

//TODO add to separate module
function getPortYPos(idx, height){
    return 10 + idx * 20;
}
