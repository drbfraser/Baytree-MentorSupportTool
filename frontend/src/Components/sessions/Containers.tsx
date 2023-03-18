import { Grid, Typography, FormControl } from '@mui/material'
import PropTypes from 'prop-types'

const inputContainerPropTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

// Reponsive container for time
export const TimeInputContainer: React.FC<InputContainerProps> = (props) => {
  return (
    <Grid container item xs={12} sm={4} alignItems="center">
      <Grid item xs={5} sm={12}>
        <Typography sx={{ fontWeight: 'bold' }} color="text.secondary">
          {props.label}
        </Typography>
      </Grid>
      <Grid item xs={7} sm={12}>
        <FormControl fullWidth>{props.children}</FormControl>
      </Grid>
    </Grid>
  )
}

type InputContainerProps = {
  label: string,
  children: React.ReactNode
}

// Reponsive container for select
export const SelectInputContainer: React.FC<InputContainerProps> = (props) => {
  return (
    <Grid container item xs={12} sm={4} alignItems="center">
      <Grid item xs={5} sm={12}>
        <Typography sx={{ fontWeight: 'bold' }} color="text.secondary">
          {props.label}
        </Typography>
      </Grid>
      <Grid item xs={7} sm={12}>
        <FormControl fullWidth>{props.children}</FormControl>
      </Grid>
    </Grid>
  )
}

SelectInputContainer.propTypes =  inputContainerPropTypes
TimeInputContainer.propTypes = inputContainerPropTypes
