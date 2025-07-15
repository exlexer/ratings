import React, { useRef, useState } from "react";
import { Overlay, Popover } from "react-bootstrap";
import { MdReply } from "react-icons/md";
import { isFunction } from "lodash/fp";
import Form from "./Form";
import * as yup from "yup";

import {
  BlockQuote,
  Comment,
  Header,
  Link,
  ReplyContainer,
  User,
} from "./StyledComponents";
import Stars from "./Stars";

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

  const fields = [
    {
      key: "comment",
      validations: yup.string().required(),
      as: "textarea",
      props: {
        rows: "3",
      },
    },
  ];

  return (
    <BlockQuote>
      <Header>
        <Stars rating={rate} />
        {isFunction(onReply) && [
          <ReplyContainer key="button" ref={replyRef}>
            <Link onClick={() => setReplying(!replying)}>
              Reply
              <MdReply />
            </Link>
          </ReplyContainer>,
          <Overlay
            key="popover"
            show={!!replying}
            target={replyRef.current}
            placement="bottom"
            container={replyRef.current}
          >
            <Popover id="popover-contained" title="Reply">
              <Form
                onSubmit={_handleSubmit}
                fields={fields}
                actionText="Cancel"
                onActionClick={() => setReplying(false)}
              />
            </Popover>
          </Overlay>,
        ]}
      </Header>
      <User>{username}</User>
      <Comment>{comment}</Comment>
      {!!reply && <User>Owner Reply</User>}
      {!!reply && <Comment>"{reply}"</Comment>}
    </BlockQuote>
  );
};

export default Review;
