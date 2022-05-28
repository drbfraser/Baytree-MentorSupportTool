import { FC, useEffect, useRef, useState } from "react";
import { Table, TableRow, TableCell, Button } from "@mui/material";
import DataGridBody from "./datagridBody";
import {
  createDataRow,
  getChangedDataRow,
  getOriginalDataRow,
  isAnyColumnSearchable,
  isDataRowDeleted,
  loadColumnValueOptions,
  loadDataRows,
  removeCreatedDataRow,
  saveDataRows,
  setChangedDataRow,
  setCreatedDataRow,
  setDeletedDataRow,
} from "./datagridLogic";
import { MdAdd } from "react-icons/md";
import DataGridHeaderRow from "./datagridHeaderRow";
import styled from "styled-components";
import Pager from "../pager";
import DataGridSearchBar from "./datagridSearchBar";

const DataGrid: FC<DataGridProps> = (props) => {
  const [isLoadingDataRows, setIsLoadingDataRows] = useState(false);
  const [isLoadingColValueOptions, setIsLoadingColValueOptions] =
    useState(false);
  const [isSavingDataRows, setIsSavingDataRows] = useState(false);
  const [dataRows, setDataRows] = useState<DataRow[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [maxPageNumber, setMaxPageNumber] = useState(0);

  const isSearchingRef = useRef(false);
  const [searchText, setSearchText] = useState("");

  const [cols, setCols] = useState<DataGridColumn[]>(props.cols);
  const originalDataRowsRef = useRef<DataRow[]>([]);
  const [changedDataRows, setChangedDataRows] = useState<DataRow[]>([]);
  const [createdDataRows, setCreatedDataRows] = useState<DataRow[]>([]);
  const [deletedDataRows, setDeletedDataRows] = useState<DataRow[]>([]);
  const createRowNextIdRef = useRef(0);
  const primaryKeyDataFieldRef = useRef(props.primaryKeyDataField ?? "id");
  const TOAST_ERROR_MESSAGE =
    "Failed to save data. Please ensure that you have a stable internet connection and refresh the page. Otherwise, contact your administrator.";

  useEffect(() => {
    getData();
  }, [currentPage, searchText]);

  useEffect(
    () => loadColumnValueOptions(cols, setCols, setIsLoadingColValueOptions),
    [props.cols]
  );

  const getData = async () => {
    // Is paginated
    if (props.pageSize) {
      await loadDataRows(
        props.onLoadDataRows,
        setDataRows,
        setIsLoadingDataRows,
        searchText,
        isSearchingRef,
        cols,
        {
          pagination: {
            pageSize: props.pageSize,
            currentPageNum: currentPage,
            setCurrentPageNum: setCurrentPage,
            setMaxPageNum: setMaxPageNumber,
          },
        }
      );
    } else {
      await loadDataRows(
        props.onLoadDataRows,
        setDataRows,
        setIsLoadingDataRows,
        searchText,
        isSearchingRef,
        cols
      );
    }
  };

  return (
    <>
      {isAnyColumnSearchable(cols) && (
        <DataGridSearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          isSearchingRef={isSearchingRef}
          cols={cols}
        ></DataGridSearchBar>
      )}
      <Table>
        <DataGridHeaderRow
          cols={cols}
          onSaveButtonClick={() => {
            if (props.onSaveDataRows) {
              saveDataRows(
                props.onSaveDataRows,
                createdDataRows,
                changedDataRows,
                deletedDataRows,
                primaryKeyDataFieldRef.current,
                getData,
                setCreatedDataRows,
                setChangedDataRows,
                setDeletedDataRows,
                setIsSavingDataRows,
                originalDataRowsRef,
                TOAST_ERROR_MESSAGE
              );
            }
          }}
          isDataGridSaveable={!!props.onSaveDataRows}
          enableSaveButton={
            (changedDataRows.length > 0 ||
              createdDataRows.length > 0 ||
              deletedDataRows.length > 0) &&
            !isLoadingDataRows &&
            !isLoadingColValueOptions &&
            !isSavingDataRows
          }
        ></DataGridHeaderRow>
        <DataGridBody
          isLoadingDataRows={isLoadingDataRows || isSavingDataRows}
          dataRows={dataRows}
          createdDataRows={createdDataRows}
          deletedDataRows={deletedDataRows}
          removeCreatedDataRow={(createdDataRow) =>
            removeCreatedDataRow(
              createdDataRow,
              createdDataRows,
              primaryKeyDataFieldRef.current,
              setCreatedDataRows
            )
          }
          getOriginalDataRow={(dataRow) =>
            getOriginalDataRow(
              dataRow,
              originalDataRowsRef.current,
              primaryKeyDataFieldRef.current
            )
          }
          getChangedDataRow={(dataRow) =>
            getChangedDataRow(
              dataRow,
              changedDataRows,
              primaryKeyDataFieldRef.current
            )
          }
          isDataRowDeleted={(dataRow) =>
            isDataRowDeleted(
              dataRow,
              deletedDataRows,
              primaryKeyDataFieldRef.current
            )
          }
          setChangedDataRow={(changedDataRow) =>
            setChangedDataRow(
              dataRows,
              changedDataRow,
              originalDataRowsRef,
              changedDataRows,
              setChangedDataRows,
              primaryKeyDataFieldRef.current
            )
          }
          setCreatedDataRow={(createdDataRow) =>
            setCreatedDataRow(
              createdDataRow,
              createdDataRows,
              primaryKeyDataFieldRef.current,
              setCreatedDataRows
            )
          }
          setDeletedDataRow={(isDeleted, dataRow) =>
            setDeletedDataRow(
              isDeleted,
              dataRow,
              deletedDataRows,
              setDeletedDataRows,
              primaryKeyDataFieldRef.current
            )
          }
          onLoadDataRows={props.onLoadDataRows}
          onSaveDataRows={props.onSaveDataRows}
          cols={cols}
          primaryKeyDataField={primaryKeyDataFieldRef.current}
        ></DataGridBody>
        {props.onSaveDataRows && !props.disableDataRowCreation && (
          <DataGridAddRow
            numColumns={cols.length}
            onAddRow={() =>
              createDataRow(
                createRowNextIdRef.current++,
                createdDataRows,
                setCreatedDataRows,
                cols,
                primaryKeyDataFieldRef.current
              )
            }
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
          currentPageNumber={currentPage}
          maxPageNumber={maxPageNumber}
          onGotoPagePressed={(pageNumber) => setCurrentPage(pageNumber)}
          onNextPagePressed={(pageNumber) => setCurrentPage(pageNumber)}
          onPreviousPagePressed={(pageNumber) => setCurrentPage(pageNumber)}
        ></Pager>
      )}
    </>
  );
};

export interface DataGridProps {
  onLoadDataRows: onLoadDataRowsFunc;
  onSaveDataRows?: onSaveDataRowsFunc;
  disableDataRowCreation?: boolean;
  cols: DataGridColumn[];
  primaryKeyDataField?: string; // default primary key is "id"
  pageSize?: number;
}

export type onLoadDataRowsFunc = (
  searchText: string,
  dataFieldsToSearch: string[],
  limit?: number,
  offset?: number
) => Promise<DataRow[] | PagedDataRows<DataRow>>;

export type DataRow = Record<string, any>;

export type PagedDataRows<DataRowType> = {
  count: number; // total record/object number in db table/model
  results: DataRowType[] /* ex.
  [
    {
        "id": 2,
        "name": "Into School Mentoring",
        "viewsSessionGroupId": 5,
        "activity": 2
    },
    ...
  ]*/;
};

export type onSaveDataRowsFunc = (
  // rowChanges includes updated, created, and deleted rows.
  // updated have an id and created don't. deleted rows have a field
  // 'isDeleted' which is set to true. This works automatically with
  // a POST request containing rowChanges to the BatchUpdateViewSet.
  rowChanges: DataRow[]
) => Promise<boolean>;

export interface DataGridColumn {
  header: string;
  dataField: string;

  valueOptions?: ValueOption[];
  onLoadValueOptions?: () => Promise<ValueOption[]>;
  disableEditing?: boolean;
  enableSearching?: boolean;
}

export interface ValueOption {
  id: number;
  name: string;
}

interface DataGridAddRowProps {
  numColumns: number;
  onAddRow: () => void;
  enableAddButton: boolean;
}

const DataGridAddRow: FC<DataGridAddRowProps> = (props) => {
  return (
    <TableRow>
      <TableCell colSpan={props.numColumns + 1}>
        <AddButtonContainer>
          <Button
            color="success"
            variant="contained"
            disabled={!props.enableAddButton}
            onClick={props.onAddRow}
          >
            <MdAdd size="24" />
          </Button>
        </AddButtonContainer>
      </TableCell>
    </TableRow>
  );
};

const AddButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export default DataGrid;
