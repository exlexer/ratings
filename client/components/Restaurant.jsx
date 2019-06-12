import React, { useRef, useState } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import { map } from 'lodash/fp';
import * as yup from 'yup';

import Review from './Review';
import Stars from './Stars';
import DetailModal from './DetailModal';
import {
    Container,
    SmallColumnContainer,
    ColumnContainer,
    Title,
    Link,
    ReviewHeading,
} from './StyledComponents';
import Form from './Form';

const Restaurant = props => {
    const [settingRating, setSettingRating] = useState();
    const starsRef = useRef();

    const [showDetail, setShowingDetail] = useState();

    const hasData =
        (props.showRange && props.highestRating) ||
        (props.showRecent && props.recent.length) ||
        (props.showUnreplied && props.reviews.length);

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

    const _getReviewRange = () =>
        props.highestRating && (
            <ColumnContainer>
                <ReviewHeading>Highest Rating</ReviewHeading>
                <Review {...props.highestRating} />
                {!!props.reviews &&
                    props.reviews.length > 1 && [
                        <ReviewHeading key="label">
                            Lowest Rating
                        </ReviewHeading>,
                        <Review key="review" {...props.lowestRating} />,
                    ]}
            </ColumnContainer>
        );

    const _getRecentReviews = () =>
        !!props.recent &&
        !!props.recent.length && (
            <ColumnContainer>
                <ReviewHeading>Most Recent Reviews</ReviewHeading>
                {map(
                    r => (
                        <Review key={r.id} {...r} />
                    ),
                    props.recent,
                )}
            </ColumnContainer>
        );

    const _getUnreplied = () =>
        !!props.reviews &&
        !!props.reviews.length && (
            <ColumnContainer>
                <ReviewHeading>Unreplied Reviews</ReviewHeading>
                {map(
                    r => (
                        <Review key={r.id} {...r} onReply={props.onReply} />
                    ),
                    props.reviews,
                )}
            </ColumnContainer>
        );

    const _getZeroState = () => !hasData && props.zeroState;

    const fields = [
        {
            key: 'comment',
            label: 'Comment',
            as: 'textarea',
            props: {
                rows: '3',
            },
            validations: yup.string().required('Comment is required.'),
        },
        {
            type: 'date',
            key: 'date',
            validations: yup.date().required('Date is required.'),
        },
    ];

    return (
        <Container style={props.style} className="restaurant">
            <SmallColumnContainer>
                <Title>{props.title}</Title>
                <Stars
                    ref={starsRef}
                    rating={settingRating || props.rating}
                    onClick={props.onReview ? _handleSetRating : null}
                    active={settingRating}
                />
                <Link onClick={() => setShowingDetail(true)}>
                    View All Reviews
                </Link>
                <Overlay
                    show={!!settingRating}
                    target={starsRef.current}
                    placement="bottom"
                    container={starsRef.current}
                    containerPadding={20}
                >
                    <Popover id="popover-contained" title="Leave a review">
                        <Form
                            fields={fields}
                            onSubmit={_handleSubmit}
                            actionText="cancel"
                            onClickAction={() => setSettingRating()}
                        />
                    </Popover>
                </Overlay>
            </SmallColumnContainer>
            {_getZeroState()}
            {props.showRange && _getReviewRange()}
            {props.showRecent && _getRecentReviews()}
            {props.showUnreplied && _getUnreplied()}
            <DetailModal
                show={showDetail}
                onHide={() => setShowingDetail(false)}
                {...props}
            />
        </Container>
    );
};

export default Restaurant;
