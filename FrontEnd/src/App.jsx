import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Contact from "./Contact";
import Pup from "./pup";
import Shop from "./shop";
import { Layout } from "./shared/layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/publications" element={<Pup />} />
        </Routes>
      </Layout>
    </Router>
  );
}
export default App;
