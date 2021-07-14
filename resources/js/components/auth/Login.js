import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import FormHelper from '../../form/FormHelper';
import SendingBtn from '../../form/SendingBtn';
import api from '../../config/api';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            remember: true,
            need_vefification: null,
            verifyEmailMsg: null,
            isDisabled: false,
            formErrors: {
                email: null,
                password: null,
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.setState(FormHelper.handleInputChangeNewValue(event));
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.setState({ isDisabled: true });

        api.get('/sanctum/csrf-cookie')
            .then(() => {
                api.post('login', {
                    email: this.state.email,
                    password: this.state.password,
                    remember: this.state.remember,
                }).then((response) => {

                    if ('logged_in' in response.data) {

                        this.props.userStatusHandler();

                        this.props.history.push('/user-account');
                    } else if ('need_vefification' in response.data) {
                        this.setState({ need_vefification: true, isDisabled: false });
                    }

                }).catch((error) => {
                    if (error.response && error.response.status === 422) {
                        this.setState({
                            formErrors: FormHelper.updateFormErrors(this.state.formErrors, error.response.data.errors),
                            isDisabled: false,
                            password: ''
                        });
                    } else {
                        console.error(error);
                    }
                });
            });
    }

    componentDidMount() {
        let msg = localStorage.getItem('verify-email-msg');
        if (msg) {
            this.setState({ verifyEmailMsg: msg });
            localStorage.removeItem('verify-email-msg');
        }
    }

    input(name, type) {
        return <input
            name={name}
            type={type}
            value={this.state[name]}
            onChange={this.handleInputChange}
            className={FormHelper.inputClassName(this.state.formErrors[name])}
            disabled={this.state.isDisabled} />
    }

    inputError(name) {
        return <div className={FormHelper.feedbackClass(this.state.formErrors[name])}>
            {this.state.formErrors[name]}
        </div>
    }

    label(name, text) {
        return <label htmlFor={name} className="col-md-4 col-form-label text-md-right">{text}</label>
    }

    render() {

        return (
            <div className="row justify-content-center pt-5">
                <div className="col-md-8">
                    {this.state.need_vefification &&

                        <div className="alert alert-warning need_vefification">
                            Verify Your Email Address <br />
                            Before login, please check your email for a verification link.
                        </div>}

                    {this.state.verifyEmailMsg !== null && <div className="alert alert-info">After logging in, your email address will be confirmed.</div>}

                    <div className="card">
                        <div className="card-header bg-info">Login</div>

                        <div className="card-body">
                            <form method="POST" onSubmit={this.submitHandler}>

                                <div className="form-group row">
                                    {this.label('email', 'E-Mail')}
                                    <div className="col-md-6">
                                        {this.input('email', 'email')}
                                        {this.inputError('email')}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    {this.label('password', 'Password')}
                                    <div className="col-md-6">
                                        {this.input('password', 'password')}
                                        {this.inputError('password')}
                                    </div>

                                </div>
                                <div className="form-group row">
                                    <div className="col-md-6 offset-md-4">
                                        <div className="form-check">
                                            <input
                                                name="remember"
                                                type="checkbox"
                                                checked={this.state.remember}
                                                onChange={this.handleInputChange}
                                                disabled={this.state.isDisabled} />
                                            <label className="form-check-label pl-2" htmlFor="remember">
                                                Remember Me
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group row mb-0">
                                    <div className="col-md-8 offset-md-4">
                                        {this.state.isDisabled ?
                                            <SendingBtn />
                                            :
                                            <button type="submit" className="btn btn-primary" >
                                                Login
                                            </button>
                                        }
                                    </div>
                                </div>

                                <div className="form-group row mt-3">
                                    <div className="col-md-8 offset-md-4">
                                        <Link to="/password/forgot-password">Forgot Your Password?</Link>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Login);