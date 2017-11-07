import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import GymListContainer from './GymListContainer';

ReactDOM.render(<GymListContainer pollInterval={process.env.REACT_APP_POLL_INTERVAL_MSECS} />, document.getElementById('root'));
registerServiceWorker();
