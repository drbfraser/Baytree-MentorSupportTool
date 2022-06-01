import { FC } from "react";
import { Table } from "@mui/material";
import DataGridBody from "./datagridBody";
import DataGridHeaderRow from "./datagridHeaderRow";
import Pager from "../pager";
import DataGridSearchBar from "./datagridSearchBar";
import useMobileLayout from "../../../hooks/useMobileLayout";
import { someExpandableColumnExists } from "./datagridRowLogic";
import {
  DataRow,
  DataGridColumn,
  onLoadDataRowsFunc,
  onLoadPagedDataRowsFunc,
  onSaveDataRowsFunc,
  DataRowAction,
} from "./datagridTypes";
import DataGridAddRow from "./datagridAddRow";
import useLoading from "./hooks/useLoading";
import useData from "./hooks/useData";
import useSearch from "./hooks/useSearch";
import usePagination from "./hooks/usePagination";

export interface DataGridProps {
  onLoadDataRows?: onLoadDataRowsFunc | onLoadPagedDataRowsFunc;
  onSaveDataRows?: onSaveDataRowsFunc;
  disableDataRowCreation?: boolean;
  cols: DataGridColumn[];
  primaryKeyDataField?: string; // default primary key is "id"
  pageSize?: number;
  dataRowActions?: DataRowAction[];
  isDataGridDeleteable?: boolean;
  data?: DataRow[];
}

const DataGrid: FC<DataGridProps> = (props) => {
  const {
    isLoadingDataRows,
    setIsLoadingDataRows,
    isLoadingColValueOptions,
    setIsLoadingColValueOptions,
    isSavingDataRows,
    setIsSavingDataRows,
  } = useLoading();

  const {
    currentPage,
    setCurrentPage,
    maxPageNumber,
    setMaxPageNumber,
    clearPagerFuncRef,
  } = usePagination();

  const { isSearchingRef, searchText, setSearchText } = useSearch();

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
  );

  const isOnMobileDevice = useMobileLayout();

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
          tableLayout:
            isOnMobileDevice || someExpandableColumnExists(cols)
              ? "fixed"
              : "auto",
        }}
      >
        <DataGridHeaderRow
          cols={cols}
          onSaveButtonClick={() => {
            if (saveDataRows) {
              saveDataRows();
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
        ></DataGridBody>
        {props.onSaveDataRows && !props.disableDataRowCreation && (
          <DataGridAddRow
            numColumns={cols.length}
            onAddRow={createDataRow}
            enableAddButton={
              !isLoadingDataRows &&
              !isLoadingColValueOptions &&
              !isSavingDataRows
            }
          ></DataGridAddRow>
        )}
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
  );
};

export default DataGrid;
