import React from 'react';

class SendingBtn extends React.Component {
    render() {
        return (
            <button className="btn btn-primary" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="sr-only">Loading...</span>
            </button>
        )
    }
}

export default SendingBtn;