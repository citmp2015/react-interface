import React from 'react';
import {Node} from './node';

/*
const MIN_ZOOM = .1;
const MAX_ZOOM = 15;
*/

export class Graph extends React.Component {
    constructor(props){
        super(props);
        this.state = {height: 0, width: 0, scale: 1, offsetX: 0, offsetY: 0};

        this._dragMouseX = 0;
        this._dragMouseY = 0;

        //FIXME replace with arrow functions, unite with node
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    // move viewport
    onMouseDown(e){
        e.preventDefault();
        e.stopPropagation();

        //save coordinates
        this._dragMouseX = e.pageX;
        this._dragMouseY = e.pageY;

        //check for changes
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
    }
    onMouseMove(e){
        //update element position
        this.setState({
            offsetX: this.state.offsetX + Math.round((e.pageX - this._dragMouseX) / this.state.scale),
            offsetY: this.state.offsetY + Math.round((e.pageY - this._dragMouseY) / this.state.scale)
        });

        //save coordinates
        this._dragMouseX = e.pageX;
        this._dragMouseY = e.pageY;
    }
    onMouseUp(e){
        e.stopPropagation();

        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
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
            onMouseDown={this.onMouseDown.bind(this)}
            //onWheel={this.onWheel.bind(this)}
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
