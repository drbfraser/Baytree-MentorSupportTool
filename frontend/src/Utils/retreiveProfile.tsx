export default function retrieveProfile (): void {
    if (localStorage.getItem('firstname') === null){
        fetch('http://localhost:8000/rest-auth/user/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem('token'),
                },
        })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('firstname', data.first_name);
            localStorage.setItem('lastname', data.last_name);
            localStorage.setItem('id', data.id);
        });
    }
}