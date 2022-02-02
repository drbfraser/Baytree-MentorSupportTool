import { IconBaseProps } from "react-icons";
import { MdHome, MdLogout, MdNotifications, MdPerson } from "react-icons/md";

export type IconType = "home" | "mentor" | "notifications" | "logout";

export type IconProps = IconBaseProps & { icon: IconType };

const Icon: React.FC<IconProps> = (props) => {
  switch (props.icon) {
    case "home":
      return <MdHome {...props}></MdHome>;
    case "mentor":
      return <MdPerson {...props}></MdPerson>;
    case "notifications":
      return <MdNotifications {...props}></MdNotifications>;
    case "logout":
      return <MdLogout {...props}></MdLogout>;
  }
};

export default Icon;
