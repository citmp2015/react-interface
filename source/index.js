import React from 'react';
import {render} from 'react-dom';
import {Graph} from 'components/graph';

render(
  <Graph {...require('./photobooth.json.js')}></Graph>,
  document.getElementById('root')
);
