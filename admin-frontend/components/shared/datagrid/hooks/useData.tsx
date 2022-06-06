import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DataGridColumn,
  DataRow,
  InvalidCell,
  onLoadDataRowsFunc,
  onLoadPagedDataRowsFunc,
  onSaveDataRowsFunc,
} from "../datagridTypes";
import {
  loadColumnValueOptions,
  saveDataRows,
  removeCreatedDataRow,
  getOriginalDataRow,
  getChangedDataRow,
  isDataRowDeleted,
  setChangedDataRow,
  setCreatedDataRow,
  setDeletedDataRow,
  createDataRow,
  isAnyColumnSearchable,
  loadDataRows,
} from "./useDataLogic";

/** Responsible for loading, accessing, deleting data state and saving it */
const useData = (
  initialCols: DataGridColumn[],
  currentPage: number,
  searchText: string,
  isSearchingRef: MutableRefObject<number>,
  clearPagerFuncRef: MutableRefObject<(() => void) | null>,
  setIsLoadingDataRows: Dispatch<SetStateAction<boolean>>,
  setCurrentPage: Dispatch<SetStateAction<number>>,
  setMaxPageNumber: Dispatch<SetStateAction<number>>,
  setIsLoadingColValueOptions: Dispatch<SetStateAction<boolean>>,
  setIsSavingDataRows: Dispatch<SetStateAction<boolean>>,
  isLoadingDataRows: boolean,
  isLoadingColValueOptions: boolean,
  isSavingDataRows: boolean,
  onSaveDataRows?: onSaveDataRowsFunc<DataRow>,
  primaryKeyDataField?: string,
  onLoadDataRows?: onLoadDataRowsFunc | onLoadPagedDataRowsFunc,
  data?: DataRow[],
  pageSize?: number
) => {
  const FAIL_LOAD_MESSAGE =
    "Failed to load data. Please ensure that you have a stable internet connection and refresh the page. Otherwise, contact your administrator.";

  const FAIL_SAVE_MESSAGE =
    "Failed to save data. Ensure that all data entered is valid and your internet is stable. Otherwise, try refreshing the page or contacting your administrator.";

  const _onLoadDataRows = data
    ? async () => data as DataRow[]
    : onLoadDataRows
    ? onLoadDataRows
    : async () => [];

  const [dataRows, setDataRows] = useState<DataRow[]>([]);
  const originalDataRowsRef = useRef<DataRow[]>([]);
  const [changedDataRows, setChangedDataRows] = useState<DataRow[]>([]);
  const [createdDataRows, setCreatedDataRows] = useState<DataRow[]>([]);
  const [deletedDataRows, setDeletedDataRows] = useState<DataRow[]>([]);
  const [cols, setCols] = useState<DataGridColumn[]>(initialCols);
  const primaryKeyDataFieldRef = useRef(primaryKeyDataField ?? "id");
  const createRowNextIdRef = useRef(0); // next created row id
  const [invalidCells, setInvalidCells] = useState<InvalidCell[]>([]);
  const loadedColumnValueOptionsRef = useRef(false); // prevent double loading

  useEffect(() => {
    getData();
  }, [currentPage, searchText]);

  const getData = async () => {
    // Is paginated
    if (pageSize) {
      await loadDataRows(
        _onLoadDataRows,
        setDataRows,
        setIsLoadingDataRows,
        searchText,
        isSearchingRef,
        clearPagerFuncRef,
        cols,
        {
          pagination: {
            pageSize: pageSize,
            currentPageNum: currentPage,
            setCurrentPageNum: setCurrentPage,
            setMaxPageNum: setMaxPageNumber,
          },
        }
      );
    } else {
      await loadDataRows(
        _onLoadDataRows,
        setDataRows,
        setIsLoadingDataRows,
        searchText,
        isSearchingRef,
        clearPagerFuncRef,
        cols
      );
    }
  };

  useEffect(() => {
    if (!loadedColumnValueOptionsRef.current) {
      loadColumnValueOptions(
        cols,
        setCols,
        setIsLoadingColValueOptions,
        FAIL_LOAD_MESSAGE
      );
      loadedColumnValueOptionsRef.current = true;
    }
  }, [initialCols]);

  const _saveDataRows = onSaveDataRows
    ? () =>
        saveDataRows(
          onSaveDataRows,
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
          FAIL_SAVE_MESSAGE,
          cols,
          setInvalidCells
        )
    : undefined;

  const isDataGridCurrentlyAbleToSave =
    (changedDataRows.length > 0 ||
      createdDataRows.length > 0 ||
      deletedDataRows.length > 0) &&
    !isLoadingDataRows &&
    !isLoadingColValueOptions &&
    !isSavingDataRows;

  const _removeCreatedDataRow = (createdDataRow: DataRow) =>
    removeCreatedDataRow(
      createdDataRow,
      createdDataRows,
      primaryKeyDataFieldRef.current,
      setCreatedDataRows
    );

  const _getOriginalDataRow = (dataRow: DataRow) =>
    getOriginalDataRow(
      dataRow,
      originalDataRowsRef.current,
      primaryKeyDataFieldRef.current
    );

  const _getChangedDataRow = (dataRow: DataRow) =>
    getChangedDataRow(dataRow, changedDataRows, primaryKeyDataFieldRef.current);

  const _isDataRowDeleted = (dataRow: DataRow) =>
    isDataRowDeleted(dataRow, deletedDataRows, primaryKeyDataFieldRef.current);

  const _setChangedDataRow = (changedDataRow: DataRow) =>
    setChangedDataRow(
      dataRows,
      changedDataRow,
      originalDataRowsRef,
      changedDataRows,
      setChangedDataRows,
      primaryKeyDataFieldRef.current
    );

  const _setCreatedDataRow = (createdDataRow: DataRow) =>
    setCreatedDataRow(
      createdDataRow,
      createdDataRows,
      primaryKeyDataFieldRef.current,
      setCreatedDataRows
    );

  const _setDeletedDataRow = (isDeleted: boolean, dataRow: DataRow) =>
    setDeletedDataRow(
      isDeleted,
      dataRow,
      deletedDataRows,
      setDeletedDataRows,
      primaryKeyDataFieldRef.current
    );

  const _createDataRow = () =>
    createDataRow(
      createRowNextIdRef.current++,
      createdDataRows,
      setCreatedDataRows,
      cols,
      primaryKeyDataFieldRef.current
    );

  const _isAnyColumnSearchable = isAnyColumnSearchable(cols);

  return {
    dataRows,
    originalDataRowsRef,
    changedDataRows,
    setChangedDataRows,
    createdDataRows,
    setCreatedDataRows,
    deletedDataRows,
    setDeletedDataRows,
    cols,
    onLoadDataRows: _onLoadDataRows,
    saveDataRows: _saveDataRows,
    primaryKeyDataFieldRef,
    isDataGridCurrentlyAbleToSave,
    removeCreatedDataRow: _removeCreatedDataRow,
    getOriginalDataRow: _getOriginalDataRow,
    getChangedDataRow: _getChangedDataRow,
    isDataRowDeleted: _isDataRowDeleted,
    setChangedDataRow: _setChangedDataRow,
    setCreatedDataRow: _setCreatedDataRow,
    setDeletedDataRow: _setDeletedDataRow,
    createDataRow: _createDataRow,
    isAnyColumnSearchable: _isAnyColumnSearchable,
    invalidCells,
  };
};

export default useData;
