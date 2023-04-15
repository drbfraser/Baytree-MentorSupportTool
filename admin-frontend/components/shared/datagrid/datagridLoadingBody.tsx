import { Skeleton, TableCell, TableRow } from '@mui/material'
import { FC } from 'react'

interface DataGridLoadingBodyProps {
  numCols: number
  numLoadingRows?: number
}

const DataGridLoadingBody: FC<DataGridLoadingBodyProps> = (props) => {
  const DEFAULT_LOADING_ROWS = 5

  return (
    <>
      {Array.from(
        Array(props.numLoadingRows ?? DEFAULT_LOADING_ROWS).keys()
      ).map((idx) => (
        <TableRow key={idx}>
          <TableCell colSpan={props.numCols}>
            <Skeleton></Skeleton>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default DataGridLoadingBody
