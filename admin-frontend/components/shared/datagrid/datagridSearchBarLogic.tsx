import { ChangeEvent, Dispatch, MutableRefObject, SetStateAction } from "react";
import { DataGridColumn } from "./datagrid";

export const onSearchTextChanged = (
  event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  curTimeoutIdRef: MutableRefObject<number | null>,
  setSearchText: Dispatch<SetStateAction<string>>,
  isSearchingRef: MutableRefObject<boolean>,
  debounceTimeMilliseconds: number
) => {
  if (curTimeoutIdRef.current) {
    clearTimeout(curTimeoutIdRef.current);
  }

  const changedSearchText = event.target.value;
  curTimeoutIdRef.current = setTimeout(() => {
    isSearchingRef.current = true;
    setSearchText(changedSearchText);
  }, debounceTimeMilliseconds) as any;
};

export const getSearchBarLabel = (cols: DataGridColumn[]) => {
  const columnsToSearch = cols.filter((col) => col.enableSearching);
  const headersToSearch = columnsToSearch.map((col) => col.header);
  const columnsToSearchStr = headersToSearch.join(", ");
  return `Search ${columnsToSearchStr}`;
};
