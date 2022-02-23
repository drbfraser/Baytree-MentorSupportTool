export default function retrieveProfile (): void {
    if (localStorage.getItem('firstname') === null){
        localStorage.setItem('firstname', "Team");
        localStorage.setItem('lastname', "Baytree");
        localStorage.setItem('id', "4");
    }
}