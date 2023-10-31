import React from "react";
import logo from "./logo.svg";
import "./App.css";
import RepositoryAnalyzer from "./views/RepositoryAnalyzer";
import UserDashboard from "./views/UserDashboard";
import Register from "./components/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./views/Login";
import Analyzer from "./views/Analyzer";
import Hero from "./views/Hero";
import CriticalValues from "./views/CriticalValues";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  // const [loggedIn, setLoggedIn] = React.useState(false);
  const { user, isAuthenticated, isLoading } = useAuth0();

  return (
    <>
      <Navbar />
     
        {true ? (
          <div>
             <Routes>
              <Route path="/analyzer" element={<Analyzer />} />
              <Route path="/repo-analyser" element={<RepositoryAnalyzer />} />
              <Route path="/user-analyser" element={<UserDashboard />} />
              <Route path="/critical-values" element={<CriticalValues />} />
            </Routes>
          </div>
        ) : (
         <Routes> <Route path="/login" element={<Login /> } /></Routes>
        )}
        <Routes><Route path="/" element={<Hero />} /></Routes>
    </>
  );
}

export default App;

/*

followers: https://api.github.com/users/Ashish-AVS/followers
first repo created: https://api.github.com/users/Ashish-AVS/repos, first activity
last repo created: https://api.github.com/users/Ashish-AVS/repos, last activity
https://api.github.com/repos/Ashish-AVS/Car-Parking-Backend/stats/code_frequency: Weekly commits into that repo
https://api.github.com/repos/Ashish-AVS/Car-Parking-Backend/stats/code_frequency: Commits in each month
https://api.github.com/repos/Ashish-AVS/Car-Parking-Backend/stats/contributors: His contribution frequency
*/

