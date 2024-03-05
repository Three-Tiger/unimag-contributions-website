import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const FullLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default FullLayout;
