import style, { css } from 'styled-components';

export const Container = style.div`
    width: 100%;
    padding: 8px 16px 50px 16px;
    display: flex;
`;

export const BlockQuote = style.div`
    background: var(--light);
    border-left: 4px solid var(--info);
    padding: 8px 16px;
`;

export const ReviewHeading = style.div`
    padding: 8px;
`;

export const ReplyContainer = style.div`
    padding-left: 10px;
`;

export const SmallColumnContainer = style.div`
    flex-grow: 1;
    flex-basis: 0;
    padding-left: 8px;
`;

export const ColumnContainer = style.div`
    flex-grow: 2;
    flex-basis: 0;
    padding-left: 8px;
`;

export const Title = style.div`
    font-weight: 500;
`;

export const Header = style.div`
    display: flex;
`;

export const User = style.div`
    color: var(--gray-dark);
    font-weight: 500;
    padding-right: 10px;
`;

export const Comment = style.div`
    color: var(--info);
    padding: 10px 16px;
    font-weight: 100;
    font-style: italic;
    border-radius: 2px;
`;

export const Link = style.button`
    border: none;
    background: none;
    color: var(--info);
    font-weight: 100;
    padding: 0;
    font-size: 12px;

    &:focus {
        outline: none;
    }
`;

export const Rating = style.div`
    color: var(--secondary);
    width: fit-content;

    &:hover {
        ${props =>
            props.clickable &&
            css`
                cursor: pointer;
            `}
    }
`;
