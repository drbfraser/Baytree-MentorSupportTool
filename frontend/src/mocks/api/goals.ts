import { DefaultBodyType, PathParams, rest } from "msw";
import type { GoalCategory, GoalResult, GoalStatistics } from "../../api/goals";
import { API_BASE_URL } from "../../api/url";
import { mockGoalCateogories, mockGoals } from "../data/goals";

const goalUrl = `${API_BASE_URL}/goals`;

const getGoalCategories = rest.get<DefaultBodyType, PathParams<string>, GoalCategory[]>(`${goalUrl}/categories`, (req, res, ctx) => {
  return res(ctx.json(mockGoalCateogories))
});

const getGoals = rest.get<DefaultBodyType, PathParams<string>, GoalResult>(goalUrl, (req, res, ctx) => {
  return res(ctx.json({
    count: mockGoals.length,
    results: mockGoals
  }))
});

const getStatistics = rest.get<DefaultBodyType, PathParams<string>, GoalStatistics>(`${goalUrl}/statistics`, (req, res, ctx) => {
  const active = mockGoals.filter(g => g.status === "IN PROGRESS").length;
  const complete = mockGoals.filter(g => g.status === "ACHIEVED").length;

  return res(ctx.json({ active, complete }))
})

export const goalHandlers = [getGoalCategories, getGoals, getStatistics];
