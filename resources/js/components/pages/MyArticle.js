import React from 'react';
import { withRouter } from "react-router";
import api from '../../config/api';
import FormHelper from '../../form/FormHelper';
import SendingBtn from '../../form/SendingBtn';

class MyArticle extends React.Component {

    constructor(props) {
        super(props);

        this.inputs = ['title', 'lead', 'content'];

        this.state = {
            created: false,
            updated: false,
            isDisabled: false,
            formErrors: {
                title: null,
                lead: null,
                content: null,
            }
        };

        this.inputs.forEach((item) => {
            this.state[item] = '';
        });

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {

        let articleId = this.getId();
        if (articleId !== null) {
            api.get(`user/article/${articleId}`)
                .then((response) => {

                    let updateState = {};
                    this.inputs.forEach((item) => {
                        updateState[item] = response.data[item]
                    });
                    this.setState(updateState);

                }).catch((error) => {
                    if (error.response && error.response.status === 404) {
                        this.props.history.push('/_404');
                    } else {
                        console.error(error);
                    }
                });
        }

    }

    getId() {
        return (typeof this.props.match.params.id === 'undefined') ? null : this.props.match.params.id;
    }

    handleInputChange(event) {
        this.setState(FormHelper.handleInputChangeNewValue(event));
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

    submitHandler = (event) => {
        event.preventDefault();
        this.setState({ isDisabled: true });

        const action = (this.getId() === null) ? 'user/article/create' : `user/article/${this.getId()}/update`;

        api.post(action, FormHelper.getFormData(this.inputs, this.state))
            .then((response) => {
                if ('id' in response.data) {
                    this.setState({ isDisabled: false, created: true });

                    setTimeout(() => { this.setState({ created: false }); }, 5000);

                    this.props.history.push(`/user/article/${response.data.id}`);
                }

                if ('updated' in response.data) {
                    this.setState({ isDisabled: false, updated: true, formErrors: FormHelper.resetValidation(this.inputs) });
                    setTimeout(() => { this.setState({ updated: false }); }, 5000);
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

    textarea(name, rows = 4, cols = 50) {
        return <textarea
            name={name}
            rows={rows}
            cols={cols}
            onChange={this.handleInputChange}
            disabled={this.state.isDisabled}
            className={FormHelper.inputClassName(this.state.formErrors[name])}
            value={this.state[name]} />
    }

    inputError(name) {
        return <div className={FormHelper.feedbackClass(this.state.formErrors[name])}>
            {this.state.formErrors[name]}
        </div>
    }

    label(name, text) {
        return <label htmlFor={name} className="">{text}</label>
    }

    render() {

        return (
            <div className="row justify-content-center pt-5">
                <div className="col-md-8">

                    {this.state.created && <div className="alert alert-success">New article created </div>}
                    {this.state.updated && <div className="alert alert-success">Article updated </div>}

                    <div className="card">
                        <div className="card-header bg-warning d-flex justify-content-between">
                            <div>{this.getId() === null ? 'New article' : 'Edit article'} </div>
                            <div> </div>
                        </div>

                        <div className="card-body">

                            <form method="POST" onSubmit={this.submitHandler}>
                                <div className="form-group">
                                    {this.label('title', 'Title')}
                                    {this.input('title', 'text')}
                                    {this.inputError('title')}
                                </div>

                                <div className="form-group">
                                    {this.label('lead', 'Lead in')}
                                    {this.textarea('lead', 3)}
                                    {this.inputError('lead')}
                                </div>

                                <div className="form-group">
                                    {this.label('content', 'Content')}
                                    {this.textarea('content', 7)}
                                    {this.inputError('content')}
                                </div>

                                <div className="form-group">
                                    {this.state.isDisabled ?
                                        <SendingBtn />
                                        :
                                        <button type="submit" className="btn btn-primary" >
                                            Save
                                        </button>
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(MyArticle);