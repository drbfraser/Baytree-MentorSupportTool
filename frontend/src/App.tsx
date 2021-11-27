import { BrowserRouter, Switch} from 'react-router-dom';

import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import ResetPassword from './Components/ResetPassword';

import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
            <Switch>
              <PublicRoute exact path = '/' component = {Login} />
              <PublicRoute exact path = "/login" component = {Login} />
              <PublicRoute exact path = "/resetpassword" component = {ResetPassword}/>
              <PrivateRoute path = "/dashboard" component = {Dashboard} />
            </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;