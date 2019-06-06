import React from 'react';
import style from 'styled-components';
import Stars from './Stars';

const Container = style.div`
`;

const User = style.div`
    font-weight: 500;
`;

const Comment = style.div`
    font-weight: 200;
    font-style: italic;
    padding: 5px;
`;

const Review = ({ username, comment, rate }) => (
    <Container>
        <User>{username}</User>
        <Comment>{comment}</Comment>
        <Stars rating={rate} />
    </Container>
);

export default Review;
