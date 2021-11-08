
import retrieveProfile from '../Utils/RetreiveProfile';
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