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
        // post to server
        api.post('verify/email', { token: this.props.match.params.token })
            .then((response) => {
                if ('logged_in' in response.data) {
                    if ('verified' in response.data) {
                        // user was logged in and verification was successfull
                        this.props.userStatusHandler();

                        this.setState({
                            verification: 'success'
                        });
                    } else {
                        this.setState({
                            verification: 'failed'
                        });
                    }

                } else {
                    // rediredtto login
                    this.props.history.push('/login');
                }
            }).catch((error) => {
                console.error(error);
            });
    }

    render() {
        return <div>
            {this.state.verification === 'success' && <div>success</div>}

            {this.state.verification === 'failed' && <div>failed</div>}
        </div>;
    }
}

export default withRouter(VerifyEmail);
