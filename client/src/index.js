import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './styles/index.css';
import RaidScatterplotContainer from './containers/RaidScatterplotContainer';

ReactDOM.render(<RaidScatterplotContainer pollInterval={900000} />, document.getElementById('root'));
/*
ReactDOM.render(<GymListContainer pollInterval={process.env.REACT_APP_POLL_INTERVAL_MSECS} />, document.getElementById('root'));
*/
registerServiceWorker();
