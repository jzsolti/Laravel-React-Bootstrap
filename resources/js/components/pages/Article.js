import React from 'react';
import { withRouter, Link } from "react-router";


class Article extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            article: null,
            labels: []
        }
    }

    componentDidMount() {

       
    }

    render() {

        return (
            <div className="row justify-content-center pt-5">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Article</div>
                        <div className="card-body">
                            {this.props.match.params.id}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Article);