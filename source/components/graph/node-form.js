import React from 'react';

export class NodeForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {inputs: [''], filePath: ''};
    }
    //TODO this currently works statically
    render(){
        let inputs = this.state.inputs;
        return <form onMouseDown={e=>e.stopPropagation()}>
            <label>File path:
                <input type="text" value={this.state.filePath} placeholder="File path"
                    onChange={e => {
                        this.props.dispatch({type: 'INPUT_CHANGE', process: this.props.process, name: 'filePath', value: e.target.value});
                        this.setState({filePath: e.target.value});
                    }}/>
            </label>
            {inputs.map((val, i) =>
                /*
                <label key={i}>Type {i}<input type="text" value={inputs[i]} placeholder="Type" onChange={
                    e => {
                        //TODO allow when ctrl or cmd is pressed

                        let newState = [...inputs.slice(0, i), e.target.value, ...inputs.slice(i + 1)];

                        if(inputs.length - 1 === i){
                            newState.push('');
                            setTimeout(this.props.updateDimensions, 30);
                        }

                        this.setState({inputs: newState});
                        this.props.dispatch({type: 'INPUT_CHANGE', process: this.props.process, name: 'types', value: newState});
                    }
                }/></label>
                */
                <label key={i}>Type {i}<select selectedIndex={inputs[i]} placeholder="Type" onChange={
                    e => {
                        //TODO allow when ctrl or cmd is pressed

                        let newState = [...inputs.slice(0, i), e.target.selectedIndex, ...inputs.slice(i + 1)];

                        if(inputs.length - 1 === i){
                            newState.push(0);
                            setTimeout(this.props.updateDimensions, 30);
                        }

                        this.setState({inputs: newState});
                        this.props.dispatch({type: 'INPUT_CHANGE', process: this.props.process, name: 'types', value: newState});
                    }
                }>
                    <option>None</option>
                    <option>String</option>
                    <option>Byte</option>
                    <option>Integer</option>
                    <option>Long</option>
                    <option>BigInteger</option>
                    <option>Float</option>
                    <option>Double</option>
                    <option>BigDecimal</option>
                    </select>{<br/>}
                </label>
            )}
        </form>;
    }
}
