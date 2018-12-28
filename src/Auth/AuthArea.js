import React, { Component } from 'react';
import UserSignIn from './UserSignIn';
import UserSignUp from './UserSignUp';
import { Button } from 'reactstrap';

class AuthArea extends Component {

    constructor() {
        super();
        this.state = {
            signInOrUp: true,
            buttonText: "Sign Up"
        }
    }

    switch = () => {
        const status = this.state.signInOrUp;
        this.setState({
            signInOrUp: !status,
            buttonText: status ? "Sign Up" : "Sign In"
        })
    }

    render() {
        const whichComp = this.state.signInOrUp;
        const btnText = this.state.buttonText;
        return (
            <React.Fragment>
                <div className="text-center m-5">
                    <h1><strong>spl/tter</strong></h1>
                    <p className="lead">Better budgeting for everyone.</p>
                </div>
                {whichComp ? <UserSignIn></UserSignIn> : <UserSignUp></UserSignUp>}
                <div className="text-center m-3">
                    <Button onClick={this.switch}>Switch to {btnText}</Button>
                </div>
            </React.Fragment>
        );
    }

}

export default AuthArea;