import { rest, setupWorker, type SetupWorkerApi } from 'msw'
import { API_BASE_URL } from '../api/url'

const worker = setupWorker()

export { API_BASE_URL, worker }

declare global {
  interface Window {
    msw: {
      worker: SetupWorkerApi
      rest: typeof rest
    }
  }
}

window.msw = {
  worker,
  rest
}
