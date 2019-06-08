import React, { useRef, useState } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import { MdReply } from 'react-icons/md';
import { isFunction } from 'lodash/fp';
import ReplyForm from '../forms/ReplyForm';

import { Header, User, Comment, Link, BlockQuote } from './StyledComponents';
import Stars from './Stars';

const Review = ({
    restaurant,
    username,
    comment,
    reply,
    rate,
    id,
    onReply,
}) => {
    const replyRef = useRef();
    const [replying, setReplying] = useState();

    const _handleSubmit = ({ comment }) => {
        onReply(restaurant, id, comment);
        setReplying(false);
    };

    return (
        <BlockQuote>
            <Header>
                <Stars rating={rate} />
                {isFunction(onReply) && [
                    <div key="button" ref={replyRef}>
                        <Link onClick={() => setReplying(!replying)}>
                            Reply
                            <MdReply />
                        </Link>
                    </div>,
                    <Overlay
                        key="popover"
                        show={!!replying}
                        target={replyRef.current}
                        placement="bottom"
                        container={replyRef.current}
                    >
                        <Popover id="popover-contained" title="Reply">
                            <ReplyForm
                                onSubmit={_handleSubmit}
                                onCancel={() => setReplying(false)}
                            />
                        </Popover>
                    </Overlay>,
                ]}
            </Header>
            <User>{username}</User>
            <Comment>"{comment}"</Comment>
            {!!reply && <User>Owner Reply</User>}
            {!!reply && <Comment>"{reply}"</Comment>}
        </BlockQuote>
    );
};

export default Review;
