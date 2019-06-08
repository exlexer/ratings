import React from 'react';
import { Modal } from 'react-bootstrap';
import { map } from 'lodash/fp';

import Review from './Review';
import Stars from './Stars';
const DetailModal = props => {
    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title style={{ display: 'flex' }}>
                    {props.title}
                    <Stars style={{ paddingLeft: 10 }} rating={props.rating} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {map(
                    r => (
                        <Review key={r.id} {...r} onReply={props.onReply} />
                    ),
                    props.reviews,
                )}
            </Modal.Body>
        </Modal>
    );
};

export default DetailModal;
