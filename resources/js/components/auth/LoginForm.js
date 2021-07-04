import React from 'react';
import {withRouter} from 'react-router-dom';
import FormHelper from '../../form/FormHelper';
import api from '../../config/api';

class Loginform extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            remember: true,
            formErrors: {
                email: null,
                password: null,
            }
        };

        //localStorage.clear();


        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.setState(FormHelper.handleInputChangeNewValue(event));
    }

    submitHandler = (event) => {
        event.preventDefault();

        api.get('/sanctum/csrf-cookie')
            .then(() => {
                api.post('login', {
                    email: this.state.email,
                    password: this.state.password,
                    remember: this.state.remember,
                }).then((response) => {
// aaa@aa.gg 
                    if ('user' in response.data) {
                       
                       localStorage.setItem('user_loggedin', 1);
                        //localStorage.setItem('user_email_verified', response.user.email_verified);
                        //localStorage.setItem('user_name', response.user.name);
                        //localStorage.setItem('user_email', response.user.email);
                        this.props.history.push('/');
                       
                    }

                }).catch((error) => {
                    if (error.response && error.response.status === 422) {
                        this.setState({
                            formErrors: FormHelper.updateFormErrors(this.state.formErrors, error.response.data.errors)
                        });
                    } else {
                        //console.error(error);
                    }
                });
            });
    }

    render() {

        return (
            <form method="POST" onSubmit={this.submitHandler}>
                <div className="form-group row">
                    <label htmlFor="email" className="col-md-4 col-form-label text-md-right">E-Mail</label>
                    <div className="col-md-6">
                        <input
                            name="email"
                            type="email"
                            value={this.state.email}
                            onChange={this.handleInputChange}
                            className={FormHelper.inputClassName(this.state.formErrors.email)} />

                        <div className={FormHelper.feedbackClass(this.state.formErrors.email)}>
                            {this.state.formErrors.email}
                        </div>
                    </div>
                </div>

                <div className="form-group row">
                    <label htmlFor="password" className="col-md-4 col-form-label text-md-right">Password</label>
                    <div className="col-md-6">
                        <input
                            name="password"
                            type="password"
                            value={this.state.password}
                            onChange={this.handleInputChange}
                            className={FormHelper.inputClassName(this.state.formErrors.password)} />
                        <div className={FormHelper.feedbackClass(this.state.formErrors.password)}>
                            {this.state.formErrors.password}
                        </div>

                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-md-6 offset-md-4">
                        <div className="form-check">
                            <input
                                name="remember"
                                type="checkbox"
                                checked={this.state.remember}
                                onChange={this.handleInputChange} />

                            <label className="form-check-label pl-2" htmlFor="remember">
                                Remember Me
                            </label>
                        </div>
                    </div>
                </div>

                <div className="form-group row mb-0">
                    <div className="col-md-8 offset-md-4">
                        <button type="submit" className="btn btn-primary">
                            Login
                        </button>

                    </div>
                </div>
            </form>
        );
    }
}
export default withRouter(Loginform);