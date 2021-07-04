import React from 'react';
import Registerform from './Registerform';

class Register extends React.Component {

    render() {
        return (
            <div className="row justify-content-center pt-5">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-info">Registration</div>
                        <div className="card-body">
                            <Registerform />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register;