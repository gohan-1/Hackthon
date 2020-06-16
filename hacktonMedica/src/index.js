import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import registerServiceWorker from './registerServiceWorker';
import {Provider} from "react-redux";
//import {Router, browserHistory} from "react-router";
import store from "./utils/store";
import Routes from "./routes";

ReactDOM.render(
    <Provider store={store}>
    <Routes/>
  </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
