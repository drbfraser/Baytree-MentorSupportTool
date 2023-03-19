import { useRef, useState } from 'react'

/** Stores state for necessary for searching in the datagrid */
const useSearch = () => {
  // 0 == didn't search, 1 == data load caused by search,
  // 2 == data loaded already from last search, don't reload data
  const isSearchingRef = useRef(0)
  const [searchText, setSearchText] = useState('')

  return { isSearchingRef, searchText, setSearchText }
}

export default useSearch
