
import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "smarthire_token";
const USER_KEY = "smarthire_user";

function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function isTokenExpired(token) {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return true;
    }

    const payload = JSON.parse(
      atob(
        parts[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/")
          .padEnd(Math.ceil(parts[1].length / 4) * 4, "=")
      )
    );

    // JWT expiration is measured in seconds.
    return (
      typeof payload.exp !== "number" ||
      payload.exp * 1000 <= Date.now()
    );
  } catch {
    return true;
  }
}

function readStoredSession() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userText = localStorage.getItem(USER_KEY);

    if (!token || !userText || isTokenExpired(token)) {
      clearStoredSession();
      return { token: null, user: null };
    }

    const user = JSON.parse(userText);

    if (
      !user ||
      !["CANDIDATE", "RECRUITER", "ADMIN"].includes(user.role)
    ) {
      clearStoredSession();
      return { token: null, user: null };
    }

    return { token, user };
  } catch {
    clearStoredSession();
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  const { token, user } = session;

  function login(authResponse) {
    const receivedToken =
      authResponse?.token ??
      authResponse?.accessToken ??
      authResponse?.jwt;

    if (
      typeof receivedToken !== "string" ||
      !receivedToken.trim()
    ) {
      throw new Error(
        "Login failed: backend did not return an authentication token."
      );
    }

    if (isTokenExpired(receivedToken)) {
      throw new Error(
        "Login failed: backend returned an invalid or expired JWT."
      );
    }

    const receivedRole = String(
      authResponse?.role ??
      authResponse?.user?.role ??
      ""
    )
      .replace(/^ROLE_/, "")
      .toUpperCase();

    if (
      !["CANDIDATE", "RECRUITER", "ADMIN"].includes(receivedRole)
    ) {
      throw new Error(
        "Login failed: backend did not return a valid user role."
      );
    }

    const receivedUser = {
      id:
        authResponse.id ??
        authResponse.userId ??
        authResponse.user?.id ??
        null,

      email:
        authResponse.email ??
        authResponse.user?.email ??
        "",

      name:
        authResponse.name ??
        authResponse.username ??
        authResponse.user?.name ??
        "",

      role: receivedRole,
    };

    localStorage.setItem(TOKEN_KEY, receivedToken);
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(receivedUser)
    );

    setSession({
      token: receivedToken,
      user: receivedUser,
    });
  }

  function logout() {
    clearStoredSession();

    setSession({
      token: null,
      user: null,
    });
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [user, token]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}
