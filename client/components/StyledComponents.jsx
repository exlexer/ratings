import style from 'styled-components';

export const Container = style.div`
    width: 100%;
    padding: 8px 16px 50px 16px;
    display: flex;
`;

export const SmallColumnContainer = style.div`
    flex-grow: 1;
    flex-basis: 0;
`;

export const ColumnContainer = style.div`
    flex-grow: 2;
    flex-basis: 0;
`;

export const Title = style.div`
    font-weight: 500;
`;

export const Header = style.div`
    display: flex;
`;

export const User = style.div`
    font-weight: 500;
    flex-grow: 1;
`;

export const Comment = style.div`
    font-weight: 200;
    font-style: italic;
    padding: 5px;
`;

export const Link = style.button`
    border: none;
    background: none;
    color: #007bff;
    font-weight: 100;
    padding: 0;
    font-size: 12px;

    &:focus {
        outline: none;
    }
`;

export const Rating = style.div`
    color: #ddd;
    width: fit-content;
`;
