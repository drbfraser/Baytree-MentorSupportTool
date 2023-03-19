import { TableCell, Button, Tooltip } from '@mui/material'
import { Dispatch, SetStateAction, FC } from 'react'
import { MdExpandLess, MdExpandMore } from 'react-icons/md'
import styled from 'styled-components'

interface ExpandButtonCellProps {
  backgroundColor: string;
  setIsRowExpanded: Dispatch<SetStateAction<boolean>>;
  isRowExpanded: boolean;
}

const ExpandButtonCell: FC<ExpandButtonCellProps> = (props) => {
  return (
    <TableCell sx={{ backgroundColor: props.backgroundColor }}>
      <ExpandButtonContainer color={props.backgroundColor}>
        <Tooltip title={props.isRowExpanded ? 'Less Info' : 'More Info'}>
          <Button
            color="inherit"
            variant="contained"
            onClick={() => props.setIsRowExpanded(!props.isRowExpanded)}
          >
            {props.isRowExpanded ? (
              <MdExpandLess size="24"></MdExpandLess>
            ) : (
              <MdExpandMore size="24"></MdExpandMore>
            )}
          </Button>
        </Tooltip>
      </ExpandButtonContainer>
    </TableCell>
  )
}

const ExpandButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export default ExpandButtonCell
