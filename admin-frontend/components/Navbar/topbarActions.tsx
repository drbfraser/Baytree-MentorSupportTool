import { IconBaseProps } from "react-icons";
import { MdLogout } from "react-icons/md";
import { ModalComponent } from "../Modal";
import LogoutModal from "./logoutModal";

export interface TopbarAction {
  icon: React.FC<IconBaseProps>;
  title: string;
  iconColor?: string;
  modalComponent: ModalComponent;
  modalWidth?: string;
  modalHeight?: string;
}

const topbarActions: TopbarAction[] = [
  {
    icon: MdLogout,
    title: "Log out",
    modalComponent: LogoutModal,
    modalHeight: "auto",
    iconColor: "#ff0000",
  },
];

export default topbarActions;
