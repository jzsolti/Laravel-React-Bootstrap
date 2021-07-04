import React from 'react';
import Loginform from './LoginForm';


class Login extends React.Component {

    render() {

        return (
            <div className="row justify-content-center pt-5"> 
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-info">Login</div>

                        <div className="card-body">
                            <Loginform />
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default Login;