import { Checkbox } from "@mui/material";
import { FC, useState } from "react";

export interface DataGridBoolComponentProps {
  isDataGridSaveable?: boolean;
  isColumnEditable?: boolean;
  primaryKeyVal?: any;
  dataField: string;
  onChangedValue: (newValue: any) => void;
  value?: any;
}

const DataGridBoolComponent: FC<DataGridBoolComponentProps> = (props) => {
  const [checkBoxChecked, setCheckBoxChecked] = useState<boolean | null>(
    props.value ? props.value : null
  );

  return (
    <Checkbox
      disabled={!props.isDataGridSaveable || !props.isColumnEditable}
      key={`checkbox_${props.primaryKeyVal}_col_${props.dataField}`}
      checked={!!checkBoxChecked}
      onChange={(event) => {
        setCheckBoxChecked(event.target.checked);
        props.onChangedValue(event.target.checked);
      }}
      size={"large" as any} // Need to supress typescript error
    ></Checkbox>
  );
};

export default DataGridBoolComponent;
