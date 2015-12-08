import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import {Graph} from 'components/graph';

import graphData from 'photobooth.json.js';
graphData.connections = graphData.connections.filter(c => 'src' in c);

let store = createStore((state = {...graphData, selections: [], inputs: {}}, action) => {
    switch(action.type){
        case 'ADD_CONNECTION':
            return {
                ...state,
                connections: [...state.connections, {
                    src: {process: action.srcProcess, port: action.srcPort},
                    tgt: {process: action.tgtProcess, port: action.tgtPort}
                }]
            };
        case 'ADD_ELEMENT':
            return {
                ...state,
                processes: {
                    ...state.processes,
                    [action.name + (Date.now() % 1e9).toString(36)]: {
                        component: action.name,
                        metadata: {
                            label: action.name,
                            x: 50,
                            y: 100
                        }
                    }
                }
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
        case 'SELECTION':
            let data = {kind: action.kind, process: action.process, port: action.port, connection: action.connection};
            let selections = action.kind === 'HIGHLIGHT_PORT' ?
                state.selections.filter(s => s.kind !== 'HIGHLIGHT_PORT') :
                action.add ? state.selections : [];

            return {
                ...state,
                selections: [...selections, data]
            };
        case 'DESELECT':
            selections = state.selections;
            switch(action.kind){
                case 'HIGHLIGHT_PORT':
                    selections = selections.filter(s => s.kind !== 'HIGHLIGHT_PORT');
                    break;
                case 'ALL':
                    selections = [];
                    break;
                default:
                    throw new Error('unsupported deselect');
            }

            return {
                ...state,
                selections: selections
            };
        case 'REMOVE_SELECTED':
            let selectionsByType = state.selections.reduce((o, s) => {
                if(!(s.kind in o)) o[s.kind] = [];
                o[s.kind].push(s);
                return o;
            }, {});

            let {processes, connections} = state;
            if('NODE' in selectionsByType){
                let keys = Object.keys(processes).filter(p => selectionsByType.NODE.every(n => n.process !== p));

                processes = keys.reduce((o, proc) => {
                    o[proc] = processes[proc];
                    return o;
                }, {});

                //remove edges
                connections = connections.filter(
                    c => selectionsByType.NODE.every(n => n.process !== c.src.process && n.process !== c.tgt.process)
                );
            }

            if('EDGE' in selectionsByType){
                connections = connections.filter(c => selectionsByType.EDGE.every(e => e.connection !== c));
            }

            return {
                ...state, processes, connections,
                selections: 'HIGHLIGHT_PORT' in selectionsByType ? selectionsByType.HIGHLIGHT_PORT : [],
            };
        case 'INPUT_CHANGE':
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.process]: {
                        ...(action.process in state.inputs ? state.inputs[action.process] : {}),
                        [action.name]: action.value
                    }
                }
            };
        default:
            return state;
    }
});

let ConnectedGraph = connect(s=>({...s}))(Graph);

render(
    <div>
        <Provider store={store}>
            <ConnectedGraph getState={store.getState.bind(store)}/>
        </Provider>
        <div style={{position: 'absolute', top: '1.5em', left: '1.5em', padding: '.7em', backgroundColor: 'hsla(0, 50%, 50%, .5)'}}>{
            Object.keys(store.getState().components).map(c =>
                <input type="button" value={c} key={c} onClick={e => {
                    e.preventDefault();
                    store.dispatch({type: 'ADD_ELEMENT', name: c});
                }}/>
            )
        } | <input type="button" value="Get JAR" onClick={() => window.alert('Not implemented')}/></div>
    </div>,
    document.getElementById('root')
);

//TODO move this to a better place
window.addEventListener('keydown', (e) => {
    if(e.keyCode === 8 && e.shiftKey && store.getState().selections.length > 0){
        e.preventDefault();

        store.dispatch({type: 'REMOVE_SELECTED'});
    }
});
