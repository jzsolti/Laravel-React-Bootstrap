import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import 'bootstrap/dist/css/bootstrap.min.css';

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}