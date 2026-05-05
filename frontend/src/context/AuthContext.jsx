import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };

    case "LOGIN_FAIL":
    case "REGISTER_FAIL":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
        token: null,
        error: null,
        loading: false,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "RESTORE_TOKEN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // In a real app, you'd verify the token with the backend here
      const user = localStorage.getItem("user");
      dispatch({
        type: "RESTORE_TOKEN",
        payload: {
          token,
          user: user ? JSON.parse(user) : null,
        },
      });
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: { token, user },
    });
  };

  const register = (token, user) => {
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({
      type: "REGISTER_SUCCESS",
      payload: { token, user },
    });
  };

  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  const setError = (error) => {
    dispatch({ type: "SET_ERROR", payload: error });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
