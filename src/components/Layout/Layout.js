import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import {Helmet} from "react-helmet";

const Layout = ({ children ,title}) => {
  return (
    <>
    <Helmet>
                <meta charSet="utf-8" />
                <title>{title}</title>
            </Helmet>
      <Header />
      <main style={{ minHeight: "80vh" }}>{children}</main>
      <Footer />
    </>
  );
};
Layout.defaultProps={
  title: "HouseMart-Home"
}
export default Layout;
