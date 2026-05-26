// frontend/src/utils/role.js

export const getDashboardPath = (role) => {

  switch (role) {

    case "student":
      return "/student/dashboard";

    case "teacher":
      return "/teacher/dashboard";

    case "admin":
      return "/admin/dashboard";

    default:
      return "/login";

  }

};