import React from 'react';
import {Node} from './node';
import dragHandler from 'lib/dragHandler';

const MIN_ZOOM = .1;
const MAX_ZOOM = 15;

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
                    offsetX: this.state.offsetX + Math.round((e.pageX - this._dragMouseX) * this.state.scale),
                    offsetY: this.state.offsetY + Math.round((e.pageY - this._dragMouseY) * this.state.scale)
                });

                //save coordinates
                this._dragMouseX = e.pageX;
                this._dragMouseY = e.pageY;
            }
        );
    }

    //scale stuff onWheel
    onWheel(e){
        e.preventDefault();

        let zoomFactor = e.deltaY / 300;
        zoomFactor = Math.min(0.5, Math.max(-0.5, zoomFactor)); //limit speed
        let scale = this.state.scale + (this.state.scale * zoomFactor);

        //check limits
        scale = Math.min(scale, MAX_ZOOM);
        scale = Math.max(scale, MIN_ZOOM);

        if(scale === this.state.scale) return;

        //TODO respect current position of pointer (currently zooms at top left corner)

        this.setState({scale});
    }

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
            onMouseDown={this.onMouseDown}
            onWheel={this.onWheel.bind(this)}
            viewBox={`${-this.state.offsetX} ${-this.state.offsetY} ${this.state.scale * this.state.width} ${this.state.scale * this.state.height}`}
        >
            <g>{
                Object.keys(processes).map(n => {
                    let process = processes[n];

                    return <Node
                        key={n} process={n} name={n}
                        //scale={this.state.scale}
                        component={this.props.components[process.component]}
                        scale={this.state.scale}
                        metadata={process.metadata}
                        processes={processes}
                        components={this.props.components}
                        connections={this.props.connections}

                        //store
                        dispatch={this.props.dispatch}
                    />;
                })
            }</g>
        </svg>;
    }
}
