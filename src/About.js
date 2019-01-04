import React, { Component } from 'react';

export default class About extends Component {

    render() {
        return (
            <React.Fragment>
                <div id="about" className="border">
                    <h3>about</h3>
                    <p>
                        <strong>Spl/tter</strong> is a site to make splitting your budget with others easily! Just create an account, join a splitter and
                        get started on making your budgeting easy!
                </p>
                </div>
                <address className="text-center text-muted">
                    <p>Jonathan Cady, 2018</p>
                </address>
            </React.Fragment>
        );
    }

}