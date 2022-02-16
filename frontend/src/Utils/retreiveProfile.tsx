export default function retrieveProfile (): void {
    if (localStorage.getItem('firstname') === null){
        localStorage.setItem('firstname', "Team");
        localStorage.setItem('lastname', "Baytree");
        localStorage.setItem('id', "4");
        // fetch('http://localhost:8000/api/verify/', {
        //         method: 'GET',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': 'Bearer ' + localStorage.getItem('token'),
        //         },
        // })
        // .then(response => response.json())
        // .then(data => {
        //     localStorage.setItem('firstname', data.first_name);
        //     localStorage.setItem('lastname', data.last_name);
        //     localStorage.setItem('id', data.id);
        // });
    }
}