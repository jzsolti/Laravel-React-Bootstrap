import React from 'react';
import { BrowserRouter, Switch, Route, NavLink, Redirect, useParams } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';
import Home from './pages/Home';
import UserAccount from './pages/UserAccount';
import Login from './auth/Login';
import Logout from './auth/Logout';
import Register from './auth/Register';
import api from '../config/api';

function VerifyEmail(){
    let { token } = useParams();
                             
    return (
      <div>
        <h3>token: {token}</h3>
      </div>
    );
}

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userLoggedIn: false
        }

        this.userLoggedInHandler = this.userLoggedInHandler.bind(this)
    }

    componentDidMount() {
        this.checkLoggedIn();
    }

    checkLoggedIn() {
        api.post('loggedin').then((response) => {
            this.setState({userLoggedIn: ('logged_in' in response.data)});
        }).catch((error) => {
            console.error(error);
        });
    }

    userLoggedInHandler() {
        this.checkLoggedIn();
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
                                    {this.state.userLoggedIn && <NavLink to="/user-account" className="nav-link" >Account</NavLink>}
                                    {!this.state.userLoggedIn && <NavLink to="/login" className="nav-link" >Login</NavLink>}
                                    {!this.state.userLoggedIn && <NavLink to="/register" className="nav-link" >Registration</NavLink>}
                                    
                                    {this.state.userLoggedIn && <Logout userLoggedInHandler={this.userLoggedInHandler}/>}
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>

                    </header>

                    <div className="content pb-5">
                        <Switch>
                            <Route path="/user-account" >
                                {this.state.userLoggedIn ? <UserAccount /> : <Redirect to="/login" />}
                            </Route>
                            <Route path="/login" >
                                {this.state.userLoggedIn ? <Redirect to="/" /> : <Login userLoggedInHandler={this.userLoggedInHandler} />}
                            </Route>
                            <Route path="/register" >
                                {this.state.userLoggedIn ? <Redirect to="/" /> : <Register userLoggedInHandler={this.userLoggedInHandler}/>}
                            </Route>
                            <Route path="/verify-email/:token" >
                               
                                   {<VerifyEmail />}
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