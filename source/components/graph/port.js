import React from 'react';
import {Edge} from './edge';

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
            {connections.map(
                c => <Edge
                        key={`${c.tgt.process}_${c.tgt.port}`}
                        target={c.tgt}
                        startX={this.props.x} startY={yPos}
                        {...this.props}
                    />
            )}
        </g>;
    }
}

/*

React.DOM.circle({
            className: "port-circle",
            cx: this.props.x,
            cy: this.props.y,
            r: 4
          }),
          React.DOM.text({
            className: "port-label port-label-"+this.props.label.length,
            x: this.props.x,
            y: this.props.y,
            children: this.props.label
        })*/

Port.propTypes = {
    name: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,
    type: React.PropTypes.oneOf(['in', 'out']).isRequired
};
