import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

import { Formik } from 'formik';
import * as yup from 'yup';

const schema = yup.object({
    rating: yup.number().required(),
    comment: yup.string().required(),
    date: yup.date().required(),
});

const ReviewModal = props => {
    const { name, id } = props.restaurant || {};

    const _handleSubmit = ({ rate, date, comment }) => {
        props.onSubmit(id, rate, date, comment);
        props.onClose();
    };

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Review {name}</Modal.Title>
            </Modal.Header>
            <Formik validationSchema={schema} onSubmit={_handleSubmit}>
                {({
                    handleSubmit,
                    handleChange,
                    values,
                    touched,
                    isValid,
                    errors,
                }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Form.Group controlId="formBasicUsername">
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
                                        display: touched.comment
                                            ? 'block'
                                            : 'none',
                                    }}
                                    type="invalid"
                                >
                                    {errors.comment}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Rating</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="rating"
                                    max={5}
                                    min={0}
                                    values={values.rating}
                                    onChange={handleChange}
                                    isValid={touched.rating && !errors.rating}
                                />
                                <Form.Control.Feedback
                                    style={{
                                        display: touched.rating
                                            ? 'block'
                                            : 'none',
                                    }}
                                    type="invalid"
                                >
                                    {errors.rating}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Date of visit</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    max={5}
                                    min={0}
                                    values={values.date}
                                    onChange={handleChange}
                                    isValid={touched.date && !errors.date}
                                />
                                <Form.Control.Feedback
                                    style={{
                                        display: touched.date
                                            ? 'block'
                                            : 'none',
                                    }}
                                    type="invalid"
                                >
                                    {errors.date}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={props.onClose}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={!isValid}
                            >
                                Submit
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default ReviewModal;
