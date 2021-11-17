
import retrieveProfile from '../Utils/retreiveProfile';
import Navigation from './Navigation';

const Dashboard = () => {

  retrieveProfile();

  return (
    <div>
      <Navigation />
    </div>
  )
};

export default Dashboard;