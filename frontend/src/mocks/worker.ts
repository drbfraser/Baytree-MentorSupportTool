import { rest } from "msw";
import { setupWorker, SetupWorkerApi } from "msw";
import { goalHandlers } from "./api/goals";

export const worker = setupWorker(...goalHandlers);