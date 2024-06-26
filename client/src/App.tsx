import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { themeSettings } from "./theme";
import Navbar from "@/scenes/navbar";
import Dashboard from "@/scenes/dashboard";
import Predictions from "@/scenes/predictions";
import Login from "@/scenes/Login";
import Signup from "@/scenes/Signup";
import Admin from "@/scenes/Admin";
import FinsightLogo from "@/components/FinsightLogo";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function App() {
  const theme = useMemo(() => createTheme(themeSettings), []);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <MainContent />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

function MainContent() {
  const location = useLocation();
  const auth = useAuth();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <Box width="100%" height="100%" padding="1rem 2rem 4rem 2rem">
      {!hideNavbar && <Navbar />}
      {hideNavbar && (
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <FinsightLogo /> {/* Display the Finsight logo */}
        </Box>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={auth?.isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/predictions" element={auth?.isAuthenticated ? <Predictions /> : <Navigate to="/login" />} />
        <Route path="/admin" element={auth?.isAuthenticated ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/" element={auth?.isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Box>
  );
}

export default App;
