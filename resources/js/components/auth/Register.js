import React from 'react';
import { withRouter } from 'react-router-dom';
import api from '../../config/api';
import FormHelper from '../../form/FormHelper';
import SendingBtn from '../../form/SendingBtn';

class Register extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            remember: true,
            registrationSuccess: false,
            isDisabled: false,
            formErrors: {
                name: null,
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

        const formData = JSON.parse(JSON.stringify(this.state));
        delete formData.formErrors;

        api.post('register', formData)
            .then((response) => {
                if ('success' in response.data) {
                    this.setState({ registrationSuccess: true });
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 422) {
                    this.setState({
                        formErrors: FormHelper.updateFormErrors(this.state.formErrors, error.response.data.errors),
                        isDisabled: false
                    });
                } else {
                    console.error(error);
                }
            });
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

            this.state.registrationSuccess ?
                <div className="alert alert-success">
                    A fresh verification link has been sent to your email address. Check your email for a verification link.
                    </div>
                :
                <div className="row justify-content-center pt-5">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header bg-info">Registration</div>
                            <div className="card-body">
                                <form method="POST" onSubmit={this.submitHandler}>
                                    <div className="form-group row">
                                        {this.label('name', 'Name')}
                                        <div className="col-md-6">
                                            {this.input('name', 'text')}
                                            {this.inputError('name')}
                                        </div>
                                    </div>
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
                                        {this.label('password_confirmation', 'Password confirmation')}
                                        <div className="col-md-6">
                                            {this.input('password_confirmation', 'password')}
                                        </div>
                                    </div>

                                    <div className="form-group row mb-0">
                                        <div className="col-md-8 offset-md-4">
                                            {this.state.isDisabled ?
                                                <SendingBtn />
                                                :
                                                <button type="submit" className="btn btn-primary" >
                                                    Register
                                                </button>
                                            }
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

export default withRouter(Register);