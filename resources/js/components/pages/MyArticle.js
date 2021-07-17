import React from 'react';
import { withRouter } from "react-router";
import api from '../../config/api';
import FormHelper from '../../form/FormHelper';
import SendingBtn from '../../form/SendingBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

const ReactSwal = withReactContent(Swal);

class MyArticle extends React.Component {

    constructor(props) {
        super(props);

        this.inputs = ['title', 'lead', 'content', 'image'];

        this.state = {
            isDisabled: false,
            imagePreView: null,
            formErrors: {
                title: null,
                lead: null,
                content: null,
                image: null
            }
        };

        this.inputs.forEach((item) => {
            this.state[item] = '';
        });

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFileInputChange = this.handleFileInputChange.bind(this);
    }

    handleFileInputChange(event) {
        this.setState({
            imagePreView: URL.createObjectURL(event.target.files[0]),
            image: event.target.files[0]
        });
    }

    handleInputChange(event) {
        this.setState(FormHelper.handleInputChangeNewValue(event));
    }

    componentDidMount() {

        let articleId = this.getId();
        if (articleId !== null) {
            api.get(`user/articles/${articleId}`)
                .then((response) => {

                    let responseData = response.data.data;
                    this.setState({
                        title: responseData.title,
                        lead: responseData.lead,
                        content: responseData.content,
                        imagePreView: responseData.image_src
                    });

                }).catch((error) => {
                    if (error.response && error.response.status === 404) {
                        this.props.history.push('/_404');
                    } else {
                        console.error(error);
                    }
                });
        }

    }

    componentWillUnmount(){
        this.setState = (state, callback) => {
            return;
          }
    }

    getId() {
        return (typeof this.props.match.params.id === 'undefined') ? null : this.props.match.params.id;
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

    submitHandler = (event) => {
        event.preventDefault();
        this.setState({ isDisabled: true });

        let action, formData = null;
        if (this.getId() === null) {
            action = `user/articles/create`;
            formData = FormHelper.getFormData(this.inputs, this.state);
        } else {
            action = `user/articles/${this.getId()}`;
            formData = FormHelper.getFormData(this.inputs, this.state, { "_method": "put" });
        }

        api.post(action, formData)
            .then((response) => {
                if ('id' in response.data) {
                    this.setState({ isDisabled: false,  formErrors: FormHelper.resetValidation(this.inputs) });
                    Swal.fire({
                        icon: 'success',
                        title: `New article created`,
                        timer: 1000
                      });
                    this.props.history.push(`/user/article/${response.data.id}`);
                }

                if ('updated' in response.data) {
                    this.setState({ isDisabled: false,  formErrors: FormHelper.resetValidation(this.inputs) });
                    Swal.fire({
                        icon: 'success',
                        title: `Article updated`,
                        timer: 1000
                      });
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

    deletImageHandler = (event) => {
        event.preventDefault();

        api.delete(`user/articles/${this.getId()}/delete-image`)
            .then((response) => {
                if ('deleted' in response.data) {
                    this.setState({ imagePreView: null });
                    Swal.fire({
                        icon: 'success',
                        title: `Image deleted`,
                        timer: 1000
                      });
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }

    deleteHandler = (event) => {
        event.preventDefault();

        ReactSwal.fire({
            title: '<strong class="text-danger">Are you sure?</strong>',
            icon: 'warning',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`user/articles/${this.getId()}`)
                    .then((response) => {
                        if ('deleted' in response.data) {
                            localStorage.setItem('status', 'Article deleted!');
                            this.props.history.push('/user/articles');
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } 
        });

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

                    <div className="card">
                        <div className="card-header bg-warning d-flex justify-content-between">
                            <div>{this.getId() === null ? 'New article' : 'Edit article'} </div>
                            <div> </div>
                        </div>

                        <div className="card-body">

                            <form method="POST" onSubmit={this.submitHandler}>

                                <div className="row">
                                    <div className="col-md-6">
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
                                    </div>
                                    <div className="col-md-6">

                                        {this.label('image', 'Image')}

                                        <div className="custom-file">
                                            <label className="custom-file-label" >Choose file</label>
                                            <input
                                                name="image"
                                                type="file"
                                                className={FormHelper.inputClassName(this.state.formErrors['image'], 'custom-file-input')}
                                                onChange={this.handleFileInputChange} />
                                            {this.inputError('image')}
                                        </div>

                                        {(this.getId() !== null && this.state.imagePreView !== null) &&
                                            <div className="d-flex justify-content-end mt-3">
                                                <button type="button" className="btn btn-default" onClick={this.deletImageHandler}>
                                                    <FontAwesomeIcon icon={faTrash} size="lg" /> </button>
                                            </div>
                                        }

                                        <img src={this.state.imagePreView} className="img-thumbnail" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    {this.state.isDisabled ?
                                        <SendingBtn />
                                        :
                                        <div className="d-flex justify-content-between">
                                            <button type="submit" className="btn btn-primary" >
                                                Save
                                            </button>
                                            <button type="button" className="btn btn-danger" onClick={this.deleteHandler} >
                                                Delete
                                            </button>
                                        </div>
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