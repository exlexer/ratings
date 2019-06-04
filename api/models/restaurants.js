const db = require('../lib/db');

module.exports = {
    createRestaurant(name, owner) {
        return db.query(
            `
            insert into restaurants (name, owner)
            values ($1, (
                select id
                from users
                where username = $2
            ))
            returning *
        `,
            [name, owner],
        );
    },
    getRestaurants() {
        return db.query(`
            select name,
                id,
                (
                    select avg(rate)
                    from reviews
                    where restaurant = r.id
                ) rating
            from restaurants r
            order by rating desc
        `);
    },
    getRestaurantsByOwner(owner) {
        return db.query(
            `
            select name,
                id,
                (
                    select avg(rate)
                    from reviews
                    where restaurant = r.id
                ) rating
            from restaurants r
            where owner = $1
            order by rating desc
        `,
            [owner],
        );
    },
};
