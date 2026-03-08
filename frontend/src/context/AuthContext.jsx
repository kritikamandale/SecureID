import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("secureid_token") || null,
  );
  const [studentId, setStudentId] = useState(
    () => localStorage.getItem("secureid_student_id") || null,
  );
  const [userName, setUserName] = useState(
    () => localStorage.getItem("secureid_user_name") || null,
  );
  const [userEmail, setUserEmail] = useState(
    () => localStorage.getItem("secureid_user_email") || null,
  );
  const [userRole, setUserRole] = useState(
    () => localStorage.getItem("secureid_user_role") || null,
  );

  const isLoggedIn = !!token;

  const login = ({ access_token, student_id, name, email }) => {
    let role = "student";
    if (access_token) {
      try {
        const decoded = jwtDecode(access_token);
        role = decoded.role || "student";
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }

    localStorage.setItem("secureid_token", access_token);
    localStorage.setItem("secureid_user_role", role);
    if (student_id) localStorage.setItem("secureid_student_id", student_id);
    if (name) localStorage.setItem("secureid_user_name", name);
    if (email) localStorage.setItem("secureid_user_email", email);

    setToken(access_token);
    setUserRole(role);
    setStudentId(student_id);
    setUserName(name);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem("secureid_token");
    localStorage.removeItem("secureid_student_id");
    localStorage.removeItem("secureid_user_name");
    localStorage.removeItem("secureid_user_email");
    localStorage.removeItem("secureid_user_role");
    setToken(null);
    setStudentId(null);
    setUserName(null);
    setUserEmail(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        studentId,
        userName,
        userEmail,
        userRole,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
