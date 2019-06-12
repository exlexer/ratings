import React, { useState } from 'react';
import { connect } from 'react-redux';
import actions from '../redux/actions/users';
import * as yup from 'yup';
import api from '../api';
import { Alert, Container, Row, Col, Card } from 'react-bootstrap';
import Form from '../components/Form';

const Signin = props => {
    const [signingUp, setSigningUp] = useState();

    const _handleSignin = ({ username, password }) =>
        props.signin(username, password);

    const _handleSignup = ({ username, password }) =>
        props.signup(username, password);

    const signinFields = [
        {
            key: 'username',
            label: 'Username',
            validations: yup.string().required('Username is required.'),
        },
        {
            key: 'password',
            label: 'Password',
            type: 'password',
            validations: yup
                .string()
                .required('Password is required.')
                .min(6, 'Password must be at least 6 characters.'),
        },
    ];

    const signupFields = [
        {
            key: 'username',
            label: 'Username',
            validations: yup
                .string()
                .required('Username is required.')
                .test('isUsed', 'This username is already taken.', value =>
                    api
                        .get(`users/duplicate/${value}`)
                        .then(({ data }) => !data.exists),
                ),
        },
        {
            key: 'password',
            label: 'Password',
            type: 'password',
            validations: yup
                .string()
                .required('Password is required.')
                .min(6, 'Password must be at least 6 characters.'),
        },
    ];

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
                            {signingUp ? (
                                <Form
                                    key="signin"
                                    fields={signupFields}
                                    onSubmit={_handleSignup}
                                    actionText={'I Already have an account'}
                                    onClickAction={() => setSigningUp(false)}
                                />
                            ) : (
                                <Form
                                    key="signup"
                                    fields={signinFields}
                                    onSubmit={_handleSignin}
                                    actionText={'New here? Signup'}
                                    onClickAction={() => setSigningUp(true)}
                                />
                            )}
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
