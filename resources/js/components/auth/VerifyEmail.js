import React from "react";
import { withRouter } from "react-router";
import api from '../../config/api';

class VerifyEmail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            verification: null
        }

    }

    componentDidMount() {

        api.post('verify/email', { token: this.props.match.params.token })
            .then((response) => {

                if ('success' in response.data) {
                    this.props.history.push('/login');
                } else {
                    this.setState({
                        verification: 'failed'
                    });
                }

            }).catch((error) => {
                console.error(error);
            });
    }

    render() {
        return <div>
            <div className="row justify-content-center">
                <div className="col-md-8">

                    {this.state.verification === 'failed' && <div className="card">
                        <div className="card-header">Something went wrong!</div>
                        <div className="card-body">
                        </div>
                    </div>}

                </div>
            </div>
        </div>;
    }
}

export default withRouter(VerifyEmail);
