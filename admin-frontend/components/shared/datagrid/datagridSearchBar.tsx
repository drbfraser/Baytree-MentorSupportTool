import { TextField } from "@mui/material";
import { Dispatch, FC, MutableRefObject, SetStateAction, useRef } from "react";
import {
  getSearchBarLabel,
  onSearchTextChanged,
} from "./datagridSearchBarLogic";
import { DataGridColumn } from "./datagridTypes";

interface DataGridSearchBarProps {
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
  isSearchingRef: MutableRefObject<number>;
  cols: DataGridColumn[];
}

const DataGridSearchBar: FC<DataGridSearchBarProps> = (props) => {
  const curTimeoutIdRef = useRef<number | null>(null);
  const DEBOUNCE_TIME_MILLISECONDS = 850;

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

export default DataGridSearchBar;
