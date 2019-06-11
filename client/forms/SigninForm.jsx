import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';

const schema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
});

const SigninForm = props => (
    <Formik validationSchema={schema} onSubmit={props.onSubmit}>
        {({ handleSubmit, handleChange, values, touched, isValid, errors }) => (
            <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        values={values.username}
                        onChange={handleChange}
                        isValid={touched.username && !errors.username}
                    />
                    <Form.Control.Feedback
                        style={{
                            display: touched.username ? 'block' : 'none',
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
                        isValid={touched.password && !errors.password}
                    />
                    <Form.Control.Feedback
                        style={{
                            display: touched.password ? 'block' : 'none',
                        }}
                        type="invalid"
                    >
                        {errors.password}
                    </Form.Control.Feedback>
                </Form.Group>
                <Button
                    disabled={!isValid}
                    variant="info"
                    type="submit"
                    className="mr-2"
                >
                    Submit
                </Button>
                <Button variant="secondary" onClick={props.onToggle}>
                    {props.toggleText}
                </Button>
            </Form>
        )}
    </Formik>
);

export default SigninForm;
