/**
  Endpoints for Mentor Sessions
*/

import { generateBackendCrudFuncs } from "./base";
import { API_BASE_URL } from "./url";

export interface SessionCreate {
  created_at: Date;
  updated_at: Date;
  mentor: number; // mentor id
  mentee: number; // mentee id
  attended_by_mentor: boolean;
  attended_by_mentee: boolean;
  clock_in: Date;
  clock_out: Date;
  notes: string;
  cancelled: boolean;
  viewsSessionId: string; // Matching session id in views
}

export type SessionResponse = SessionCreate;

export type SessionUpdate = Partial<SessionCreate> & { id: number };

export const sessionsBackendEndpoint = `${API_BASE_URL}/sessions`;

export const {
  create: createSession,
  read: getSession,
  update: updateSession,
  delete: deleteSession,
} = generateBackendCrudFuncs<SessionCreate, SessionResponse, SessionUpdate>(
  sessionsBackendEndpoint
);
