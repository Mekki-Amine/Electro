import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import Contact from "./Contact";
import Pup from "./pup";
import { Navbar } from "./shared/nav";
import Shop from "./shop";
import { Footer } from "./shared/footer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/publications" element={<Pup />} />
      </Routes>
      <Footer />
    </Router>
  );
}
export default App;
