import React from 'react';
import { withRouter, Link } from "react-router-dom";
import api from '../../config/api';
import FormHelper from '../../form/FormHelper';
import SendingBtn from '../../form/SendingBtn';
import PageLoading from '../PageLoading';
import qs from 'qs';

class Articles extends React.Component {

    constructor() {
        super();

        this.url = `articles`,
            this.state = {
                loaded: false,
                filter_text: '',
                filter_labels: [],
                entities: {
                    data: [],
                    meta: {
                        current_page: 1,
                        from: 1,
                        last_page: 1,
                        per_page: 5,
                        to: 1,
                        total: 1,
                    },
                },
                first_page: 1,
                current_page: 1,
                offset: 4,
            };

        this.handleLabelsChange = this.handleLabelsChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    handleLabelsChange(event) {

        //this.setState({  });

        let labels = this.state.filter_labels;
        let value = parseInt(event.target.value);

        if (event.target.checked) {
            labels.push(value);
            this.setState({ filter_labels: labels });
        } else {
            let index = labels.indexOf(value);

            if (index >= 0) {
                labels.splice(index, 1);
                this.setState({ filter_labels: labels });
            }
        }
    }

    fetchEntities() {
        let fetchUrl = `${this.url}?page=${this.state.current_page}&per_page=${this.state.entities.meta.per_page}`;

        if(this.state.filter_text !== ''){
            fetchUrl += `&search=${this.state.filter_text}`;
        }
        
        if (this.state.filter_labels.length > 0) {
            
            fetchUrl += `&${ qs.stringify({ 'labels': this.state.filter_labels }, { arrayFormat: 'indices', encode: false }) }`;
        }
       
        api.get(fetchUrl)
            .then(response => {
                this.setState({ entities: response.data, loaded: true });
            })
            .catch(e => {
                console.error(e);
            });
    }

    changePage(pageNumber) {
        this.setState({ current_page: pageNumber }, () => { this.fetchEntities() });
    }

    pagesNumbers() {
        if (!this.state.entities.meta.to) {
            return [];
        }
        let from = this.state.entities.meta.current_page - this.state.offset;
        if (from < 1) {
            from = 1;
        }
        let to = from + (this.state.offset * 2);
        if (to >= this.state.entities.meta.last_page) {
            to = this.state.entities.meta.last_page;
        }
        let pagesArray = [];
        for (let page = from; page <= to; page++) {
            pagesArray.push(page);
        }
        return pagesArray;
    }

    pageList() {
        return this.pagesNumbers().map(page => {
            return <li className={page === this.state.entities.meta.current_page ? 'page-item active' : 'page-item'} key={page}>
                <button className="page-link" onClick={() => this.changePage(page)}>{page}</button>
            </li>
        })
    }

    componentDidMount() {
        api.get(`labels`)
            .then((response) => {
                this.setState({
                    labels: response.data.data
                });
            })
            .then(() => {
                this.setState({ current_page: this.state.entities.meta.current_page }, () => { this.fetchEntities() });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    list() {
        return this.state.entities.data.map((article) => {
            return <li className="list-group-item" key={article.id}>
                <div className="row">
                    <div className="col-md-3">
                        <img src={article.image_src} className="img-thumbnail" />
                    </div>
                    <div className="col-md-9">
                        <div className="d-flex justify-content-center">
                            <h2>{article.title}</h2>
                        </div>
                        <div className="d-flex justify-content-start">
                            {article.lead}
                        </div>

                        <Link className="btn btn-info btn-sm" to={article.detail}>Details</Link>
                    </div>
                </div>
            </li>
        })
    }

    submitHandler = (event) => {
        event.preventDefault();



        this.changePage(1);
    }

    filter() {
        return <form method="POST" onSubmit={this.submitHandler}>

            <div className="form-group">
                <label htmlFor='title'>Search</label>
                <input
                    name='filter_text'
                    type='text'
                    value={this.state[name]}
                    onChange={this.handleInputChange}
                    className="form-control"
                />
            </div>

            <ul className="list-inline">

                {this.state.labels.map((label) => {

                    return <li className="list-inline-item p-1" key={label.id}>

                        <div className="form-check">
                            <input
                                className="form-check-input"
                                name="labels"
                                type="checkbox"
                                value={label.id}
                                onChange={this.handleLabelsChange}
                                id={`labelcb${label.id}`}
                            />
                            <label className="form-check-label"
                                htmlFor={`labelcb${label.id}`}>
                                {label.name}
                            </label>
                        </div>
                    </li>
                })
                }
            </ul>


            <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary" >
                    Apply
                </button>

            </div>

        </form>
    }

    render() {

        return (

            <div className="row justify-content-center pt-5">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Articles</div>
                        <div className="card-body">
                            {this.state.loaded && this.filter()}

                            <ul className="list-group mt-2">
                                {this.state.loaded ? this.list() : <PageLoading />}
                            </ul>
                        </div>

                        <div className="card-footer">
                            {(this.state.loaded && this.state.entities.data.length > 0) &&
                                <nav>
                                    <ul className="pagination">
                                        <li className="page-item">
                                            <button className="page-link"
                                                disabled={1 === this.state.entities.meta.current_page}
                                                onClick={() => this.changePage(this.state.entities.meta.current_page - 1)}
                                            >
                                                Previous
                                            </button>
                                        </li>
                                        {this.pageList()}
                                        <li className="page-item">
                                            <button className="page-link"
                                                disabled={this.state.entities.meta.last_page === this.state.entities.meta.current_page}
                                                onClick={() => this.changePage(this.state.entities.meta.current_page + 1)}
                                            >
                                                Next
                                            </button>
                                        </li>
                                        <span style={{ marginTop: '8px' }}> &nbsp; <i>Displaying {this.state.entities.data.length} of {this.state.entities.meta.total} entries.</i></span>
                                    </ul>
                                </nav>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Articles);