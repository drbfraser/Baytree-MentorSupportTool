import { Typography, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import { useState } from 'react'
import { IconBaseProps } from 'react-icons'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { NAVBAR_Z_INDEX, SIDEBAR_WIDTH } from '../../../constants/constants'
import { RootState } from '../../../stores/store'
import Modal, { ModalComponent } from '../Modal'
import { NAVBAR_ICON_SIZE } from './navbar'
import { SidebarLink } from './sidebarLinks'
import { TopbarAction } from './topbarActions'

interface SidebarProps {
  links: SidebarLink[]
  topbarActions: TopbarAction[]
  useMobileLayout: boolean
  setSidebarActive: (active: boolean) => void
  Ref: React.MutableRefObject<any>
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const router = useRouter()

  return (
    <StyledSidebar ref={props.Ref}>
      {props.links.map((link, i) => (
        <SidebarItem
          key={`sidebar_item_${i}`}
          icon={link.icon}
          text={link.title}
          url={link.url}
          isSelected={link.url == router.pathname}
          setSidebarActive={props.setSidebarActive}
          useMobileLayout={props.useMobileLayout}
          modalComponent={link.modalComponent}
          modalHeight={link.modalHeight}
          modalWidth={link.modalWidth}
        ></SidebarItem>
      ))}
      {props.useMobileLayout &&
        props.topbarActions.map((actionButton, i) => {
          return (
            <SidebarItem
              key={`sidebar_action_item_${i}`}
              icon={actionButton.icon}
              iconColor={actionButton.iconColor}
              text={actionButton.title}
              setSidebarActive={props.setSidebarActive}
              useMobileLayout={props.useMobileLayout}
              modalComponent={actionButton.modalComponent}
              enableModalCloseButton={actionButton.enableModalCloseButton}
              modalHeight={actionButton.modalHeight}
              modalWidth={actionButton.modalWidth}
            ></SidebarItem>
          )
        })}
    </StyledSidebar>
  )
}

const StyledSidebar = styled.div`
  width: ${SIDEBAR_WIDTH};
  background: white;
  height: ${() => `calc(100vh - ${'5rem'})`};
  left: 0;
  top: ${() => '5rem'};
  position: fixed;
  box-shadow: 0 0.5rem 0.4rem 0.2rem lightgrey;
  z-index: ${NAVBAR_Z_INDEX};
`

interface SidebarItemProps {
  text: string
  icon: React.FC<IconBaseProps>
  iconColor?: string
  url?: string
  modalComponent?: ModalComponent
  enableModalCloseButton?: boolean
  modalWidth?: string
  modalHeight?: string
  setSidebarActive: (active: boolean) => void
  useMobileLayout: boolean
  isSelected?: boolean
}

const SidebarItem: React.FC<SidebarItemProps> = (props) => {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const theme = useTheme()
  const primaryColor = theme.palette.primary.main

  return (
    <>
      <StyledSidebarItem
        iconColor={props.iconColor ?? primaryColor}
        isSelected={props.isSelected}
        onClick={() => {
          if (props.useMobileLayout && !props.modalComponent) {
            props.setSidebarActive(true)
          }
          if (props.url) {
            router.push(props.url)
          } else {
            setShowModal(true)
          }
        }}
      >
        <SidebarItemIcon>
          {React.createElement(props.icon, {
            color: props.iconColor ?? primaryColor,
            size: NAVBAR_ICON_SIZE
          })}
        </SidebarItemIcon>
        <SidebarItemText>{props.text}</SidebarItemText>
      </StyledSidebarItem>
      {props.modalComponent && (
        <Modal
          isOpen={showModal}
          modalComponent={React.createElement(props.modalComponent, {
            onOutsideClick: () => {
              setShowModal(false)
            }
          })}
          onOutsideClick={() => {
            setShowModal(false)
          }}
          enableCloseButton={props.enableModalCloseButton}
        ></Modal>
      )}
    </>
  )
}

const StyledSidebarItem = styled.div<{
  isSelected?: boolean
  iconColor: string | undefined
}>`
  display: flex;
  justify-content: left;
  width: 100%;
  height: 4rem;
  background: ${(props) => (props.isSelected ? `${props.iconColor}30` : '')};
  @media (hover: hover) {
    :hover {
      text-decoration: underline;
      cursor: pointer;
      background: ${(props) => `${props.iconColor}30`};
      user-select: none;
    }
  }
`

const SidebarItemIcon = styled.div`
  margin: auto 0 auto 2rem;
`

const SidebarItemText = styled(Typography)`
  margin: auto 0 auto 2rem;
`

export default Sidebar
