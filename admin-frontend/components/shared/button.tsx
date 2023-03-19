import { Button as MatButton } from '@mui/material'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { ThemeState } from '../../reducers/theme'
import { RootState } from '../../stores/store'

interface ButtonWrapperProps {
  backgroundColor?: string;
  width?: string;
  height?: string;
  hoverColor?: string;
}

const Button: React.FC<
  React.ComponentProps<typeof MatButton> & ButtonWrapperProps
> = (props) => {
  const theme = useSelector<RootState, ThemeState>((state) => state.theme)

  return (
    <StyledButtonWrapper
      {...props}
      backgroundColor={props.backgroundColor ?? theme.colors.primaryColor}
      hoverColor={props.hoverColor ?? theme.colors.secondaryColor}
    ></StyledButtonWrapper>
  )
}

interface StyledButtonWrapperProps {
  backgroundColor: string;
  hoverColor: string;
}

const StyledButtonWrapper = styled(MatButton)<
  ButtonWrapperProps &
    React.ComponentProps<typeof MatButton> &
    StyledButtonWrapperProps
>`
  background-color: ${(props) => props.backgroundColor};
  width: ${(props) => props.width ?? ''};
  height: ${(props) => props.height ?? ''};
  @media (hover: hover) {
    :hover {
      cursor: pointer;
      background: ${(props) => `${props.hoverColor}`};
    }
  }

  margin-bottom: 0 !important;
`

export default Button
