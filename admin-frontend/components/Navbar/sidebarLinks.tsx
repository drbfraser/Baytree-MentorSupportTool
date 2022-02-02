import { MdNotifications, MdHome, MdPerson } from "react-icons/md";
import { IconType } from "../icons";

export interface SidebarLink {
  url: string;
  title: string;
  icon: IconType;
}

const sidebarLinks: SidebarLink[] = [
  { url: "/home", title: "Home", icon: "home" },
  { url: "/mentors", title: "Mentors", icon: "mentor" },
  { url: "/notifications", title: "Notifications", icon: "notifications" },
];

export default sidebarLinks;
