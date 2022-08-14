import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AsyncPaginate } from "react-select-async-paginate";
import { RootState } from "../../stores/store";

var G_PAGINATED_SELECT_NUMBER = 0;

export interface PaginatedSelectOption<ValueType> {
  value: ValueType;
  label: string;
}

const PaginatedSelect: React.FC<React.ComponentProps<typeof AsyncPaginate>> = (
  props
) => {
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
          zIndex: 8,
        }),
        control: (base: any) => ({
          ...base,
          ":focus-within": {
            borderColor: themeColors.primaryColor,
            color: themeColors.primaryColor,
            boxShadow: `0 0 3px 1.5px ${themeColors.primaryColor}`,
          },
        }),
      }}
      {...props}
    />
  );
};

export default PaginatedSelect;
