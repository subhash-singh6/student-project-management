// frontend/src/services/notificationService.js

import API from "../api/axios";

export const notificationService = {

  /* ====================================== */
  /* GET ALL NOTIFICATIONS */
  /* ====================================== */

  getAll: async () => {

    try {

      const res = await API.get(
        "/notifications"
      );

      return res.data;

    } catch (error) {

      console.error(
        "Get Notifications Error:",
        error
      );

      throw error;

    }

  },

  /* ====================================== */
  /* MARK AS READ */
  /* ====================================== */

  markAsRead: async (id) => {

    try {

      const res = await API.put(

        `/notifications/${id}/read`

      );

      return res.data;

    } catch (error) {

      console.error(
        "Mark As Read Error:",
        error
      );

      throw error;

    }

  },

  /* ====================================== */
  /* MARK ALL AS READ */
  /* ====================================== */

  markAllAsRead: async () => {

    try {

      const res = await API.put(

        "/notifications/read-all"

      );

      return res.data;

    } catch (error) {

      console.error(
        "Mark All As Read Error:",
        error
      );

      throw error;

    }

  },

  /* ====================================== */
  /* DELETE NOTIFICATION */
  /* ====================================== */

  remove: async (id) => {

    try {

      const res = await API.delete(

        `/notifications/${id}`

      );

      return res.data;

    } catch (error) {

      console.error(
        "Delete Notification Error:",
        error
      );

      throw error;

    }

  },

};