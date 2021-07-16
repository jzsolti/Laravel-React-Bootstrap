/* 
* https://medium.com/@madhusudhansubedi/dynamic-datatable-component-using-laravel-and-react-js-171ae3dd92d2
* https://github.com/madhusudhan1234/React-datatable-laravel 
*/
import React from 'react';
import api from '../config/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { withRouter, Link } from 'react-router-dom';

class DataTable extends React.Component {
    constructor(props) {
        super(props);

        this.columnNames = [];
        this.props.columns.map((column) => {
            this.columnNames.push(column.name);
        });


        this.state = {
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
            sorted_column: this.props.sorted_column,
            offset: 4,
            order: 'desc',
        };
    }

    fetchEntities() {
        let fetchUrl = `${this.props.url}/?page=${this.state.current_page}&column=${this.state.sorted_column}&order=${this.state.order}&per_page=${this.state.entities.meta.per_page}`;
        api.get(fetchUrl)
            .then(response => {
                this.setState({ entities: response.data });
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

    componentDidMount() {
        this.setState({ current_page: this.state.entities.meta.current_page }, () => { this.fetchEntities() });
    }

    tableHeads() {
        let icon;
        if (this.state.order === 'asc') {
            icon = <FontAwesomeIcon icon={faArrowUp} />;
        } else {
            icon = <FontAwesomeIcon icon={faArrowDown} />;
        }
        return this.props.columns.map((column, key) => {


            if (typeof column.orderable === 'undefined' || column.orderable === true) {
                return <th className="table-head" key={key} onClick={() => this.sortByColumn(column.name)}>
                    <span>{column.label}</span>
                    <span>{column.name === this.state.sorted_column && icon}</span>
                </th>
            } else {
                return <th className="table-head" key={key}>
                    <span>{column.label}</span>
                </th>
            }

        });
    }

    tableRows() {
        if (this.state.entities.data.length) {
            return this.state.entities.data.map(entity => {

                return <tr key={entity.id}>
                    {
                        this.props.columns.map((column, key) => {

                            if (typeof column.link !== 'undefined') {
                                return <td key={key}>
                                    
                                    <Link className="btn btn-info btn-sm" to={entity[column.name]}>{column.label}</Link>
                                    </td>
                            } else if (typeof entity[column.name] !== 'undefined') {
                                return <td key={key}>{entity[column.name]}</td>
                            } else {
                                return <td key={key}>-</td>
                            }
                        })
                    }
                </tr>
            })
        } else {
            return <tr>
                <td colSpan={this.props.columns.length} className="text-center">No Records Found.</td>
            </tr>
        }
    }

    sortByColumn(column) {
        if (column === this.state.sorted_column) {
            this.state.order === 'asc' ? this.setState({ order: 'desc', current_page: this.state.first_page }, () => { this.fetchEntities() }) : this.setState({ order: 'asc' }, () => { this.fetchEntities() });
        } else {
            this.setState({ sorted_column: column, order: 'asc', current_page: this.state.first_page }, () => { this.fetchEntities() });
        }
    }

    pageList() {
        return this.pagesNumbers().map(page => {
            return <li className={page === this.state.entities.meta.current_page ? 'page-item active' : 'page-item'} key={page}>
                <button className="page-link" onClick={() => this.changePage(page)}>{page}</button>
            </li>
        })
    }

    render() {
        return (
            <div className="data-table">
                <table className="table table-bordered">
                    <thead>
                        <tr>{this.tableHeads()}</tr>
                    </thead>
                    <tbody>{this.tableRows()}</tbody>
                </table>
                {(this.state.entities.data && this.state.entities.data.length > 0) &&
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
        );
    }
}

export default withRouter(DataTable);