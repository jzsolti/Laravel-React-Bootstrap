import React from 'react';
import FormHelper from '../../form/FormHelper';
import SendingBtn from '../../form/SendingBtn';
import { withRouter } from "react-router";
import api from '../../config/api';
import qs from 'querystring';



class ResetPassword extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            password_confirmation: '',
            isDisabled: false,
            status: null,
            formErrors: this.validationInputs()
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.setState(FormHelper.handleInputChangeNewValue(event));
    }

    componentDidMount() {
        let queryParams = qs.parse((this.props.location.search).split('?')[1]);

        if (queryParams.email) {
            this.setState({ email: queryParams.email });
        }
    }

    validationInputs(){
        return {
            email: null,
            password: null,
        };
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.setState({ isDisabled: true });

        api.post('password/reset-password', {
            token: this.props.match.params.token,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.password_confirmation,

        }).then((response) => {

            if ('status' in response.data) {

                this.setState({
                    isDisabled: false,
                    status: response.data.status,
                    formErrors: this.validationInputs(),
                    email: '',
                    password: '',
                    password_confirmation: '',
                });

            }

        }).catch((error) => {
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
            <div className="row justify-content-center pt-5">
                <div className="col-md-8">

                    {this.state.status !== null &&

                        <div className="alert alert-warning">
                            {this.state.status}
                        </div>}

                    <div className="card">
                        <div className="card-header">Reset Password</div>

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
                                                Send Password Reset Link
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

export default withRouter(ResetPassword);