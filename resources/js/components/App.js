import React from 'react';
import { BrowserRouter, Switch, Route, NavLink, Redirect, useParams } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';
import Home from './pages/Home';
import UserAccount from './pages/UserAccount';
import Articles from './pages/Articles';
import Page404 from './pages/Page404';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import Login from './auth/Login';
import Logout from './auth/Logout';
import Register from './auth/Register';
import VerifyEmail from './auth/VerifyEmail';
import api from '../config/api';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userLoggedIn: false,
            userVerified: false
        }

        this.userStatusHandler = this.userStatusHandler.bind(this)
    }

    componentDidMount() {
        this.checkUserStatus();
    }

    checkUserStatus() {
        api.post('user/status').then((response) => {
            if ('email_verified' in response.data) {
                this.setState({ userLoggedIn: true, userVerified: true });
            } else if ('logged_in' in response.data) {
                this.setState({ userLoggedIn: true, userVerified: false });
            } else if ('not_logged_id' in response.data) {
                this.setState({ userLoggedIn: false, userVerified: false });
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    userStatusHandler() {
        this.checkUserStatus();
    }

    render() {

        return <div>
            <BrowserRouter>
                <div className="container-fluid">

                    <header>
                        <Navbar bg="dark" variant="dark" expand="lg">
                            <Navbar.Brand >
                                <img
                                    alt=""
                                    src="/img/logo192.png"
                                    width="30"
                                    height="30"
                                    className="d-inline-block align-top"
                                />{' '}
                                Laravel-React-Bootstrap
                            </Navbar.Brand>

                            <Navbar.Toggle aria-controls="basic-navbar-nav" />

                            <Navbar.Collapse id="basic-navbar-nav" >
                                <Nav className="mr-auto" >
                                    <NavLink to="/" className="nav-link" exact>Home</NavLink>
                                    <NavLink to="/articles" className="nav-link" exact>Articles</NavLink>
                                    {this.state.userLoggedIn && <NavLink to="/user-account" className="nav-link" >Account</NavLink>}
                                    {!this.state.userLoggedIn && <NavLink to="/login" className="nav-link" >Login</NavLink>}
                                    {!this.state.userLoggedIn && <NavLink to="/register" className="nav-link" >Registration</NavLink>}

                                    {this.state.userLoggedIn && <Logout userStatusHandler={this.userStatusHandler} />}
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>

                    </header>

                    <div className="content pb-5">
                        <Switch>
                            <Route exact path="/" >
                                <Home />
                            </Route>
                            <Route path="/user-account" >
                                {this.state.userLoggedIn ? <UserAccount /> : <Page404 />}
                            </Route>
                            <Route path="/articles" >
                                <Articles />
                            </Route>

                            <Route path="/login" >
                                {this.state.userLoggedIn ? <Redirect to="/" /> : <Login userStatusHandler={this.userStatusHandler} />}
                            </Route>
                            <Route path="/register" >
                                {this.state.userLoggedIn ? <Redirect to="/" /> : <Register />}
                            </Route>
                            <Route path="/verify-email/:token" >
                                <VerifyEmail userStatusHandler={this.userStatusHandler} />
                            </Route>
                            <Route path="/password/forgot-password" >
                                {!this.state.userLoggedIn ? <ForgotPassword /> : <Redirect to="/" />}
                            </Route>
                            <Route path="/password/reset/:token" >
                                {!this.state.userLoggedIn ? <ResetPassword /> : <Redirect to="/" />}
                            </Route>
                            <Route path="*">
                                <Page404 />
                            </Route>

                        </Switch>
                    </div>

                </div>
            </BrowserRouter>
        </div>
    }
}

export default App;