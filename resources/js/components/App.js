import React from 'react';
import { BrowserRouter, Switch, Route, NavLink, Redirect, withRouter } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';
import Home from './pages/Home';
import UserAccount from './pages/UserAccount';
import Login from './auth/Login';
import Logout from './auth/Logout';
import Register from './auth/Register';

class App extends React.Component {

    constructor(props) {
        super(props);
       
    }

    render() {
        
       let userLoggedin = localStorage.getItem('user_loggedin') !== null;

        return <div>
            <BrowserRouter>
                <div className="container-fluid">

                    <header>
                        <Navbar bg="dark" variant="dark" expand="lg">
                            <Navbar.Brand href="#home">
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
                                    {userLoggedin && <NavLink to="/user-account" className="nav-link" >UserAccount</NavLink>}
                                    {!userLoggedin && <NavLink to="/login" className="nav-link" >Login</NavLink>}
                                    {!userLoggedin && <NavLink to="/register" className="nav-link" >Registration</NavLink>}
                                    <Logout />
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>

                    </header>

                    <div className="content pb-5">
                        <Switch>
                        <Route path="/user-account" >
                                {userLoggedin ? <UserAccount /> :  <Redirect to="/login" />}
                            </Route>
                            <Route path="/login" >
                                {userLoggedin ? <Redirect to="/" /> : <Login />}
                            </Route>
                            <Route path="/register" >
                                {userLoggedin ? <Redirect to="/" /> : <Register />}
                            </Route>

                            <Route path="/" >
                                <Home />
                            </Route>
                        </Switch>
                    </div>

                </div>
            </BrowserRouter>
        </div>
    }
}

export default App;