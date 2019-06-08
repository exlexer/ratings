import React, { useRef, useState } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import { MdReply } from 'react-icons/md';
import { isFunction } from 'lodash/fp';
import ReplyForm from '../forms/ReplyForm';

import { Header, User, Comment, Link } from './StyledComponents';
import Stars from './Stars';

const Review = ({ username, comment, rate, id, onReply }) => {
    const replyRef = useRef();
    const [replying, setReplying] = useState();

    const _handleSubmit = ({ comment }) => {
        onReply(id, comment);
        setReplying(false);
    };

    return (
        <div>
            <Header>
                <User>{username}</User>
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
            <Comment>{comment}</Comment>
            <Stars rating={rate} />
        </div>
    );
};

export default Review;
