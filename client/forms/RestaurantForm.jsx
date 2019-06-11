import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';

const schema = yup.object({
    name: yup.string().required(),
});

const RestaurantForm = props => (
    <Formik validationSchema={schema} onSubmit={props.onSubmit}>
        {({ handleSubmit, handleChange, values, isValid }) => (
            <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="restaurant">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        values={values.comment}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button
                    variant="info"
                    type="submit"
                    disabled={!isValid}
                    className="mr-2"
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

export default RestaurantForm;
