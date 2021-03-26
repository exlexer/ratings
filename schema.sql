CREATE TABLE users (
    id serial NOT NULL PRIMARY KEY,
    username text,
    role text,
    password text,
    salt text
);

CREATE TABLE access_tokens (
    id serial NOT NULL PRIMARY KEY,
    token text NOT NULL,
    "user" integer REFERENCES users(id)
);

CREATE TABLE restaurants (
    id serial NOT NULL PRIMARY KEY,
    name text,
    owner text
);


CREATE TABLE reviews (
    id serial NOT NULL PRIMARY KEY,
    "user" integer REFERENCES users(id),
    restaurant integer REFERENCES restaurants(id),
    rate real,
    visit_date timestamp without time zone,
    comment text
);

