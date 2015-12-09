module.exports = {
    groups: [],
    processes: {
        readCSV_init: {
            component: 'readCSV',
            metadata: {
                x: 50,
                y: 250,
                label: 'Read CSV'
            }
        }
    },
    connections: [],
    components: {
        readCSV: {
            label: 'Read CSV file',
            inPorts: [],
            outPorts: ['out'],
            formData: {
                filePath: {
                    type: 'text',
                    placeholder: '/path/to.csv',
                    label: 'Input file path '
                },
                inputs: {
                    type: 'enum',
                    values: ['text']
                }
            }
        },
        readFile: {
            inPorts: [],
            outPorts: ['out']
        },
        splitLines: {
            inPorts: ['in'],
            outPorts: ['out']
        },
        'groupBy(0)': {
            inPorts: ['in'],
            outPorts: ['out'],
            /*
            formData: {
                tupleIndex: {
                    'default': 0,
                    label: 'Tuple index'
                }
            }
            */
        },
        'sum(1)': {
            inPorts: ['in'],
            outPorts: ['out'],
            /*
            formData: {
                tupleIndex: {
                    'default': 0,
                    label: 'Tuple index'
                }
            }
            */
        },
        writeFile: {
            inPorts: ['in'],
            outPorts: []
        }
    }
};
