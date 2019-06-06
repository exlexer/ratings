import React, { useState } from 'react';
import style from 'styled-components';
import { MdStar, MdStarBorder, MdStarHalf } from 'react-icons/md';
import { isFunction } from 'lodash/fp';

const Rating = style.div`
    color: #ddd;
    width: fit-content;
`;

const Stars = React.forwardRef(({ rating, onClick }, ref) => {
    const [hoverRating, setHoverRating] = useState();

    const stars = [];

    const baseRating = hoverRating || Math.floor(rating);
    const hasHalf = !hoverRating && rating % 1;

    const _handleHoverChange = index => () => {
        if (isFunction(onClick)) {
            setHoverRating(index);
        }
    };

    const _handleClick = index => () => {
        if (isFunction(onClick)) {
            onClick(index);
        }
    };

    for (let i = 1; i <= 5; i++) {
        if (i <= baseRating) {
            stars.push(
                <MdStar
                    key={i}
                    id={i}
                    onClick={_handleClick(i)}
                    onMouseEnter={_handleHoverChange(i)}
                    onMouseLeave={_handleHoverChange()}
                />,
            );
        } else if (i - 1 === baseRating && hasHalf) {
            stars.push(
                <MdStarHalf
                    key={i}
                    id={i}
                    onClick={_handleClick(i)}
                    onMouseEnter={_handleHoverChange(i)}
                    onMouseLeave={_handleHoverChange()}
                />,
            );
        } else {
            stars.push(
                <MdStarBorder
                    key={i}
                    id={i}
                    onClick={_handleClick(i)}
                    onMouseEnter={_handleHoverChange(i)}
                    onMouseLeave={_handleHoverChange()}
                />,
            );
        }
    }

    return <Rating ref={ref}>{stars}</Rating>;
});

export default Stars;
