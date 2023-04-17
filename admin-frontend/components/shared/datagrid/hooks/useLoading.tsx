import { useState } from 'react'

/** Responsible for providing loading states to update UI */
const useLoading = () => {
  const [isLoadingDataRows, setIsLoadingDataRows] = useState(false)
  const [isLoadingColValueOptions, setIsLoadingColValueOptions] =
    useState(false)
  const [isSavingDataRows, setIsSavingDataRows] = useState(false)

  return {
    isLoadingDataRows,
    setIsLoadingDataRows,
    isLoadingColValueOptions,
    setIsLoadingColValueOptions,
    isSavingDataRows,
    setIsSavingDataRows
  }
}

export default useLoading
