import { Route, Redirect} from 'react-router-dom';

export default async function PrivateRoute({...routeProps}) {
  if (routeProps.isAuthenticated) {
    return <Route {...routeProps} />;
  }
  else {
    return <Redirect to={{ pathname: '/login' }} />;
  }
};
