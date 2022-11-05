import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth_service";

import Login from "./components/login_component";
import Register from "./components/register_component";
import Home from "./components/home_component";
import Profile from "./components/profile_component";
import BoardUser from "./components/board_user_component";
import BoardAdmin from "./components/board_admin_component";
import Clubs from "./components/clubs_component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showAdminBoard } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-success ">
          <Link to={"/"} className="navbar-brand">
            Serwis transferowy
          </Link>
          <div className="navbar-nav mr-auto d-flex justify-content-start">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Strona główna
              </Link>
            </li>

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Panel administratora
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  Panel użytkownika
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/clubs"} className="nav-link">
                  Kluby
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="col d-flex justify-content-end align-items-start navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  Profil
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  Wyloguj się
                </a>
              </li>
            </div>
          ) : (
              <div className="col d-flex justify-content-end align-items-start navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Logowanie
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Rejestracja
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<BoardUser />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/admin" element={<BoardAdmin />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
