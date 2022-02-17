import React from 'react';

/* Plugin */
import { HashRouter, Route, Switch } from "react-router-dom"


/* Store */

/* Helper */
import PrivateRoute from './helper/PrivateRoute'

/* Component */
import JasOauth2Callback from './component/JasOauth2Callback'

/* Page */
import LoginPage from './page/LoginPage'
import MainPage from './page/MainPage'
import PageNotFoundPage from './page/PageNotFoundPage'

import './style/theme.less'
import './App.css'
import 'sweetalert2/src/sweetalert2.scss'

function App() {
  return (
      <HashRouter>
        <div className="App">
          <Switch>
            <Route path="/login" component={LoginPage}/>
            <Route exact path="/:access_token(access_token=.*)" component={JasOauth2Callback} />
            <PrivateRoute exact path="/" component={MainPage} />
            <Route  component={PageNotFoundPage} />
          </Switch>
        </div>
      </HashRouter>
  );
}

export default App;
