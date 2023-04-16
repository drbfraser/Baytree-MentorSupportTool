import { TableRow, TableCell, Button, Tooltip } from '@mui/material'
import { FC } from 'react'
import { MdAdd } from 'react-icons/md'
import styled from 'styled-components'

interface DataGridAddRowProps {
  numColumns: number
  onAddRow: () => void
  enableAddButton: boolean
}

const DataGridAddRow: FC<DataGridAddRowProps> = (props) => {
  return (
    <TableRow>
      <TableCell colSpan={props.numColumns + 1}>
        <AddButtonContainer>
          <Tooltip title="Add Row">
            <span>
              <Button
                color="primary"
                variant="contained"
                disabled={!props.enableAddButton}
                onClick={props.onAddRow}
              >
                <MdAdd size="24" />
              </Button>
            </span>
          </Tooltip>
        </AddButtonContainer>
      </TableCell>
    </TableRow>
  )
}

const AddButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`

export default DataGridAddRow
