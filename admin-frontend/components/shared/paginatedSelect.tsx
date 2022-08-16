import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AsyncPaginate } from "react-select-async-paginate";
import { RootState } from "../../stores/store";

var G_PAGINATED_SELECT_NUMBER = 0;

export interface PaginatedSelectOption<ValueType> {
  value: ValueType;
  label: string;
}

export interface PaginatedSelectProps
  extends React.ComponentProps<typeof AsyncPaginate> {
  fontSize?: string;
  zIndex?: string;
}

const PaginatedSelect: React.FC<PaginatedSelectProps> = (props) => {
  const themeColors = useSelector((state: RootState) => state.theme.colors);

  const [options, setOptions] = useState<any[]>([]);

  const [key, setKey] = useState<any>("key" + ++G_PAGINATED_SELECT_NUMBER);

  useEffect(() => {
    const func = async () => {
      const { options } = (await props.loadOptions("", {
        length: 0,
      } as any)) as any;
      setOptions(options);
      setKey(key + "loaded");
    };
    func();
  }, []);

  return (
    <AsyncPaginate
      key={key}
      debounceTimeout={700}
      options={options}
      id={`select_paginate_${key}`}
      instanceId={`select_paginate_instanceid_${key}`}
      styles={{
        container: (base: any) => ({
          ...base,
          width: "100%",
          zIndex: props.zIndex,
        }),
        control: (base: any) => ({
          ...base,
          fontSize: props.fontSize,
          ":focus-within": {
            borderColor: themeColors.primaryColor,
            color: themeColors.primaryColor,
            boxShadow: `0 0 3px 1.5px ${themeColors.primaryColor}`,
            fontSize: props.fontSize,
          },
        }),
      }}
      {...props}
    />
  );
};

export default PaginatedSelect;
