import { Select, MenuItem, Checkbox, Skeleton } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import PaginatedSelect, { PaginatedSelectOption } from '../paginatedSelect'
import { OnLoadPagedColumnValueOptionsFunc, ValueOption } from './datagridTypes'

export interface DataGridSelectComponentProps {
  primaryKeyVal: any
  dataField: string
  idNumber: number
  value: any
  onLoadPagedColumnValueOptionsFunc?: OnLoadPagedColumnValueOptionsFunc
  selectPageSize?: number
  onChangedValue: (newValue: any) => void
  valueOptions: ValueOption[]
  isMultiSelect?: boolean
}

const DataGridSelectComponent: FC<DataGridSelectComponentProps> = (props) => {
  const isMultiSelect = props.isMultiSelect || Array.isArray(props.value)
  const [value, setValue] = useState<any>(props.value ?? '')

  const isPaginatedSelect = !!props.onLoadPagedColumnValueOptionsFunc
  const [defaultValue, setDefaultValue] =
    useState<PaginatedSelectOption<string> | null>(null)
  const isLoadingDefaultValue = isPaginatedSelect && !defaultValue

  useEffect(() => {
    // Load initial value for select
    if (isPaginatedSelect) {
      if (props.value) {
        props.onLoadPagedColumnValueOptionsFunc!({ id: props.value }).then(
          (defaultValue) => {
            if (defaultValue.data.length > 0) {
              const fetchedDefaultValue = defaultValue.data[0]
              setDefaultValue({
                value: fetchedDefaultValue.id,
                label: fetchedDefaultValue.name
              })
            }
          }
        )
      } else {
        setDefaultValue({ value: '', label: '' })
      }
    }
  }, [])

  const renderValue = (ids: any) => {
    if (isMultiSelect) {
      return ids.map((id: any) => getOptionName(id)).join(', ')
    } else {
      return getOptionName(ids)
    }
  }

  const getOptionName = (id: any) =>
    props.valueOptions.find((opt) => opt.id === id)?.name ?? id

  useEffect(() => {
    if (!isPaginatedSelect) {
      if (isMultiSelect) {
        // remove any values that don't have a value in props.valueOptions
        // this is typically a cause of a valueOption being removed
        const existingValues = value.filter((val: any) =>
          props.valueOptions.some((valOption) => valOption.id === val)
        )

        setValue(existingValues)
      } else {
        if (!props.valueOptions.find((opt) => opt.id === value)) {
          // Field value doesn't correspond to any value option
          setValue('')
        }
      }
    }
  }, [])

  // Used for paginated select columns
  const onLoadPaginatedSelectOptions = async (
    search: any,
    prevOptions: any
  ) => {
    const DEFAULT_PAGE_SIZE = 20
    const pageSize = props.selectPageSize
      ? props.selectPageSize
      : DEFAULT_PAGE_SIZE

    const options = await props.onLoadPagedColumnValueOptionsFunc!({
      searchText: search,
      limit: pageSize,
      offset: prevOptions.length
    })

    const selectboxOptions = {
      options: options.data.map((option) => ({
        value: option.id,
        label: option.name
      })),
      hasMore: prevOptions.length + pageSize < options.total
    }

    return selectboxOptions
  }

  // Used for paginated select columns
  const onPaginatedSelectOptionChange = async (newOption: any) => {
    const selectedOption = newOption as PaginatedSelectOption<string>
    setValue(selectedOption.value)
    props.onChangedValue(selectedOption.value)
  }

  return isPaginatedSelect && isLoadingDefaultValue ? (
    <div style={{ width: '100%' }}>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  ) : isPaginatedSelect ? (
    <PaginatedSelect
      isMulti={false}
      defaultValue={defaultValue}
      loadOptions={onLoadPaginatedSelectOptions}
      onChange={onPaginatedSelectOptionChange}
      fontSize="0.8rem"
    ></PaginatedSelect>
  ) : (
    <Select
      key={`select_datarow_${props.primaryKeyVal}_col_${props.dataField}_selectRef${props.idNumber}`}
      fullWidth
      multiple={isMultiSelect}
      value={value}
      onChange={(event) => {
        const newValue = event.target.value
        props.onChangedValue(newValue)
        setValue(newValue)
      }}
      renderValue={renderValue}
      sx={{ fontSize: '0.8rem' }}
    >
      {props.valueOptions!.map((valueOption, k) => (
        <MenuItem key={valueOption.id} value={valueOption.id}>
          {isMultiSelect && (
            <Checkbox checked={value.includes(valueOption.id)} />
          )}
          {valueOption.name}
        </MenuItem>
      ))}
    </Select>
  )
}

export default DataGridSelectComponent
