const Profile = () => {
    return (
      <div>
        <h3>{localStorage.getItem('firstname')} {localStorage.getItem('lastname')}</h3>
      </div>
    )
  };
  
  export default Profile;