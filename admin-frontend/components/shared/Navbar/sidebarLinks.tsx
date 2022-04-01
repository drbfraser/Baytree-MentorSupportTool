import { IconBaseProps } from "react-icons";
import { MdNotifications, MdHome, MdPerson } from "react-icons/md";
import { NavbarModalComponent } from "./navbar";

export interface SidebarLink {
  url?: string;
  title: string;
  icon: React.FC<IconBaseProps>;
  modalComponent?: NavbarModalComponent;
  modalWidth?: string;
  modalHeight?: string;
}

const sidebarLinks: SidebarLink[] = [
  { url: "/home", title: "Home", icon: MdHome },
  { url: "/mentors", title: "Mentors", icon: MdPerson },
  { url: "/notifications", title: "Notifications", icon: MdNotifications },
];

export default sidebarLinks;
