import { ColumnDataTypes, ValueOption } from './datagridTypes'

export const shouldRenderSelectComponent = (
  isSelectCell: boolean,
  isColumnEditable: boolean
) => isSelectCell && isColumnEditable

export const isLoadingSelectOptions = (valueOptions?: ValueOption[]) =>
  !valueOptions

export const shouldRenderDateComponent = (
  dataType?: ColumnDataTypes,
  isDataGridSaveable?: boolean,
  isColumnEditable?: boolean
) => dataType === 'date' && isDataGridSaveable && isColumnEditable

export const shouldRenderBoolComponent = (dataType?: ColumnDataTypes) =>
  dataType === 'boolean'

export const shouldRenderTextInputComponent = (
  isDataGridSaveable?: boolean,
  isColumnEditable?: boolean
) => isDataGridSaveable && isColumnEditable
