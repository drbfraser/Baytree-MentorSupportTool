import { MdDelete, MdRestoreFromTrash } from 'react-icons/md'
import {
  DataRow,
  DataRowAction,
  DataGridColumn,
  setChangedDataRowFunc,
  setCreatedDataRowFunc,
  setDeletedDataRowFunc,
  InvalidCell
} from './datagridTypes'

export const changeDataRowValue = (
  newValue: any,
  dataField: string,
  dataRow?: DataRow,
  setCreatedDataRow?: setCreatedDataRowFunc,
  setChangedDataRow?: setChangedDataRowFunc,
  changedDataRow?: DataRow,
  createdDataRow?: DataRow
) => {
  if (createdDataRow) {
    createdDataRow = cloneDataRow(createdDataRow)
    ;(createdDataRow as DataRow)[dataField] = newValue
    ;(setCreatedDataRow as setCreatedDataRowFunc)(createdDataRow as DataRow)
  } else if (changedDataRow) {
    changedDataRow = cloneDataRow(changedDataRow)
    ;(changedDataRow as DataRow)[dataField] = newValue
    ;(setChangedDataRow as setChangedDataRowFunc)(changedDataRow as DataRow)
  } else {
    if ((dataRow as DataRow)[dataField] === newValue) {
      return
    }

    dataRow = cloneDataRow(dataRow)
    ;(dataRow as DataRow)[dataField] = newValue
    ;(setChangedDataRow as setChangedDataRowFunc)(dataRow as DataRow)
  }
}

export const cloneDataRow = (dataRow?: DataRow) => {
  return JSON.parse(JSON.stringify(dataRow))
}

// https://stackoverflow.com/a/52869830
export const isIsoDate = (str: string) => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false
  const d = new Date(str)
  return d.toISOString() === str
}

export const isCellChanged = (
  dataField: string,
  changedDataRow?: DataRow,
  originalDataRow?: DataRow,
  isCreatedDataRow?: boolean
) => {
  if (isCreatedDataRow) {
    return true
  } else if (originalDataRow && changedDataRow) {
    if (Array.isArray(originalDataRow[dataField])) {
      return !arraysEqual(originalDataRow[dataField], changedDataRow[dataField])
    } else {
      return originalDataRow[dataField] !== changedDataRow[dataField]
    }
  } else {
    return false
  }
}

// Doesn't work for nested arrays, objects, shallow equality is used
// Side effect: sorts the arrays
const arraysEqual = (a1: Array<any>, a2: Array<any>) => {
  if (a1 === a2) {
    return true
  } else if (a1.length === a2.length) {
    a1.sort()
    a2.sort()
    return a1.every((val, i) => val === a2[i])
  } else {
    return false
  }
}

export const getDataRowActions = (
  dataRowActions: DataRowAction[],
  isDataGridSaveable: boolean,
  isDataGridDeleteable: boolean,
  setDeletedDataRow: setDeletedDataRowFunc,
  isDeleted: boolean,
  createdDataRow?: DataRow
): DataRowAction[] =>
  isDataGridSaveable && isDataGridDeleteable
    ? [
        ...dataRowActions,
        {
          actionFunction: (dataRow) =>
            setDeletedDataRow(
              !isDeleted,
              dataRow ?? (createdDataRow as DataRow)
            ),
          icon: isDeleted ? (
            <MdRestoreFromTrash color="green"></MdRestoreFromTrash>
          ) : (
            <MdDelete color="red"></MdDelete>
          ),
          name: isDeleted ? 'Restore' : 'Delete'
        }
      ]
    : dataRowActions

export const shouldKeepColumnOnMobile = (
  col: DataGridColumn,
  cols: DataGridColumn[]
) => {
  return col.keepColumnOnMobile || cols.every((col) => !col.keepColumnOnMobile)
}

export const someExpandableColumnExists = (cols: DataGridColumn[]) =>
  cols.some((col) => col.expandableColumn)

export const checkCellInvalid = (
  primaryKeyDataField: string,
  invalidCells: InvalidCell[],
  col: DataGridColumn,
  dataRow?: DataRow,
  changedDataRow?: DataRow,
  createdDataRow?: DataRow
) => {
  return invalidCells.some(
    (invalidCell) =>
      invalidCell.primaryKey ===
        (dataRow
          ? dataRow[primaryKeyDataField]
          : changedDataRow
          ? changedDataRow[primaryKeyDataField]
          : createdDataRow) && invalidCell.dataField === col.dataField
  )
}
