import React from 'react';
import { withRouter, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

class MyArticles extends React.Component {

    constructor() {
        super();

        this.state = {
            articles: [],
            loaded: false
        }
    }

    render() {

        return (
            <div className="row justify-content-center pt-5">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-warning d-flex justify-content-between">
                            <div>My articles</div>
                            <div> <Link to="/user/article" className="btn btn-primary"><FontAwesomeIcon icon={faPlus} /></Link> </div>
                        </div>
                        <div className="card-body">
                            {
                                this.state.loaded ?
                                    <table className="table table-dark">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Title</th>
                                                <th scope="col">Lead</th>
                                                <th scope="col">Created</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.articles.map((article, i) => {
                                                    return <tr key={article.id}>
                                                        <td>
                                                            <Link to={`/user/article/${article.id}`}>Detail </Link>
                                                        </td>
                                                        <th scope="row">{article.title}</th>
                                                        <td>{article.lead}</td>
                                                        <td>{article.created}</td>
                                                    </tr>
                                                })

                                            }
                                        </tbody>
                                    </table>
                                    :
                                    <div className="spinner-border" role="status">
                                        <span className="sr-only">Loading </span>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(MyArticles);