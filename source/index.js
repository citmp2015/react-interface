import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import {Graph} from 'components/graph';

let store = createStore((state = require('./photobooth.json.js'), action) => {
    switch(action.type){
        case 'ADD_CONNECTION':
            return {
                ...state,
                connections: [...state.connections, {
                    src: {process: action.srcProcess, port: action.srcPort},
                    tgt: {process: action.tgtProcess, port: action.tgtPort}
                }]
            };
        case 'MOVE_ELEMENT':
            return {
                ...state,
                processes: {
                    ...state.processes,
                    [action.name]: {
                        ...state.processes[action.name],
                        metadata: {...state.processes[action.name].metadata, x: action.x, y: action.y}
                    }
                }
            };
        default:
            return state;
    }
});

let ConnectedGraph = connect(s=>({...s}))(Graph);

render(
    <Provider store={store}>
        <ConnectedGraph/>
    </Provider>,
    document.getElementById('root')
);
