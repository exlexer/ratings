import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

import { connect } from 'react-redux';
import actions from '../redux/actions/users';

import { Formik } from 'formik';
import * as yup from 'yup';

const schema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
});

const Signin = props => {
    useEffect(() => {
        if (props.loggedIn) {
            props.history.push('home');
        }
    }, [props.loggedIn]);

    const _handleSubmit = ({ username, password }, form) =>
        props.signin(username, password);

    return (
        <Container>
            <Row style={{ marginTop: '2rem' }}>
                <Col />
                <Col>
                    <Card style={{ width: '22rem' }}>
                        <Card.Body>
                            <Card.Title>Sign In</Card.Title>
                            <Formik
                                validationSchema={schema}
                                onSubmit={_handleSubmit}
                            >
                                {({
                                    handleSubmit,
                                    handleChange,
                                    values,
                                    touched,
                                    isValid,
                                    errors,
                                }) => (
                                    <Form noValidate onSubmit={handleSubmit}>
                                        <Form.Group controlId="formBasicUsername">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                values={values.username}
                                                onChange={handleChange}
                                                isValid={
                                                    touched.username &&
                                                    !errors.username
                                                }
                                            />
                                            <Form.Control.Feedback
                                                style={{
                                                    display: touched.username
                                                        ? 'block'
                                                        : 'none',
                                                }}
                                                type="invalid"
                                            >
                                                {errors.username}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group controlId="formBasicPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                values={values.password}
                                                onChange={handleChange}
                                                feedback={errors.password}
                                                isValid={
                                                    touched.password &&
                                                    !errors.password
                                                }
                                            />
                                            <Form.Control.Feedback
                                                style={{
                                                    display: touched.password
                                                        ? 'block'
                                                        : 'none',
                                                }}
                                                type="invalid"
                                            >
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Button
                                            disabled={!isValid}
                                            variant="primary"
                                            type="submit"
                                        >
                                            Submit
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </Card.Body>
                    </Card>
                </Col>
                <Col />
            </Row>
        </Container>
    );
};

const mapStateToProps = state => ({
    loggedIn: state.users.loggedIn,
});

const mapDispatchToProps = {
    signin: actions.signin,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Signin);
