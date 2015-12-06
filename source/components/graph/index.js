import React from 'react';
import {Node} from './node';
import dragHandler from 'lib/dragHandler';

/*
const MIN_ZOOM = .1;
const MAX_ZOOM = 15;
*/

export class Graph extends React.Component {
    constructor(props){
        super(props);

        this.state = {height: 0, width: 0, scale: 1, offsetX: 0, offsetY: 0};

        // move viewport
        this._dragMouseX = 0;
        this._dragMouseY = 0;

        this.onMouseDown = dragHandler(
            e => {
                this._dragMouseX = e.pageX;
                this._dragMouseY = e.pageY;
            },
            e => {
                this.setState({
                    offsetX: this.state.offsetX + Math.round((e.pageX - this._dragMouseX) / this.state.scale),
                    offsetY: this.state.offsetY + Math.round((e.pageY - this._dragMouseY) / this.state.scale)
                });

                //save coordinates
                this._dragMouseX = e.pageX;
                this._dragMouseY = e.pageY;
            }
        );
    }

    //TODO scale stuff onWheel

    componentWillMount(){
        let setSize = () => {
            this.setState({
                height: window.innerHeight,
                width: window.innerWidth
            });
        };

        //initialize it
        setSize();

        window.addEventListener('resize', setSize);
    }

    //TODO print groups
    render(){
        var {processes} = this.props;
        return <svg
            height={this.state.height} width={this.state.width}
            //onWheel={this.onWheel.bind(this)}
            onMouseDown={this.onMouseDown}
        >
            <g>{
                Object.keys(processes).map(n => {
                    let process = processes[n];

                    return <Node
                        key={n} process={n}
                        //scale={this.state.scale}
                        component={this.props.components[process.component]}
                        offsetX={this.state.offsetX} offsetY={this.state.offsetY}
                        metadata={process.metadata}
                        processes={processes}
                        components={this.props.components}
                        connections={this.props.connections}
                    />;
                })
            }</g>
        </svg>;
    }
}
