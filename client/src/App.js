import React, {useEffect, useState} from "react";
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from "axios";
import Welcome from "./pages/Welcome";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Admin from "./pages/Admin";
import Contact from "./pages/Contact.js";
import Inventory from "./pages/Inventory";
import InventoryFill from "./pages/InventoryFill";
import UserContext from "./context/userContext";
import Profit from "./pages/Profit"

function App() {
  const [user, setUser] = useState({
    token: undefined,
    user: undefined,
  });
 

  useEffect(()=> {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token="";
      }
      const tokenRes = await axios.post(
        "/api/user/validate",
        null,
        { headers: { "x-auth-token": token } }
      );
      // console.log(tokenRes.data);
      if (tokenRes.data) {
        const userRes = await axios.get(
          "/api/user", 
          { headers: { "x-auth-token": token } }
        );
        setUser({
          token, 
          user: userRes.data,
        });
      }
    };

    checkLoggedIn();
  }, []);
  
  return (

    <Router>
      <UserContext.Provider value={{ user, setUser }}>
        <Route exact path="/inventory" component={Inventory} /> 
        <Route exact path="/" component={Welcome} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/admin " component={Admin} />
        <Route exact path="/inventoryfill" component={InventoryFill} />
        <Route exact path="/profitandloss" component={Profit} />
      </UserContext.Provider>
    </Router>

  )
}

export default App;
