import React from 'react';
import api from '../../config/api';
import FormHelper from '../../form/FormHelper';
import SendingBtn from '../../form/SendingBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

class UserAccount extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            created: '',
            isDisabled: false,
            formErrors: this.validationInputs(),
            success: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        api.get('user-account/get-user')
            .then((response) => {
                this.setState({
                    name: response.data.name,
                    email: response.data.email,
                    created: response.data.created,
                });

            })
            .catch((error) => {
                console.error(error);
            });
    }

    validationInputs() {
        return {
            name: null,
            email: null,
            password: null,
        };
    }

    handleInputChange(event) {
        this.setState(FormHelper.handleInputChangeNewValue(event));
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.setState({ isDisabled: true });

        api.post('user-account/update', {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.password_confirmation,
        }).then((response) => {
            if ('success' in response.data) {
                this.setState({
                    formErrors: this.validationInputs(),
                    success: true,
                    isDisabled: false
                });

                setTimeout(() => { this.setState({ success: false }); }, 5000);
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

                    {this.state.success &&
                        <div className="alert alert-success">
                            Success
                        </div>}

                    <div className="card">
                        <div className="card-header bg-warning d-flex justify-content-between">
                             <span>Account</span> 
                             <span><FontAwesomeIcon icon={faCalendarAlt} />  {this.state.created} </span>
                             </div>
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
                                                Update
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

export default UserAccount;