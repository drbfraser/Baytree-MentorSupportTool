import { FunctionComponent } from "react";
import {DialogProps, Dialog} from "@mui/material"

type Props = {
  id: number | string;
} & DialogProps;

const RecordDetail: FunctionComponent<Props> = ({id, ...props}) => {
  return <Dialog {...props}>
    
  </Dialog>
}

export default RecordDetail;