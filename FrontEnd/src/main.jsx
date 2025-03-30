import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import HomePage from "./HomePage.jsx";
import Contact from "./Contact.jsx";
import APPP from "./APPP.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <APPP />
    <Contact />
    <App />
    <HomePage />
  </StrictMode>
);
