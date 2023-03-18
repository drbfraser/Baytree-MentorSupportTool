import { useMediaQuery } from '@mui/material'
import { MOBILE_BREAKPOINT } from '../constants/constants'

const useMobileLayout = (): boolean => {
  const useMobileLayout = useMediaQuery(`(max-width:${MOBILE_BREAKPOINT})`)
  return useMobileLayout
}

export default useMobileLayout
