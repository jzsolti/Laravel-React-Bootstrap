import React from 'react';
import { withRouter, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DataTable from "../DataTable";
import Swal from 'sweetalert2';

class MyArticles extends React.Component {

    constructor() {
        super();

        this.columns = [
            { name: "edit", label: "Edit", orderable: false, link: true },
            { name: "title", label: "Title" },
            { name: "lead", label: "Lead" },
            { name: "created_at", label: "Created" },
        ];
    }

    componentDidMount() {
        const status = localStorage.getItem('status');
        if (status) {
            localStorage.removeItem('status');

            Swal.fire({
                icon: 'success',
                title: status,
                timer: 1500
              });
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
                            <DataTable url="/user/articles" columns={this.columns} sorted_column="created_at" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(MyArticles);