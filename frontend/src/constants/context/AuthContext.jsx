import {

  createContext,

  useContext,

  useState,

  useEffect,

} from "react";

import API from "../../api/axios";

const AuthContext =
  createContext(null);

export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /* ================================================= */
  /* CHECK AUTH ON APP START */
  /* ================================================= */

  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {

      checkAuthStatus();

    } else {

      setLoading(false);

    }

  }, []);

  /* ================================================= */
  /* VERIFY CURRENT USER */
  /* ================================================= */

  const checkAuthStatus =
    async () => {

      try {

        const res =
          await API.get(
            "/auth/me"
          );

        setUser(
          res.data.user
        );

      } catch (error) {

        console.log(
          "Auth check failed:",
          error
        );

        logout();

      } finally {

        setLoading(false);

      }

    };

  /* ================================================= */
  /* LOGIN */
  /* ================================================= */

  const login = async (
    email,
    password
  ) => {

    const res =
      await API.post(
        "/auth/login",
        {

          email,

          password,

        }
      );

    /* SAVE TOKEN */

    localStorage.setItem(
      "token",
      res.data.token
    );

    /* SAVE USER */

    setUser(
      res.data.user
    );

    return res.data.user;

  };

  /* ================================================= */
  /* REGISTER */
  /* ================================================= */

  const register = async (
    formData
  ) => {

    const res =
      await API.post(
        "/auth/register",
        formData
      );

    /* SAVE TOKEN */

    localStorage.setItem(
      "token",
      res.data.token
    );

    /* SAVE USER */

    setUser(
      res.data.user
    );

    return res.data.user;

  };

  /* ================================================= */
  /* LOGOUT */
  /* ================================================= */

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    setUser(null);

    window.location.href =
      "/login";

  };

  /* ================================================= */
  /* PROVIDER */
  /* ================================================= */

  return (

    <AuthContext.Provider
      value={{

        user,

        setUser,

        login,

        register,

        logout,

        loading,

      }}
    >

      {!loading && children}

    </AuthContext.Provider>

  );

};

/* ================================================= */
/* CUSTOM HOOK */
/* ================================================= */

export const useAuth = () => {

  return useContext(
    AuthContext
  );

};