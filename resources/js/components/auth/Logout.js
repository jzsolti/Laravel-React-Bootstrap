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
            
            this.props.userStatusHandler();
            this.props.history.push('/');

        }).catch((error) => {
            console.error(error);
        });
    }

    render(){
        return <a className="nav-link" onClick={this.logoutHandler} href="#" aria-current="page">Logout</a>
    }
}
export default withRouter(Logout);