import { backendGet } from "./base";

export interface GoalCategory {
  id: number;
  name: string;
}

export interface Goal {
  id: number;
  mentor?: {
    user: {
      email: string;
    }
  }
  title: string;
  creation_date: string;
  goal_review_date: string;
  last_update_date: string;
  status: "IN PROGRESS" | "RECALIBREATED" | "ACHIEVED";
  description: string;
}

export type OrderingDate = "creation_date" | "goal_review_date" | "last_update_date";

export type GoalQuery = {
  limit: number;
  offset: number;
  status?: Goal["status"];
  categoryIds?: number[];
  orderingDate: OrderingDate;
  ascending?: boolean;
  search?: string;
}

export const fetchGoals = (query: GoalQuery = { limit: 5, offset: 0, orderingDate: "creation_date" }) => {
  let params: any = {
    limit: query.limit,
    offset: query.offset,
  }

  if (query.status) params.status = query.status;
  if (query.categoryIds && query.categoryIds.length > 0) params.categories = query.categoryIds.join(',');
  if (query.orderingDate) params.ordering = (!query.ascending ? '-' : '') + query.orderingDate;
  if (query.search) params.search = query.search;

  return backendGet<{ count: number, results: Goal[] }>("goals", params);
};