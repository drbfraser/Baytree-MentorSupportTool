import { logout } from "../api/auth";

export default async function Logout() {
  if (await logout()) {
    window.location.replace("/login");
  }
}
