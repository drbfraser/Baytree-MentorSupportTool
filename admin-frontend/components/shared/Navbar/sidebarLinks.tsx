import { IconBaseProps } from 'react-icons'
import {
  MdNotifications,
  MdHome,
  MdPerson,
  MdAutoGraph,
  MdSupervisorAccount,
  MdEditCalendar,
  MdLocationOn,
  MdSettings
} from 'react-icons/md'
import { NavbarModalComponent } from './navbar'

export interface SidebarLink {
  url?: string
  title: string
  icon: React.FC<IconBaseProps>
  modalComponent?: NavbarModalComponent
  enableModalCloseButton?: boolean
  modalWidth?: string
  modalHeight?: string
}

const sidebarLinks: SidebarLink[] = [
  { url: '/home', title: 'Home', icon: MdHome },
  { url: '/mentors', title: 'Mentors', icon: MdPerson },
  { url: '/notifications', title: 'Notifications', icon: MdNotifications },
  { url: '/goals', title: 'Goals', icon: MdAutoGraph },
  { url: '/mentorRoles', title: 'Settings', icon: MdSupervisorAccount },
  { url: '/venues', title: 'Venues', icon: MdLocationOn },
  { url: '/calendarEvents', title: 'Calendar', icon: MdEditCalendar },
  { url: '/preferences', title: 'Preferences', icon: MdSettings }
]

export default sidebarLinks
