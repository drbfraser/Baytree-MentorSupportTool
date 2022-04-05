import {
  BrowserRouter,
  Switch,
  Redirect,
  Route,
  useLocation,
  Router,
} from "react-router-dom";

import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import ResetPassword from "./Components/ResetPassword";
import { createMemoryHistory } from "history";
import { useEffect, useState } from "react";
import { verify } from "./api/auth";
import CreateAccount from "./Components/CreateAccount";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  const history = createMemoryHistory();
  return (
    <>
      <ToastContainer></ToastContainer>
      <Router history={history}>
        <BrowserRoute></BrowserRoute>
      </Router>
    </>
  );
}

const doesCurRouteRequireAuthentication = () => {
  const NON_AUTHENTICATED_ROUTES = ["/createaccount", "/resetpassword"];

  return !NON_AUTHENTICATED_ROUTES.includes(
    window.location.pathname.toLowerCase()
  );
};

const BrowserRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function verifyClient() {
      // verify only on authenticated routes
      if (doesCurRouteRequireAuthentication()) {
        if (await verify()) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setRedirectToLogin(true);
        }
      }
    }

    verifyClient();
  }, [location]);

  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Switch>
            <Route
              exact
              path="/createAccount"
              component={CreateAccount}
            ></Route>
            <Route exact path="/" component={Login} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/resetpassword" component={ResetPassword} />
            {isAuthenticated && (
              <>
                <Route path="/dashboard" component={Dashboard}></Route>
              </>
            )}
            {redirectToLogin && <Redirect to={{ pathname: "/login" }} />}
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
