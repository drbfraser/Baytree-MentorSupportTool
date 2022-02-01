import { MdNotifications, MdHome, MdPerson } from "react-icons/md";

export interface SidebarLink {
  url: string;
  title: string;
  icon: React.ReactElement;
}

const sidebarLinks: SidebarLink[] = [
  { url: "/home", title: "Home", icon: <MdHome /> },
  { url: "/mentors", title: "Mentors", icon: <MdPerson /> },
  { url: "/notifications", title: "Notifications", icon: <MdNotifications /> },
];

export default sidebarLinks;
