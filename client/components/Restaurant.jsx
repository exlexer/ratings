import React, { useRef, useState } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import { map } from 'lodash/fp';

import Review from './Review';
import Stars from './Stars';
import DetailModal from './DetailModal';
import {
    Container,
    SmallColumnContainer,
    ColumnContainer,
    Title,
    Link,
} from './StyledComponents';
import ReviewForm from '../forms/ReviewForm';

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
                <div>Highest Rating</div>
                <Review {...props.highestRating} />
                {!!props.reviews &&
                    props.reviews.length > 1 && [
                        <div key="label">Lowest Rating</div>,
                        <Review key="review" {...props.lowestRating} />,
                    ]}
            </ColumnContainer>
        );

    const _getRecentReviews = () =>
        !!props.recent &&
        !!props.recent.length && (
            <ColumnContainer>
                Most Recent Reviews
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
                Unreplied Reviews
                {map(
                    r => (
                        <Review key={r.id} {...r} onReply={props.onReply} />
                    ),
                    props.reviews,
                )}
            </ColumnContainer>
        );

    const _getZeroState = () => !hasData && props.zeroState;

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
                        <ReviewForm
                            onSubmit={_handleSubmit}
                            onCancel={() => setSettingRating()}
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
