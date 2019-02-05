import React, { Component } from 'react';
import { Button, Form, Label, Input, FormGroup, Alert } from 'reactstrap';
import SplitterTable from './SplitterTable';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export default class Splitter extends Component {

    constructor() {
        super();
        this.textInput = React.createRef();
        this.state = {
            item: "",
            cost: 0,
            confirm: null,
            totalForEach: []
        }
    }

    componentDidMount() {
        this.db = this.props.firestore;
        this.splitter = this.db.collection("splitters").doc(this.props.id).collection("users")
        this.unsubscribe = this.splitter
            .onSnapshot((results) => {
                let users = [];
                results.forEach((user) => {
                    users.push(user.data());
                });
                this.doCalculation(users);
                this.setState({
                    users: users
                });
            });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    removeItem = (item) => {
        this.splitter.doc(firebase.auth().currentUser.uid).update({
            items: firebase.firestore.FieldValue.arrayRemove(item)
        });
    }

    doCalculation = (users) => {
        let totalNums = new Array(users.length);
        let total = 0;
        users.forEach((user, i) => {
            let items = user.items;
            let sum = 0;
            items.forEach((item) => {
                sum += item.cost;
            });
            totalNums[i] = sum;
            total += sum;
        });
        let finalNums = totalNums.map((userTotal) => {
            return (total / users.length) - userTotal;
        })
        this.setState({
            totalForEach: finalNums
        });
    }

    updateValue = (name, value) => {
        this.setState({
            [name]: value
        })
    }

    addItem = () => {
        let splitter = firebase.firestore().collection("splitters");
        const cost = this.state.cost;
        const item = this.state.item;
        if (cost > 0 && item !== "") {
            splitter.doc(this.props.id).collection("users").doc(firebase.auth().currentUser.uid).update({
                items: firebase.firestore.FieldValue.arrayUnion({ cost: Number(cost), item: item })
            }).then(() => {
                this.textInput.current.focus();
                this.setState({
                    cost: 0,
                    item: ""
                });
            });
        }
    }

    removeFromSplitter = () => {
        this.props.reset();
        this.splitter.doc(firebase.auth().currentUser.uid).delete().then(() => {
            
        });
    }

    render() {
        return (
            <React.Fragment>
                <div id="splitter-area" className="border">
                    <Button onClick={this.removeFromSplitter}>Leave Splitter</Button>
                    <h2><span className="to-font">splitter:</span> {this.props.name}</h2>
                    {this.state.users && this.state.totalForEach && <SplitterTable allUsers={this.state.users} removeItem={this.removeItem} totals={this.state.totalForEach}></SplitterTable>}
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        this.addItem();
                    }} style={{ margin: '1rem' }}>
                        <h3>add an item</h3>
                        <FormGroup>
                            <Label for="item">Name of Item</Label>
                            <Input value={this.state.item} innerRef={this.textInput} onChange={(event) => this.updateValue("item", event.target.value)} placeholder="Add an item!"></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="cost">Cost</Label>
                            <Input value={this.state.cost} onChange={(event) => this.updateValue("cost", event.target.value)} placeholder="Add a cost!"></Input>
                        </FormGroup>
                        <Button type="submit" onClick={this.addItem}>Add Item</Button>
                        {this.state.confirm && <Alert style={{ margin: '1rem' }} color="success">{this.state.confirm}</Alert>}
                    </Form>
                </div>
            </React.Fragment>
        );
    }

}