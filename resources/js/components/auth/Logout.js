import React from 'react';
import {  withRouter } from "react-router-dom";
import api from '../../config/api';

class Logout extends React.Component {

    constructor(props) {
        super(props);
    }

    logoutHandler = (event) => {
        event.preventDefault();

        api.post('logout').then((response) => {
            localStorage.clear();
            this.props.history.push('/');

        }).catch((error) => {
            console.error(error);
        });
    }

    render(){
        let userLoggedin = localStorage.getItem('user_loggedin') !== null;

        return userLoggedin && <a className="nav-link" onClick={this.logoutHandler} href="#" aria-current="page">Logout</a>
    }
}
export default withRouter(Logout);