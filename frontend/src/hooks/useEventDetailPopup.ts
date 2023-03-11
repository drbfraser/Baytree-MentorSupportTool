import { useState } from 'react'
import { EVENT_ID_REGEX } from './useSessionEvents'

const useEventDetailPopup = () => {
  const [open, setOpen] = useState(false)
  const [event, setEvent] = useState<{ type?: string; id?: number }>({})

  const handleEventId = (eventId: string) => {
    const [, type, idString] = eventId.match(EVENT_ID_REGEX) || [
      '',
      undefined,
      undefined
    ]
    const id = idString ? +idString : undefined
    setEvent({ type, id })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEvent({})
  }

  return {
    open: open && event.id !== undefined && !!event.type,
    handleClose,
    event,
    handleEventId
  }
}

export default useEventDetailPopup
