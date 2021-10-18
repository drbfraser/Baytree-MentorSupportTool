import { BrowserRouter, Switch} from 'react-router-dom';

import Login from './Components/Login';
import Dashboard from './Components/Dashboard';

import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <div className="content">
            <Switch>
              <PublicRoute exact path = '/' component = {Login} />
              <PublicRoute exact path = "/login" component = {Login} />
              <PrivateRoute path = "/dashboard" component = {Dashboard} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;