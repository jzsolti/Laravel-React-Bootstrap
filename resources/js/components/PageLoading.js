import React from 'react';

class PageLoading extends React.Component {
    render() {
        return (
            <div className="d-flex justify-content-center align-items-center" >
                <span className="spinner-border spinner-border-xl" role="status" aria-hidden="true"></span>
                <span className="sr-only">Loading...</span>
            </div>
        )
    }
}

export default PageLoading;