import Navbar from "./components/Navbar.jsx";
import {Routes,Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";
import {Loader} from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {

  const {authUser,isCheckingAuth,onlineUsers} = useAuthStore();
 

  const setUser = useAuthStore((state) => state.setUser);

 

   const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <div>
     <Navbar />
     <Routes>
      <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
      <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
      {/* <Route path="/settings" element={<SettingsPage />} /> */}
      <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
