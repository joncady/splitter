import React, { Component } from 'react';
import AuthArea from './Auth/AuthArea';
import About from './About';
import SplitterSetup from './Budget/SplitterSetup';
import firebase from 'firebase/app';
import 'firebase/auth';

export default class App extends Component {

	constructor() {
		super();
		this.state = {
			user: null
		}
	}

	componentDidMount() {
		this.authUnregFunc = firebase.auth().onAuthStateChanged((firebaseUser) => {
			if (firebaseUser) {
				this.setState({
					user: firebaseUser
				})
			} else {
				this.setState({
					user: null
				});
			}
		});
	}

	render() {
		// log into specific budget splitter
		const user = this.state.user;
		return (
			<div className="App">
				{user ?
					<SplitterSetup></SplitterSetup> :
					<React.Fragment>
						<AuthArea></AuthArea>
						<About></About>
					</React.Fragment>}
			</div>
		);
	}
}
