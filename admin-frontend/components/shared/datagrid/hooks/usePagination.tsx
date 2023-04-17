import { useState, useRef } from 'react'

/** Responsible for providing pagination state to be used with Pager component */
const usePagination = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [maxPageNumber, setMaxPageNumber] = useState(0)
  const clearPagerFuncRef = useRef<(() => void) | null>(null)

  return {
    currentPage,
    setCurrentPage,
    maxPageNumber,
    setMaxPageNumber,
    clearPagerFuncRef
  }
}

export default usePagination
