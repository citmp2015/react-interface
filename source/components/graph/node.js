import React from 'react';
import {Port} from './port';
import {NodeForm} from './node-form';
import dragHandler from 'lib/dragHandler';
import getPortYPos from 'lib/getPortYPos';

export class Node extends React.Component {
    constructor(props) {
        super(props);

        let {inPorts, outPorts} = this.props.component;
        let maxPorts = Math.max(inPorts.length, outPorts.length);
        let minHeight = getPortYPos(maxPorts); //FIXME static sizing

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

                let x = this.props.metadata.x + Math.round((e.pageX - this._dragMouseX) * this.props.scale);
                let y = this.props.metadata.y + Math.round((e.pageY - this._dragMouseY) * this.props.scale);

                //save coordinates
                this._dragMouseX = e.pageX;
                this._dragMouseY = e.pageY;

                this.props.dispatch({type: 'MOVE_ELEMENT', name: this.props.name, x, y});
            }
        );

        this.state = {
            width: 20,
            height: minHeight + 20,
            selected: false
        };
    }

    //set size according to iframe size
    updateDimensions(){
        //get dimensions of container
        this.setState({
            width: this.refs.foreignContainer.scrollWidth + 20,
            height: Math.max(this.refs.foreignContainer.scrollHeight + 20, this.minHeight)
        });
    }

    componentDidMount(){
        this.updateDimensions();
    }

    render(){
        let {inPorts, outPorts} = this.props.component;
        let {width, height} = this.state;
        let {x, y} = this.props.metadata;

        let onClick = e => {
            e.stopPropagation();
            e.preventDefault();
            this.props.dispatch({
                type: 'SELECTION',
                kind: 'NODE',
                process: this.props.process,
                port: null,
                add: e.shiftKey
            });
        };

        return <g onMouseDown={this.onMouseDown} onClick={onClick}>
            <rect
                fill="hsla(0, 0%, 0%, 0.75)"
                stroke={`hsl(100, ${this.props.selected ? 80 : 0}%, 50%)`} strokeWidth="2px"
                rx="4" ry="4"
                width={width} height={height}
                x={x} y={y}
            />
            <foreignObject x={x + 10} y={y + 10} width={width - 20} height={height - 20} xmlns="http://www.w3.org/1999/xhtml">
                <div ref="foreignContainer">
                    <h3 style={{color: '#fff'}}>{this.props.metadata.label}</h3>
                    {this.props.component.formData ? <NodeForm
                        process={this.props.process}
                        updateDimensions={this.updateDimensions.bind(this)}
                        dispatch={this.props.dispatch}
                        data={this.props.component.formData}
                    /> : []}
                </div>
            </foreignObject>
            <g>
                {inPorts.map((n, i) => <Port
                        key={n}
                        type="in"
                        process={this.props.process}
                        x={x}
                        y={y + getPortYPos(i, this.state.height)}
                        processes={this.props.processes}
                        connections={[]}
                        scale={this.props.scale}
                        selected={this.props.selections.some(s => s.kind === 'HIGHLIGHT_PORT' && s.port === n)}
                        selections={[]}

                        //store
                        getState={this.props.getState}
                        dispatch={this.props.dispatch}
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
                        process={this.props.process} name={n}
                        x={x + width}
                        y={y + getPortYPos(i, this.state.height)}
                        processes={this.props.processes}
                        connections={connections}
                        scale={this.props.scale}
                        selected={false}
                        selections={this.props.selections.filter(s => s.kind === 'EDGE' && s.port === n)}

                        //store
                        getState={this.props.getState}
                        dispatch={this.props.dispatch}
                    />;
                })}
            </g>
        </g>;
    }
}
