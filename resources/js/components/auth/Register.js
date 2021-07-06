import React from 'react';
import { withRouter } from 'react-router-dom';
import api from '../../config/api';
import FormHelper from '../../form/FormHelper';

class Register extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            remember: true,
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

        const formData = JSON.parse(JSON.stringify(this.state));
        delete formData.formErrors;

        api.post('register', formData)
            .then((response) => {

                if ('logged_in' in response.data) {
                    this.props.userStatusHandler();
                }

            }).then(() => {
                this.props.history.push('/user-account');
            })
            .catch((error) => {
                if (error.response && error.response.status === 422) {
                    this.setState({
                        formErrors: FormHelper.updateFormErrors(this.state.formErrors, error.response.data.errors)
                    });
                } else {
                    console.error(error);
                }
            });
    }

    render() {
        return (
            <div className="row justify-content-center pt-5">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-info">Registration</div>
                        <div className="card-body">
                            <form method="POST" onSubmit={this.submitHandler}>
                                <div className="form-group row">
                                    <label htmlFor="name" className="col-md-4 col-form-label text-md-right">Name</label>
                                    <div className="col-md-6">
                                        <input
                                            name="name"
                                            type="text"
                                            value={this.state.name}
                                            onChange={this.handleInputChange}
                                            className={FormHelper.inputClassName(this.state.formErrors.name)} />
                                        <div className={FormHelper.feedbackClass(this.state.formErrors.name)}>
                                            {this.state.formErrors.name}
                                        </div>
                                    </div>
                                </div>
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
                                    <label htmlFor="password_confirmation" className="col-md-4 col-form-label text-md-right">Password confirmation</label>
                                    <div className="col-md-6">
                                        <input
                                            name="password_confirmation"
                                            type="password"
                                            value={this.state.password_confirmation}
                                            onChange={this.handleInputChange}
                                            className="form-control" />

                                    </div>
                                </div>

                                <div className="form-group row mb-0">
                                    <div className="col-md-8 offset-md-4">
                                        <button type="submit" className="btn btn-primary">
                                            Register
                                        </button>

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