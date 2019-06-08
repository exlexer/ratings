import React from 'react';
import { Modal } from 'react-bootstrap';
import { map } from 'lodash/fp';

import Review from './Review';
const DetailModal = props => {
    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
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
