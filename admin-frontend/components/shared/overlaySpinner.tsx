import { Backdrop, CircularProgress } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../../stores/store'

interface OverlaySpinnerProps {
  active: boolean
  onClick?: () => void
  coverRelativeParentComponent?: boolean
}

const OverlaySpinner: React.FC<OverlaySpinnerProps> = (props) => {
  const primaryColor = useSelector<RootState, string>(
    (state) => state.theme.colors.primaryColor
  )

  return (
    <Backdrop
      style={{
        color: primaryColor,
        fontSize: '12rem',
        position: props.coverRelativeParentComponent ? 'absolute' : 'fixed'
      }}
      open={props.active}
      onClick={props.onClick}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}

export default OverlaySpinner
