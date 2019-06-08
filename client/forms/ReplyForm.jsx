import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';

const schema = yup.object({
    comment: yup.string().required(),
});

const ReplyForm = props => (
    <Formik validationSchema={schema} onSubmit={props.onSubmit}>
        {({ handleSubmit, handleChange, values, touched, isValid, errors }) => (
            <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="username">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                        type="text"
                        name="comment"
                        as="textarea"
                        rows="3"
                        values={values.comment}
                        onChange={handleChange}
                        isValid={touched.comment && !errors.comment}
                    />
                    <Form.Control.Feedback
                        style={{
                            display: touched.comment ? 'block' : 'none',
                        }}
                        type="invalid"
                    >
                        {errors.comment}
                    </Form.Control.Feedback>
                </Form.Group>
                <Button
                    variant="primary"
                    type="submit"
                    disabled={!isValid}
                    style={{ marginRight: 10 }}
                >
                    Submit
                </Button>
                <Button variant="secondary" onClick={props.onCancel}>
                    Cancel
                </Button>
            </Form>
        )}
    </Formik>
);

export default ReplyForm;
