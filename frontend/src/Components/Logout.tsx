export default function Logout (): void {
    if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        window.location.replace('http://localhost:3000/login');
    }
}