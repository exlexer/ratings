import React, { useState } from 'react';
import { connect } from 'react-redux';
import actions from '../redux/actions/users';

import { Alert, Container, Row, Col, Card } from 'react-bootstrap';
import SigninForm from '../forms/SigninForm';

const Signin = props => {
    const [signingUp, setSigningUp] = useState();

    const _handleSignin = ({ username, password }) =>
        props.signin(username, password);

    const _handleSignup = ({ username, password }) =>
        props.signup(username, password);

    return (
        <Container>
            <Row style={{ marginTop: '2rem' }}>
                <Col />
                <Col>
                    <Card style={{ width: '22rem' }}>
                        <Card.Body>
                            <Card.Title>
                                {signingUp ? 'Signup' : 'Signin'}
                            </Card.Title>
                            {props.error && (
                                <Alert variant="danger">{props.error}</Alert>
                            )}
                            <SigninForm
                                onSubmit={
                                    signingUp ? _handleSignup : _handleSignin
                                }
                                toggleText={signingUp ? 'Signin' : 'Signup'}
                                onToggle={() => setSigningUp(!signingUp)}
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col />
            </Row>
        </Container>
    );
};

const mapDispatchToProps = {
    signin: actions.signin,
    signup: actions.signup,
};

const mapStateToProps = state => ({
    error: state.users.error,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Signin);
