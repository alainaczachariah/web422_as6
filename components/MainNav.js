import React from "react";
import { Navbar, Nav, Form, FormControl, Button, Container } from "react-bootstrap";
import { useRouter } from "next/router";
import { NavDropdown } from "react-bootstrap";
import { useAtom } from "jotai";
import { useState } from "react";
import Link from "next/link";
import { searchHistoryAtom } from "../store";
import { removeToken, readToken } from "../lib/authenticate";
import { addToHistory } from "../lib/userData";

export default function MainNav() {
  const router = useRouter();
  const [searchField, setSearchField] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  let token = readToken();

  async function submitForm(e) {
    e.preventDefault();

    if (searchField != "") {
        router.push(`/artwork?title=true&q=${searchField}`);
        setSearchField("");
        setIsExpanded(false);
        setSearchHistory(await addToHistory(`title=true&q=${searchField}`));
        // setSearchHistory(current => [...current, `title=true&q=${searchField}`]);
      }
    }

  function logout(e) {
    e.preventDefault();
    removeToken();
    router.push("/login");
  }

  
  return (
    <>
      <Navbar
        expand="lg"
        className="fixed-top navbar-dark bg-primary"
        expanded={isExpanded}
      >
        <Container>
          <Navbar.Brand href="/">Alaina C Zachariah</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setIsExpanded((e) => !e)}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref>
                <Nav.Link
                  active={router.pathname === "/"}
                  onClick={() => setIsExpanded(false)}>
                  Home
                </Nav.Link>
              </Link>
              {token && (
                <Link href="/search" passHref>
                  <Button
                    active={router.pathname === "/search"}
                    onClick={() => setIsExpanded(false)}
                  >&nbsp;Advanced Search</Button>
                </Link>
              )}
            </Nav>
            &nbsp;
            <Form className="d-flex" onSubmit={submitForm}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
              />
              <Button type="submit" variant="success">
                Search
              </Button>
            </Form>
            &nbsp;
            {token && (
              <Nav>
                <NavDropdown title={token.userName} id="basic-nav-dropdown">
                  <Link href="/favourites" passHref>
                    <NavDropdown.Item
                      active={router.pathname === "/favourites"}
                      onClick={() => setIsExpanded(false)}
                    >
                      Favourites
                    </NavDropdown.Item>
                  </Link>

                  <Link href="/history" passHref>
                    <NavDropdown.Item
                      active={router.pathname === "/history"}
                      onClick={() => setIsExpanded(false)}
                    >
                      Search History
                    </NavDropdown.Item>
                  </Link>
                  <NavDropdown.Item
                    onClick={() => {
                      logout();
                      setIsExpanded(false);
                    }}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )}
             {!token && (
            <Link href="/login" passHref>
              <Button
                variant="outline-success"
                active={router.pathname === "/login"}
                onClick={() => setIsExpanded(false)}
              >&nbsp;
                Login
              </Button>
            </Link>
          )}
          &nbsp;&nbsp;
          {!token && (
            <Link href="/register" passHref>
                <Button
                variant="outline-success"
                active={router.pathname === "/register"}
                onClick={() => setIsExpanded(false)}
              >&nbsp;
                Register
              </Button>
            </Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
      <br />
      <br />
      <br />
    </>
  );
}
