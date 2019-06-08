const db = require('../lib/db');
const { forEach, join, includes } = require('lodash/fp');
const forEachWithKeys = forEach.convert({ cap: false });

const FIELDS = ['name'];

module.exports = {
    createRestaurant,
    getRestaurants,
    getRestaurantsByOwner,
    deleteRestaurant,
    updateRestaurant,
};

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
    console.log(`${sortBy} ${sortOrder}`);
    return db.query(
        `
        select name,
            id,
            (
                select CASE
                WHEN avg(rate) is not NULL
                then avg(rate)::integer
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
    console.log(`${sortBy} ${sortOrder}`);
    return db.query(
        `
        select name,
            id,
            (
                select CASE
                WHEN avg(rate) is not NULL
                then avg(rate)::integer
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

    console.log(query);

    return db.query(query, values);
}
