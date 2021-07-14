import React from 'react';
import FormHelper from '../../form/FormHelper';
import SendingBtn from '../../form/SendingBtn';
import api from '../../config/api';

class ForgotPassword extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            isDisabled: false,
            status: null,
            formErrors: this.validationInputs()
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    validationInputs(){
        return {
            email: null
        };
    }

    handleInputChange(event) {
        this.setState(FormHelper.handleInputChangeNewValue(event));
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.setState({ isDisabled: true });

        api.post('password/send-resetlink-email', {
            email: this.state.email
        }).then((response) => {
           
            if ('status' in response.data) {
               
                this.setState({
                    isDisabled: false,
                    status: response.data.status,
                    formErrors: this.validationInputs(),
                    email: ''
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

    render() {

        return (
            <div className="row justify-content-center pt-5">
                <div className="col-md-8">

                    {this.state.status !== null &&

                        <div className="alert alert-warning need_vefification">
                            {this.state.status}
                        </div>}

                    <div className="card">
                        <div className="card-header">Forgot Password</div>

                        <div className="card-body">
                            <form method="POST" onSubmit={this.submitHandler}>

                                <div className="form-group row">
                                    <label htmlFor="email" className="col-md-4 col-form-label text-md-right">E-Mail</label>
                                    <div className="col-md-6">
                                        <input
                                            name="email"
                                            type="email"
                                            value={this.state.email}
                                            onChange={this.handleInputChange}
                                            className={FormHelper.inputClassName(this.state.formErrors.email)}
                                            disabled={this.state.isDisabled} />

                                        <div className={FormHelper.feedbackClass(this.state.formErrors.email)}>
                                            {this.state.formErrors.email}
                                        </div>
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

export default ForgotPassword;