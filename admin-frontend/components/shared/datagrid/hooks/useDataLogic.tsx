import { Dispatch, SetStateAction, MutableRefObject } from "react";
import { toast } from "react-toastify";
import {
  DataGridColumn,
  ValueOption,
  onSaveDataRowsFunc,
  DataRow,
  onLoadDataRowsFunc,
  PagedDataRows,
  onLoadPagedDataRowsFunc,
} from "../datagridTypes";

const failureLoadDataToastMessage =
  "Failed to load data. Please ensure that you have a stable internet connection and refresh the page. Otherwise, contact an administrator.";

export const loadDataRows = async (
  onLoadDataRows: onLoadDataRowsFunc | onLoadPagedDataRowsFunc,
  setDataRows: Dispatch<SetStateAction<DataRow[]>>,
  setIsLoadingDataRows: Dispatch<SetStateAction<boolean>>,
  searchText: string,
  isSearchingRef: MutableRefObject<number>,
  clearPagerFuncRef: MutableRefObject<(() => void) | null>,
  cols: DataGridColumn[],
  options?: {
    pagination?: {
      pageSize: number;
      currentPageNum: number;
      setCurrentPageNum: Dispatch<SetStateAction<number>>;
      setMaxPageNum: Dispatch<SetStateAction<number>>;
    };
  }
) => {
  try {
    if (isSearchingRef.current === 2) {
      isSearchingRef.current = 0;
      return;
    }

    setIsLoadingDataRows(true);

    const dataFieldsToSearch = getDataFieldsToSearch(cols);

    if (options && options.pagination) {
      const { pageSize, currentPageNum, setCurrentPageNum, setMaxPageNum } =
        options.pagination;

      const pageResponse = (await onLoadDataRows({
        searchText,
        dataFieldsToSearch,
        limit: pageSize,
        offset: getOffsetFromPage(
          pageSize,
          isSearchingRef.current ? 1 : currentPageNum
        ),
      })) as PagedDataRows<DataRow>;

      setMaxPageNum(calcMaxPageNum(pageResponse.count, pageSize));

      setDataRows(pageResponse.results);

      if (pageResponse.count === 0) {
        setCurrentPageNum(0);
      } else if (currentPageNum === 0 || isSearchingRef.current === 1) {
        // if initial load or is searching
        setCurrentPageNum(1);
        // clear the pager since reseting to page 1
        if (clearPagerFuncRef.current) {
          clearPagerFuncRef.current();
        }
      }

      if (isSearchingRef.current === 1 && currentPageNum > 1) {
        // prevent double loading edge case bug when searching past page 1
        isSearchingRef.current = 2;
      } else {
        isSearchingRef.current = 0;
      }
    } else {
      const dataRows = await onLoadDataRows({ searchText, dataFieldsToSearch });
      setDataRows(dataRows as DataRow[]);
    }

    setIsLoadingDataRows(false);
  } catch {
    setIsLoadingDataRows(false);
    toast.error(failureLoadDataToastMessage);
  }
};

const calcMaxPageNum = (count: number, pageSize: number) =>
  Math.ceil(count / pageSize);

const getDataFieldsToSearch = (cols: DataGridColumn[]) => {
  return cols.filter((col) => col.enableSearching).map((col) => col.dataField);
};

const getOffsetFromPage = (pageSize: number, currentPageNumber: number) => {
  return pageSize * Math.max(currentPageNumber - 1, 0);
};

export const loadColumnValueOptions = (
  columns: DataGridColumn[],
  setColumns: Dispatch<SetStateAction<DataGridColumn[]>>,
  setIsLoadingColValueOptions: Dispatch<SetStateAction<boolean>>,
  failLoadMessage: string
) => {
  setIsLoadingColValueOptions(true);

  const colsWithValueOptions = columns.filter((col) => col.onLoadValueOptions);

  const colLoadFuncs = colsWithValueOptions.map((col) =>
    (col.onLoadValueOptions as () => Promise<ValueOption[]>)()
  ) as Promise<ValueOption[]>[];

  Promise.all(colLoadFuncs)
    .then((colResults) => {
      colsWithValueOptions.forEach(
        (col, i) => (col.valueOptions = colResults[i])
      );

      setIsLoadingColValueOptions(false);
      setColumns([...columns]);
    })
    .catch(() => {
      setIsLoadingColValueOptions(false);
      toast.error(failLoadMessage);
    });
};

export const saveDataRows = async (
  onSaveDataRows: onSaveDataRowsFunc,
  createdDataRows: DataRow[],
  changedDataRows: DataRow[],
  deletedDataRows: DataRow[],
  primaryKeyDataField: string,
  loadData: () => Promise<void>,
  setCreatedDataRows: Dispatch<SetStateAction<DataRow[]>>,
  setChangedDataRows: Dispatch<SetStateAction<DataRow[]>>,
  setDeletedDataRows: Dispatch<SetStateAction<DataRow[]>>,
  setIsSavingDataRows: Dispatch<SetStateAction<boolean>>,
  originalDataRowsRef: MutableRefObject<DataRow[]>,
  errorMessage: string
) => {
  try {
    setIsSavingDataRows(true);

    changedDataRows = JSON.parse(JSON.stringify(changedDataRows));

    let originalDataRows = JSON.parse(
      JSON.stringify(originalDataRowsRef.current)
    ) as DataRow[];

    changedDataRows = changedDataRows.filter((chgRow) =>
      deletedDataRows.every(
        (delRow) => delRow[primaryKeyDataField] !== chgRow[primaryKeyDataField]
      )
    );

    originalDataRows = originalDataRows.filter((origRow) =>
      deletedDataRows.some(
        (delRow) => delRow[primaryKeyDataField] !== origRow[primaryKeyDataField]
      )
    );

    const success = await (onSaveDataRows as onSaveDataRowsFunc)([
      ...createdDataRows.map((row) => {
        // Remove primary key value from created rows
        let createdDataRowClone = JSON.parse(JSON.stringify(row)) as DataRow;

        delete createdDataRowClone[primaryKeyDataField as string];

        return createdDataRowClone;
      }),
      ...changedDataRows,
      ...deletedDataRows.map((deletedRow) => ({
        ...deletedRow,
        isDeleted: true,
      })),
    ]);
    if (success) {
      toast.success("Successfully saved data!");
      await loadData();
      setIsSavingDataRows(false);
      setCreatedDataRows([]);
      setChangedDataRows([]);
      setDeletedDataRows([]);
      originalDataRowsRef.current = [];
    } else {
      setIsSavingDataRows(false);
      toast.error(errorMessage);
    }
  } catch {
    setIsSavingDataRows(false);
    toast.error(errorMessage);
  }
};

export const removeCreatedDataRow = (
  createdDataRow: DataRow,
  createdDataRows: DataRow[],
  primaryKeyDataField: string,
  setCreatedDataRows: Dispatch<SetStateAction<DataRow[]>>
) => {
  createdDataRows = createdDataRows.filter(
    (row) => row[primaryKeyDataField] !== createdDataRow[primaryKeyDataField]
  );

  setCreatedDataRows(createdDataRows);
};

export const getOriginalDataRow = (
  dataRow: DataRow,
  originalDataRows: DataRow[],
  primaryKeyDataField: string
) =>
  originalDataRows.find(
    (originalDataRow) =>
      originalDataRow[primaryKeyDataField] === dataRow[primaryKeyDataField]
  ) as DataRow;

export const getChangedDataRow = (
  dataRow: DataRow,
  changedDataRows: DataRow[],
  primaryKeyDataField: string
) =>
  changedDataRows.find(
    (changedDataRow) =>
      changedDataRow[primaryKeyDataField] === dataRow[primaryKeyDataField]
  );

export const isDataRowDeleted = (
  dataRow: DataRow,
  deletedDataRows: DataRow[],
  primaryKeyDataField: string
) =>
  !!deletedDataRows.find(
    (deletedDataRow) =>
      deletedDataRow[primaryKeyDataField] === dataRow[primaryKeyDataField]
  );

export const setChangedDataRow = (
  dataRows: DataRow[],
  changedDataRow: DataRow,
  originalDataRowsRef: MutableRefObject<DataRow[]>,
  changedDataRows: DataRow[],
  setChangedDataRows: Dispatch<SetStateAction<DataRow[]>>,
  primaryKeyDataField: string
) => {
  const dataRow = dataRows.find(
    (dataRow) =>
      dataRow[primaryKeyDataField] === changedDataRow[primaryKeyDataField]
  ) as DataRow;

  const originalDataRow = originalDataRowsRef.current.find(
    (originalDataRow) =>
      originalDataRow[primaryKeyDataField] ===
      changedDataRow[primaryKeyDataField]
  );

  if (originalDataRow) {
    if (areDataRowsEqual(originalDataRow, changedDataRow)) {
      originalDataRowsRef.current = originalDataRowsRef.current.filter(
        (row) =>
          row[primaryKeyDataField] !== changedDataRow[primaryKeyDataField]
      );

      changedDataRows = changedDataRows.filter(
        (row) =>
          row[primaryKeyDataField] !== changedDataRow[primaryKeyDataField]
      );

      setChangedDataRows(changedDataRows);
    } else {
      changedDataRows = changedDataRows.filter(
        (row) =>
          row[primaryKeyDataField] !== changedDataRow[primaryKeyDataField]
      );

      setChangedDataRows([...changedDataRows, changedDataRow]);
    }
  } else {
    originalDataRowsRef.current = [...originalDataRowsRef.current, dataRow];
    setChangedDataRows([...changedDataRows, changedDataRow]);
  }
};

export const areDataRowsEqual = (dataRow1: DataRow, dataRow2: DataRow) => {
  for (const key in dataRow1) {
    if (dataRow1[key] !== dataRow2[key]) {
      return false;
    }
  }

  return true;
};

export const setCreatedDataRow = (
  createdDataRow: DataRow,
  createdDataRows: DataRow[],
  primaryKeyDataField: string,
  setCreatedDataRow: Dispatch<SetStateAction<DataRow[]>>
) => {
  const existingRow = createdDataRows.find(
    (row) => row[primaryKeyDataField] === createdDataRow[primaryKeyDataField]
  );

  if (existingRow) {
    createdDataRows = createdDataRows.filter(
      (row) => row[primaryKeyDataField] !== existingRow[primaryKeyDataField]
    );

    setCreatedDataRow([...createdDataRows, createdDataRow]);
  } else {
    setCreatedDataRow([...createdDataRows, createdDataRow]);
  }
};

export const setDeletedDataRow = (
  isDeleted: boolean,
  dataRow: DataRow,
  deletedDataRows: DataRow[],
  setDeletedDataRows: Dispatch<SetStateAction<DataRow[]>>,
  primaryKeyDataField: string
) => {
  if (isDeleted) {
    setDeletedDataRows([...deletedDataRows, dataRow]);
  } else {
    deletedDataRows = deletedDataRows.filter(
      (row) => row[primaryKeyDataField] !== dataRow[primaryKeyDataField]
    );

    setDeletedDataRows(deletedDataRows);
  }
};

export const createDataRow = (
  rowId: number,
  createdDataRows: DataRow[],
  setCreatedDataRows: Dispatch<SetStateAction<DataRow[]>>,
  columns: DataGridColumn[],
  primaryKeyDataField: string
) => {
  const newDataRow: DataRow = {};
  columns.forEach((col) => (newDataRow[col.dataField] = ""));
  newDataRow[primaryKeyDataField] = `created_${rowId}`;
  setCreatedDataRows([...createdDataRows, newDataRow]);
};

export const isAnyColumnSearchable = (cols: DataGridColumn[]) => {
  return cols.some((col) => col.enableSearching);
};
