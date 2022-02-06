import { Checkbox as MatCheckBox, styled } from "@mui/material";

interface CheckBoxWrapperProps {
  color?: string;
  isChecked?: boolean | null;
}

const CheckBox: React.FC<CheckBoxWrapperProps> = (props) => {
  return (
    <StyledCheckBoxWrapper
      checked={props.isChecked ?? false}
      checkBoxColor={props.color}
    ></StyledCheckBoxWrapper>
  );
};

const StyledCheckBoxWrapper = styled(MatCheckBox)<{
  checkBoxColor?: string;
}>`
  color: ${(props) => props.checkBoxColor ?? ""};

`;

export default CheckBox;
