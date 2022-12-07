import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth_service";
import AuthVerify from "./common/auth_verify";

import Login from "./components/login_component";
import Register from "./components/register_component";
import Home from "./components/home_component";
import Animation from "./components/animation_component";
import Profile from "./components/profile_component";
import BoardUser from "./components/board_user_component";
import BoardAdmin from "./components/board_admin_component";
import Clubs from "./components/clubs_component";
import Players from "./components/players_component";
import Transfers from "./components/transfers_component";

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
      <div className="main">
        <nav className="navbar navbar-expand navbar-dark bg-success ">
          <Link to={"/"} className="navbar-brand">
            <img
              alt=""
              src="logo2.png"
              height="30 px"
              className="d-inline-block align-top"
            />{' '}
            TransferSite
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

            {/* currentUser && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  Panel użytkownika
                </Link>
              </li>
            ) */}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/clubs"} className="nav-link">
                  Kluby
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/players"} className="nav-link">
                  Zawodnicy
                </Link>
              </li>
            )}
            {currentUser && (
              <li className="nav-item">
                <Link to={"/transfers"} className="nav-link">
                  Transfery
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
        
        <div className="container mt-3 p-0" style={{ maxWidth: "100%" }}>
          <Routes>
            <Route path="/" element={<Animation />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<BoardUser />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/Players" element={<Players />} />
            <Route path="/Transfers" element={<Transfers />} />
            <Route path="/admin" element={<BoardAdmin />} />
          </Routes>
        </div>

        <footer className="py-3 my-4">
          <ul className="nav justify-content-center border-bottom pb-3 mb-3">
            <li className="nav-item"><Link to={"/"} className="nav-link px-2 text-muted">Strona startowa</Link></li>
            <li className="nav-item"><Link to={"/home"} className="nav-link px-2 text-muted">Strona główna</Link></li>
            {showAdminBoard && (
              <li className="nav-item"><Link to={"/admin"} className="nav-link px-2 text-muted">Panel administratora</Link></li>
            )}
           {/*  {currentUser && (
              <li className="nav-item"><Link to={"/user"} className="nav-link px-2 text-muted">Panel użytkownika</Link></li>
            )} */}
            {currentUser && (
              <li className="nav-item"><Link to={"/clubs"} className="nav-link px-2 text-muted">Kluby</Link></li>
            )}

            {currentUser && (
              <li className="nav-item"><Link to={"/players"} className="nav-link px-2 text-muted">Zawodnicy</Link></li>
            )}
            {currentUser && (
              <li className="nav-item"><Link to={"/transfers"} className="nav-link px-2 text-muted">Transfery</Link></li>
            )}

            {currentUser ? (
                <li className="nav-item"><Link to={"/profile"} className="nav-link px-2 text-muted">Profil</Link></li>
            ) : (
              <>
                <li className="nav-item"><Link to={"/login"} className="nav-link px-2 text-muted">Logowanie</Link></li>
                <li className="nav-item"><Link to={"/register"} className="nav-link px-2 text-muted">Rejestracja</Link></li>
              </>
            )}
          </ul>
          <p className="text-center text-muted">2022, Mirosław Kołodziej</p>
        </footer>

        <AuthVerify logOut={this.logOut} />
      </div>
    );
  }
}

export default App;
