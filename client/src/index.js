import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import './styles/index.css';
import DataVisContainer from './containers/DataVisContainer';
import GymListContainer from './containers/GymListContainer';
/*
ReactDOM.render(<GymListContainer pollInterval={process.env.REACT_APP_POLL_INTERVAL_MSECS} />, document.getElementById('root'));
*/

const PrimaryLayout = () => (
  <div>
    <main>
    	<Switch>
      	<Route path = '/' exact component={DataVisContainer} />
      	<Route path = '/gyms' exact component={GymListContainer} />
      	<Redirect to = '/' />
      </Switch>
    </main>
  </div>
)

const App = () => (
  <BrowserRouter>
    <PrimaryLayout />
  </BrowserRouter>
)

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
