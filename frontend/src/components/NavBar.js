import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { signOut, getAuth } from "firebase/auth";
import app from "../fire";

const NavBar = () => {
  const auth = getAuth(app);
  const signoutHandler = () => {
    signOut(auth);
    if (localStorage.getItem("authUser")) {
      localStorage.removeItem("authUser");
    }
  };
  return (
    <div className="nav-ba">
      <Navbar bg="dark" expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="justify-content-end">
            <NavDropdown
              title={true ? "jkj" : "jhjh"}
              style={{ padding: "1rem", fontSize: "2rem" }}
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4" onClick={signoutHandler}>
                התנתק
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Brand href="#home" style={{ fontSize: "3rem" }}>
          React-Bootstrap
        </Navbar.Brand>
      </Navbar>
    </div>
  );
};

export default NavBar;
