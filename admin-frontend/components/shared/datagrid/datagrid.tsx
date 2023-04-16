import { FC } from 'react'
import { Table } from '@mui/material'
import DataGridBody from './datagridBody'
import DataGridHeaderRow from './datagridHeaderRow'
import Pager from '../pager'
import DataGridSearchBar from './datagridSearchBar'
import {
  DataRow,
  DataGridColumn,
  onLoadDataRowsFunc,
  onLoadPagedDataRowsFunc,
  onSaveDataRowsFunc,
  DataRowAction
} from './datagridTypes'
import useLoading from './hooks/useLoading'
import useData from './hooks/useData'
import useSearch from './hooks/useSearch'
import usePagination from './hooks/usePagination'

export interface DataGridProps {
  onLoadDataRows?: onLoadDataRowsFunc | onLoadPagedDataRowsFunc
  onSaveDataRows?: onSaveDataRowsFunc<any>
  disableDataRowCreation?: boolean
  cols: DataGridColumn[]
  primaryKeyDataField?: string // default primary key is "id"
  pageSize?: number
  dataRowActions?: DataRowAction[]
  isDataGridDeleteable?: boolean
  data?: DataRow[]
}

const DataGrid: FC<DataGridProps> = (props) => {
  const {
    isLoadingDataRows,
    setIsLoadingDataRows,
    isLoadingColValueOptions,
    setIsLoadingColValueOptions,
    isSavingDataRows,
    setIsSavingDataRows
  } = useLoading()

  const {
    currentPage,
    setCurrentPage,
    maxPageNumber,
    setMaxPageNumber,
    clearPagerFuncRef
  } = usePagination()

  const { isSearchingRef, searchText, setSearchText } = useSearch()

  const {
    dataRows,
    createdDataRows,
    deletedDataRows,
    cols,
    onLoadDataRows,
    saveDataRows,
    primaryKeyDataFieldRef,
    isDataGridCurrentlyAbleToSave,
    removeCreatedDataRow,
    getOriginalDataRow,
    getChangedDataRow,
    isDataRowDeleted,
    setChangedDataRow,
    setDeletedDataRow,
    setCreatedDataRow,
    createDataRow,
    isAnyColumnSearchable,
    invalidCells
  } = useData(
    props.cols,
    currentPage,
    searchText,
    isSearchingRef,
    clearPagerFuncRef,
    setIsLoadingDataRows,
    setCurrentPage,
    setMaxPageNumber,
    setIsLoadingColValueOptions,
    setIsSavingDataRows,
    isLoadingDataRows,
    isLoadingColValueOptions,
    isSavingDataRows,
    props.onSaveDataRows,
    props.primaryKeyDataField,
    props.onLoadDataRows,
    props.data,
    props.pageSize
  )

  return (
    <>
      {isAnyColumnSearchable && (
        <DataGridSearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          isSearchingRef={isSearchingRef}
          cols={cols}
        ></DataGridSearchBar>
      )}
      <Table
        sx={{
          tableLayout: 'fixed'
        }}
      >
        <DataGridHeaderRow
          cols={cols}
          onSaveButtonClick={() => {
            if (saveDataRows) {
              saveDataRows()
            }
          }}
          isDataGridSaveable={!!props.onSaveDataRows}
          enableSaveButton={isDataGridCurrentlyAbleToSave}
          hasDataRowActions={!!props.dataRowActions}
        ></DataGridHeaderRow>
        <DataGridBody
          isLoadingDataRows={isLoadingDataRows || isSavingDataRows}
          dataRows={dataRows}
          createdDataRows={createdDataRows}
          deletedDataRows={deletedDataRows}
          removeCreatedDataRow={removeCreatedDataRow}
          getOriginalDataRow={getOriginalDataRow}
          getChangedDataRow={getChangedDataRow}
          isDataRowDeleted={isDataRowDeleted}
          setChangedDataRow={setChangedDataRow}
          setCreatedDataRow={setCreatedDataRow}
          setDeletedDataRow={setDeletedDataRow}
          onLoadDataRows={onLoadDataRows}
          onSaveDataRows={props.onSaveDataRows}
          cols={cols}
          primaryKeyDataField={primaryKeyDataFieldRef.current}
          dataRowActions={props.dataRowActions}
          isDataGridDeleteable={props.isDataGridDeleteable ?? true}
          pageSize={props.pageSize}
          createDataRow={createDataRow}
          invalidCells={invalidCells}
          disableDataRowCreation={props.disableDataRowCreation}
        ></DataGridBody>
      </Table>
      {props.pageSize && (
        <Pager
          clearPagerFuncRef={clearPagerFuncRef}
          currentPageNumber={currentPage}
          maxPageNumber={maxPageNumber}
          onChangePage={(pageNumber) => setCurrentPage(pageNumber)}
        ></Pager>
      )}
    </>
  )
}

export default DataGrid
