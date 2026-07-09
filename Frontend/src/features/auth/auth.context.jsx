import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const authimg = [
    "/assets/authimgs/01_Gemini_Generated_Image.png",

    "/assets/authimgs/02_Gemini_Generated_Image.png",

    "/assets/authimgs/03_Gemini_Generated_Image.png",

    "/assets/authimgs/04_Gemini_Generated_Image.png",

    "/assets/authimgs/05_Gemini_Generated_Image.png",

    "/assets/authimgs/06_Gemini_Generated_Image.png",

    "/assets/authimgs/07_Gemini_Generated_Image.png",

    "/assets/authimgs/08_Gemini_Generated_Image.png",
  ];

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, setLoading, authimg }}
    >
      {children}
    </AuthContext.Provider>
  );
};
