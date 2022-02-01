import { IconBaseProps } from "react-icons";
import { MdHome, MdNotifications, MdPerson } from "react-icons/md";

export type IconType = "home" | "mentor" | "notifications";

export type IconProps = IconBaseProps & {icon: IconType}

const Icon: React.FC<IconProps> = (props) => {
    switch (props.icon) {
        case "home":
            return <MdHome {...props} ></MdHome>
        case "mentor":
            return <MdPerson {...props}></MdPerson>
        case "notifications":
            return <MdNotifications {...props}></MdNotifications>
    }
};

export default Icon