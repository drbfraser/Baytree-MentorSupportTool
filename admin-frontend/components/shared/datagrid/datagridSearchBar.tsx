import { TextField } from "@mui/material";
import { Dispatch, FC, MutableRefObject, SetStateAction, useRef } from "react";
import { DataGridColumn } from "./datagrid";
import {
  getSearchBarLabel,
  onSearchTextChanged,
} from "./datagridSearchBarLogic";

const DataGridSearchBar: FC<DataGridSearchBarProps> = (props) => {
  const curTimeoutIdRef = useRef<number | null>(null);
  const DEBOUNCE_TIME_MILLISECONDS = 1500;

  return (
    <TextField
      fullWidth
      defaultValue={props.searchText}
      onChange={(event) =>
        onSearchTextChanged(
          event,
          curTimeoutIdRef,
          props.setSearchText,
          props.isSearchingRef,
          DEBOUNCE_TIME_MILLISECONDS
        )
      }
      label={getSearchBarLabel(props.cols)}
    ></TextField>
  );
};

interface DataGridSearchBarProps {
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
  isSearchingRef: MutableRefObject<boolean>;
  cols: DataGridColumn[];
}

export default DataGridSearchBar;
