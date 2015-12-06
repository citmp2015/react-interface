import React from 'react';
import Edge from './edge';

export class Port extends React.Component {
    constructor(props) {
        super(props);

        //FIXME replace with arrow functions, unite with node
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.state = {
            dragging: false,
            mouseX: 0,
            mouseY: 0
        };
    }

    //move node on mouse movement
    onMouseDown(e){
        e.preventDefault();
        e.stopPropagation();

        //TODO adjust for viewport translation
        this.setState({
            dragging: true,
            mouseX: e.pageX,
            mouseY: e.pageY
        });

        //check for changes
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
    }
    onMouseMove(e){
        //update element position
        this.setState({
            mouseX: e.pageX,
            mouseY: e.pageY
        });

        //TODO check if close to any port, highlight port
    }
    onMouseUp(e){
        e.stopPropagation();

        this.setState({dragging: false});

        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
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
