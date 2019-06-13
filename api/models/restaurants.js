const db = require('../lib/db');
const { forEach, join, includes } = require('lodash/fp');
const forEachWithKeys = forEach.convert({ cap: false });

const FIELDS = ['name', 'owner'];

module.exports = {
    checkRestaurantName,
    createRestaurant,
    deleteRestaurant,
    getRestaurants,
    getRestaurantsByOwner,
    updateRestaurant,
};

function checkRestaurantName(name) {
    return db
        .query(
            `
                select true as exists
                from restaurants
                where name = $1
            `,
            [name],
        )
        .then(data => !!data.exists);
}

function createRestaurant(name, owner) {
    return db.query(
        `
        insert into restaurants (name, owner)
        values ($1, $2)
        returning *
    `,
        [name, owner],
    );
}

function getRestaurants(sortBy, sortOrder) {
    return db.query(
        `
        select name,
            id,
            (
                select CASE
                WHEN avg(rate) is not NULL
                then avg(rate)::numeric
                else 0
                end
                from reviews
                where restaurant = r.id
            ) rating
        from restaurants r
        order by ${sortBy} ${sortOrder}
    `,
    );
}

function getRestaurantsByOwner(sortBy, sortOrder, owner) {
    return db.query(
        `
        select name,
            id,
            (
                select CASE
                WHEN avg(rate) is not NULL
                then avg(rate)::numeric
                else 0
                end
                from reviews
                where restaurant = r.id
            ) rating
        from restaurants r
        where owner = $1
        order by ${sortBy} ${sortOrder}
    `,
        [owner],
    );
}

function deleteRestaurant(restaurant) {
    return db.query(
        `
                    delete from restaurants
                    where id = $1
                `,
        [restaurant],
    );
}

function updateRestaurant(restaurant, options) {
    const values = [];
    const updates = [];

    forEachWithKeys((value, field) => {
        if (includes(field, FIELDS)) {
            values.push(value);
            updates.push(`${field} = $${values.length}`);
        }
    }, options);

    values.push(restaurant);

    const query = `
        update restaurants
        set ${join(', ', updates)}
        where id = $${values.length}`;

    return db.query(query, values);
}
