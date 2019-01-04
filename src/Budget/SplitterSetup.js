import React, { Component } from 'react';
import { Navbar, NavbarBrand, Button, Form, Label, Input, FormGroup, Alert, FormFeedback } from 'reactstrap';
import Splitter from './Splitter';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

class SplitterSetup extends Component {

    constructor() {
        super();
        this.state = {
            splitter: "",
            password: "",
            password2: "",
            name: "",
            passwordText: null,
            joinOrCreate: true,
            titleText: "Join",
            error: null,
            splitterName: null
        }
    }

    checkPassword(pass) {
        if (pass === this.state.password) {
            this.setState({
                valid: true,
                passwordText: "Nice, passwords match!"
            });
        } else {
            this.setState({
                valid: false,
                passwordText: "Passwords do not match, try again!"
            });
        }
    }

    updateValue = (name, value) => {
        this.setState({
            [name]: value
        })
    }

    doAction = () => {
        const splitterName = this.state.splitter;
        let db = firebase.firestore();
        db.settings({
            timestampsInSnapshots: true
        });
        let splitter = db.collection('splitters');
        let userId = firebase.auth().currentUser.uid;
        let displayName = firebase.auth().currentUser.displayName;
        if (this.state.joinOrCreate) {
            splitter.where("name", "==", splitterName).where("password", "==", this.state.password).get().then((results) => {
                if (!results.empty) {
                    results.forEach((doc) => {
                        let data = doc.data();
                        splitter.doc(doc.id).collection("users").doc(userId).get().then((userDoc) => {
                            if (!userDoc.exists) {
                                splitter.doc(doc.id).collection("users").doc(userId).set({
                                    items: [],
                                    id: userId,
                                    name: displayName
                                });
                            }
                        })
                        this.setState({
                            splitterName: data.name,
                            splitterId: doc.id
                        });
                    })
                } else {
                    this.setState({
                        error: "Splitter does not exist"
                    });
                }
            });
        } else {
            if (this.state.password !== "") {
                splitter.where("name", "==", splitterName).get().then((results) => {
                    if (!results.empty) {
                        this.setState({
                            error: "Splitter already exists!"
                        });
                    } else {
                        splitter.add({
                            password: this.state.password,
                            name: splitterName
                        }).then((doc) => {
                            splitter.doc(doc.id).collection("users").doc(userId).set({
                                items: [],
                                id: userId,
                                name: displayName
                            });
                            this.setState({
                                splitterName: splitterName,
                                splitterId: doc.id
                            });
                        });
                    }
                });
            } else {
                this.setState({
                    error: "Password must not be blank!"
                });
            }
        }
    }

    reset = () => {
        this.setState({
            splitterName: null,
            splitter: "",
            password: "",
            password2: ""
        });
    }

    render() {
        const which = this.state.joinOrCreate;
        const title = this.state.titleText;
        return (
            <React.Fragment>
                <Navbar color="light" light>
                    <div className="to-btn" title="Return to Splitter Select" style={{ display: 'flex', alignItems: 'center' }}
                        onClick={() => this.setState({ splitterName: null, splitter: "", password: "" })}
                    >
                        <img style={{ marginRight: '16px ' }} src={require("../assets/splitter.png")} alt="Logo" height="30"></img>
                        <NavbarBrand className="to-font">spl/tter</NavbarBrand>
                    </div>
                    <Button color="danger" onClick={() => firebase.auth().signOut()}>Log Out</Button>
                </Navbar>
                {this.state.splitterName ?
                    <Splitter name={this.state.splitterName} id={this.state.splitterId} reset={this.reset}></Splitter> :
                    <React.Fragment>
                        <Form id="splitter-setup" className="border" onSubmit={(e) => {
                            e.preventDefault();
                            this.doAction();
                        }}>
                            <div>
                                <h3><span className="text-lowercase">{title}</span> a splitter</h3>
                            </div>
                            <FormGroup>
                                <Label for="splitter">Splitter Name</Label>
                                <Input type="splitter" name="splitter" autoComplete="splitter" value={this.state.splitter} onChange={(event) => this.updateValue("splitter", event.target.value)} id="splitter" placeholder="Splitter" />
                            </FormGroup>
                            <FormGroup>
                                <Input hidden type="username" name="username" autoComplete="username"></Input>
                                <Label for="examplePassword">Password</Label>
                                <Input type="password" name="password" autoComplete="current-password" value={this.state.password} onChange={(event) => this.updateValue("password", event.target.value)} id="examplePassword" placeholder="Password" />
                            </FormGroup>
                            {!which && <FormGroup>
                                <Label for="password2">Retype Password</Label>
                                <Input type="password" name="password2" autoComplete="current-password"
                                    value={this.state.password2} onChange={(event) => {
                                        this.checkPassword(event.target.value);
                                        this.updateValue("password2", event.target.value)
                                    }} id="password2" placeholder="Retype Password"
                                    valid={this.state.valid}
                                    invalid={!this.state.valid && this.state.password2 !== ""}
                                />
                                <FormFeedback valid>{this.state.passwordText}</FormFeedback>
                                {this.state.valid && <FormFeedback invalid>{this.state.passwordText}</FormFeedback>}
                            </FormGroup>}
                            {this.state.error && <Alert color="danger">{this.state.error}</Alert>}
                            <div style={{ margin: '1rem', textAlign: 'center' }}>
                                <Button type="submit" color="primary" onClick={(e) => {
                                    e.preventDefault();
                                    this.doAction();
                                }}>{title} a Splitter</Button>
                            </div>
                            <div style={{ margin: '1rem', textAlign: 'center' }}>
                                <Button onClick={() => this.setState({ joinOrCreate: !which, titleText: !which ? "Join" : "Create", error: null })}>Switch to {which ? "Create" : "Join"}</Button>
                            </div>
                        </Form>
                    </React.Fragment>}
            </React.Fragment>
        );
    }
}

export default SplitterSetup;