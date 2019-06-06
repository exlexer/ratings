import React, { useRef, useState } from 'react';
import style from 'styled-components';
import { Overlay, Button, Popover, Modal, Form } from 'react-bootstrap';
import { map } from 'lodash/fp';
import { Formik } from 'formik';
import * as yup from 'yup';

import Review from './Review';
import Stars from './Stars';

const schema = yup.object({
    comment: yup.string().required(),
    date: yup.date().required(),
});

const Container = style.div`
    width: 100%;
    padding: 8px 16px;
    margin-bottom: 50px;
    display: flex;
`;

const ColumnContainer = style.div`
    flex-grow: 1;
    flex-basis: 0;
`;

const Title = style.div`
    font-weight: 500;
`;

const Restaurant = props => {
    const [settingRating, setSettingRating] = useState();
    const starsRef = useRef();

    const _handleSetRating = rate => {
        if (settingRating) {
            setSettingRating();
        } else {
            setSettingRating(rate);
        }
    };

    const _handleSubmit = ({ date, comment }) => {
        props.onReview(props.restaurant, settingRating, date, comment);
        setSettingRating();
    };

    return (
        <Container>
            <ColumnContainer>
                <Title>{props.title}</Title>
                <Stars
                    ref={starsRef}
                    rating={settingRating || props.rating}
                    onClick={_handleSetRating}
                />
                <Overlay
                    show={!!settingRating}
                    target={starsRef.current}
                    placement="bottom"
                    container={starsRef.current}
                    containerPadding={20}
                >
                    <Popover id="popover-contained" title="Leave a review">
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
                                    <Modal.Body>
                                        <Form.Group controlId="username">
                                            <Form.Label>Comment</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="comment"
                                                as="textarea"
                                                rows="3"
                                                values={values.comment}
                                                onChange={handleChange}
                                                isValid={
                                                    touched.comment &&
                                                    !errors.comment
                                                }
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

                                        <Form.Group controlId="date">
                                            <Form.Label>
                                                Date of visit
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="date"
                                                max={5}
                                                min={0}
                                                values={values.date}
                                                onChange={handleChange}
                                                isValid={
                                                    touched.date && !errors.date
                                                }
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
                                        <Button
                                            variant="secondary"
                                            onClick={() => setSettingRating()}
                                        >
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
                    </Popover>
                </Overlay>
            </ColumnContainer>
            {props.highestRating ? (
                <ColumnContainer>
                    <div>Highest Rating</div>
                    <Review {...props.highestRating} />
                    <div>Lowest Rating</div>
                    <Review {...props.lowestRating} />
                </ColumnContainer>
            ) : (
                <ColumnContainer>No Reviews Yet</ColumnContainer>
            )}
            {!!props.reviews.length && (
                <ColumnContainer>
                    Most Recent Reviews
                    {map(
                        r => (
                            <Review key={r.id} {...r} />
                        ),
                        props.reviews,
                    )}
                </ColumnContainer>
            )}
        </Container>
    );
};

export default Restaurant;
