import React from "react";
import { Container, Row, Col, Navbar } from "react-bootstrap";

const Home = props => {
    return [
        <Navbar bg="light">
            <Navbar.Brand href="home">Test</Navbar.Brand>
        </Navbar>,
        <Container>
            <Row>
                <Col>1 of 2</Col>
                <Col>2 of 2</Col>
            </Row>
            <Row>
                <Col>1 of 3</Col>
                <Col>2 of 3</Col>
                <Col>3 of 3</Col>
            </Row>
        </Container>
    ];
};

export default Home;
