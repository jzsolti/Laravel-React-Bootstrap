import React from 'react';
import { withRouter, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DataTable from "../DataTable";

class MyArticles extends React.Component {

    constructor() {
        super();
        this.columns = [
            'title'  ,
            'lead',
            'created_at'
        ];



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

                        <DataTable
                            url="/user/articles"
                            columns={this.columns}
                            sorted_column={2}
                        />

                        <div className="card-body">

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(MyArticles);