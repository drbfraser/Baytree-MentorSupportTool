import { IconBaseProps } from "react-icons";
import {
  MdNotifications,
  MdHome,
  MdPerson,
  MdAutoGraph,
  MdSupervisorAccount,
} from "react-icons/md";
import { NavbarModalComponent } from "./navbar";

export interface SidebarLink {
  url?: string;
  title: string;
  icon: React.FC<IconBaseProps>;
  modalComponent?: NavbarModalComponent;
  enableModalCloseButton?: boolean;
  modalWidth?: string;
  modalHeight?: string;
}

const sidebarLinks: SidebarLink[] = [
  { url: "/home", title: "Home", icon: MdHome },
  { url: "/mentors", title: "Mentors", icon: MdPerson },
  { url: "/notifications", title: "Notifications", icon: MdNotifications },
  { url: "/goals", title: "Goals", icon: MdAutoGraph },
  { url: "/mentorRoles", title: "Mentor Roles", icon: MdSupervisorAccount },
];

export default sidebarLinks;
