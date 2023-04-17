import { IconBaseProps } from 'react-icons'
import { MdLogout } from 'react-icons/md'
import LogoutModal from './logoutModal'
import { NavbarModalComponent } from './navbar'

export interface TopbarAction {
  icon: React.FC<IconBaseProps>
  title: string
  iconColor?: string
  modalComponent: NavbarModalComponent
  enableModalCloseButton?: boolean
  modalWidth?: string
  modalHeight?: string
}

const topbarActions: TopbarAction[] = [
  {
    icon: MdLogout,
    title: 'Log out',
    modalComponent: LogoutModal,
    enableModalCloseButton: false,
    modalHeight: 'auto',
    iconColor: '#ff0000'
  }
]

export default topbarActions
