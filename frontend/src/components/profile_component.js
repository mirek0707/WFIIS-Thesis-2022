import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth_service";

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: null,
            userReady: false,
            currentUser: { username: "" }
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) this.setState({ redirect: "/home" });
        this.setState({ currentUser: currentUser, userReady: true })
    }

    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} />
        }

        const { currentUser } = this.state;

        return (
            <div className="container" style={{ padding: "3rem 0rem" }}>
                {(this.state.userReady) ?
                    <div>
                        <header className="jumbotron">
                            <h3>
                                Profil użytkownika <strong>{currentUser.username}</strong> 
                            </h3>
                        </header>
                        <p>
                            <strong>Nazwa użytkownika:</strong>{" "}
                            {currentUser.username}
                        </p>
                        {/* <p>
                            <strong>Token:</strong>{" "}
                            {currentUser.accessToken.substring(0, 20)} ...{" "}
                            {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
                        </p>
                        <p>
                            <strong>Id:</strong>{" "}
                            {currentUser.id}
                        </p> */}
                        <p>
                            <strong>E-mail:</strong>{" "}
                            {currentUser.email}
                        </p>
                        <strong>Dostęp:</strong>
                        <ul>
                            {currentUser.roles &&
                                currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
                        </ul>
                    </div> : null}
            </div>
        );
    }
}
