import { hot } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './components';

ReactDOM.render(<App />, document.getElementById('root'));
export default hot(module)(App);
