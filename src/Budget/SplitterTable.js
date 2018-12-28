import React, { Component } from 'react';
import { Row, Col, Container, ListGroup, ListGroupItem, Button } from 'reactstrap';

export default class SplitterTable extends Component {

    constructor() {
        super();
        this.state = {
            overallTotals: null
        }
    }

    cleanItems = (items) => {
        let itemArray = [];
        itemArray = items.map((item, i) => {
            return <ListGroupItem key={"item" + i}>
                <div style={{ display: "flex", justifyContent: "space-between"}}>
                    <strong>{item.item + ": "}</strong>{"$" + item.cost.toFixed(2)}
                    <Button size="sm" color="danger" onClick={() => this.props.removeItem(item)}>X</Button>
                </div>
            </ListGroupItem>
        })
        return itemArray;
    }

    render() {
        const allUsers = this.props.allUsers;
        return (
            <Container style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <Row>
                    {allUsers.map((user, i) => {
                        const items = user.items;
                        const total = this.props.totals[i];
                        const costString = total < 0 ? "-$" + (String(total.toFixed(2))).substring(1) : "$" + total.toFixed(2);
                        let textColor;
                        if (total < 0) {
                            textColor = "text-success";
                        } else if (total > 0) {
                            textColor = "text-danger";
                        } else {
                            textColor = "text-dark";
                        }
                        return (
                            <Col key={"name" + i}>
                                <h1>{user.name}</h1>
                                <h3><span className={textColor}>{costString}</span></h3>
                                <ListGroup>
                                    {items.length === 0 ? <ListGroupItem>None</ListGroupItem> : this.cleanItems(items)}
                                </ListGroup>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        );
    }
}