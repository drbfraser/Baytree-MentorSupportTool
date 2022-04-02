/**
  Endpoints creating/reading/updating/deleting Monthly Expected Session Count(s).
*/

import { generateBackendCrudFuncs } from "./base";
import { API_BASE_URL } from "./url";

export interface MonthlyExpectedSessionCountCreate {
  year: number;
  january_count: number;
  february_count: number;
  march_count: number;
  april_count: number;
  may_count: number;
  june_count: number;
  july_count: number;
  august_count: number;
  september_count: number;
  october_count: number;
  november_count: number;
  december_count: number;
}

export type MonthlyExpectedSessionCountResponse =
  MonthlyExpectedSessionCountCreate;

export type MonthlyExpectedSessionCountUpdate =
  MonthlyExpectedSessionCountCreate;

export const monthlyExpectedSessionCountEndpoint = `${API_BASE_URL}/sessions/monthly-expected-session-counts`;

export const {
  create: addMonthlyExpectedSessionCount,
  read: getMonthlyExpectedSessionCount,
  update: updateMonthlyExpectedSessionCount,
  delete: deleteMonthlyExpectedSessionCount,
} = generateBackendCrudFuncs<
  MonthlyExpectedSessionCountCreate,
  MonthlyExpectedSessionCountResponse,
  MonthlyExpectedSessionCountUpdate
>(monthlyExpectedSessionCountEndpoint);
