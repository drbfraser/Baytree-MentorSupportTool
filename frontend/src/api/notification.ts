import axios from "axios";
import { API_BASE_URL } from "./url";

const notificationApi = axios.create({
  baseURL: `${API_BASE_URL}/notifications`,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

export const fetchNotificationsByUserId = async (id: number) => {
  const apiRes = await notificationApi.get("/", { params: {mentor_id: id} });
  return apiRes.data;
}

export const readNotification = async (notificationId: number) => {
  await notificationApi.patch(`/${notificationId}`, {
    is_read: true
  });
}

export const fetchUnreadNotificationCountByUserId = async (id: number) => {
  const { data } = await notificationApi.get("get_unread_count/", {
    params: { mentor_id: id }
  });
  return data[0] as number;
}

