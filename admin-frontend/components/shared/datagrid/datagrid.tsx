import { FC, useEffect, useRef, useState } from "react";
import { Table, TableRow, TableCell, Button } from "@mui/material";
import DataGridBody from "./datagridBody";
import {
  createDataRow,
  getChangedDataRow,
  getOriginalDataRow,
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

const DataGrid: FC<DataGridProps> = (props) => {
  const [isLoadingDataRows, setIsLoadingDataRows] = useState(false);
  const [isLoadingColValueOptions, setIsLoadingColValueOptions] =
    useState(false);
  const [dataRows, setDataRows] = useState<DataRow[]>([]);
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
  }, []);

  useEffect(
    () => loadColumnValueOptions(cols, setCols, setIsLoadingColValueOptions),
    [props.cols]
  );

  const getData = async () => {
    await loadDataRows(props.onLoadDataRows, setDataRows, setIsLoadingDataRows);
  };

  return (
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
              originalDataRowsRef,
              TOAST_ERROR_MESSAGE
            );
          }
        }}
        isDataGridSaveable={!!props.onSaveDataRows}
        enableSaveButton={!isLoadingDataRows && !isLoadingColValueOptions}
      ></DataGridHeaderRow>
      <DataGridBody
        isLoadingDataRows={isLoadingDataRows}
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
      {props.onSaveDataRows && (
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
          enableAddButton={!isLoadingDataRows && !isLoadingColValueOptions}
        ></DataGridAddRow>
      )}
    </Table>
  );
};

export interface DataGridProps {
  onLoadDataRows: onLoadDataRowsFunc;
  onSaveDataRows?: onSaveDataRowsFunc;
  cols: DataGridColumn[];
  primaryKeyDataField?: string; // default primary key is "id"
}

export type onLoadDataRowsFunc = () => Promise<DataRow[]>;

export type DataRow = Record<string, any>;

export type onSaveDataRowsFunc = (
  createRows: DataRow[],
  updateRows: DataRow[],
  deleteRows: DataRow[]
) => Promise<boolean>;

export interface DataGridColumn {
  header: string;
  dataField: string;

  valueOptions?: ValueOption[];
  onLoadValueOptions?: () => Promise<ValueOption[]>;
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
