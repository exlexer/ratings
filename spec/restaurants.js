const request = require('supertest');
const app = require('../server');
const db = require('../api/lib/db');
const { find, includes, map } = require('lodash/fp');

describe('Restaurants', () => {
    let server;
    let agent;

    let restaurantId;
    let reviewId;

    before(async () => {
        await db.query('begin');
        server = app.listen();
        agent = request.agent(server);
    });

    after(async () => {
        await db.query('rollback');
        server.close();
        agent = null;
    });

    it('should fail when a user role creates a restaurant', () =>
        agent
            .post('/api/users/signin')
            .send({ username: 'User', password: 'example' })
            .expect(200)
            .then(() =>
                agent
                    .post('/api/restaurants')
                    .send({ name: 'Test Restaurant' })
                    .expect(401),
            ));

    it('should succeed when an owner role creates a restaurant', () =>
        agent
            .post('/api/users/signin')
            .send({ username: 'Owner', password: 'example' })
            .expect(200)
            .then(() =>
                agent
                    .post('/api/restaurants')
                    .send({ name: 'Test Restaurant' })
                    .expect(200),
            )
            .then(res => {
                restaurantId = res.body.id;
            }));

    it('should retrieve restaurants', () =>
        agent
            .get('/api/restaurants')
            .send()
            .expect(200)
            .expect(res => {
                if (!includes(restaurantId, map(({ id }) => id, res.body))) {
                    throw new Error('restaurant not created');
                }
            }));

    it('should fail when a user role patches a restaurant', () =>
        agent
            .post('/api/users/signin')
            .send({ username: 'User', password: 'example' })
            .expect(200)
            .then(() =>
                agent
                    .patch(`/api/restaurants/${restaurantId}`)
                    .send({ name: 'Test Restaurant 2' })
                    .expect(401),
            )
            .then(() =>
                agent
                    .get('/api/restaurants')
                    .send()
                    .expect(200)
                    .expect(res => {
                        const restaurant = find(
                            r => r.id === restaurantId,
                            res.body,
                        );
                        if (restaurant.name === 'Test Restaurant 2') {
                            throw new Error('Name should not have changed');
                        }
                    }),
            ));

    it('should fail when an owner role patches a restaurant', () =>
        agent
            .post('/api/users/signin')
            .send({ username: 'Owner', password: 'example' })
            .expect(200)
            .then(() =>
                agent
                    .patch(`/api/restaurants/${restaurantId}`)
                    .send({ name: 'Test Restaurant 2' })
                    .expect(401),
            )
            .then(() =>
                agent
                    .get('/api/restaurants')
                    .send()
                    .expect(200)
                    .expect(res => {
                        const restaurant = find(
                            r => r.id === restaurantId,
                            res.body,
                        );
                        if (restaurant.name === 'Test Restaurant 2') {
                            throw new Error('Name should not have changed');
                        }
                    }),
            ));

    it('should succeed when an admin role patches a restaurant', () =>
        agent
            .post('/api/users/signin')
            .send({ username: 'Admin', password: 'example' })
            .expect(200)
            .then(() =>
                agent
                    .patch(`/api/restaurants/${restaurantId}`)
                    .send({ name: 'Test Restaurant 2' })
                    .expect(200),
            )
            .then(() =>
                agent
                    .get('/api/restaurants')
                    .send()
                    .expect(200)
                    .expect(res => {
                        const restaurant = find(
                            r => r.id === restaurantId,
                            res.body,
                        );
                        if (restaurant.name !== 'Test Restaurant 2') {
                            throw new Error('Name should have changed');
                        }
                    }),
            ));

    it('should succeed when a user role reviews a restaurant', () =>
        agent
            .post('/api/users/signin')
            .send({ username: 'User', password: 'example' })
            .expect(200)
            .then(() =>
                agent
                    .post(`/api/restaurants/${restaurantId}/reviews`)
                    .send({
                        rate: 3,
                        comment: 'Pretty Good',
                        date: '01/20/2019',
                    })
                    .expect(200),
            )
            .then(res => {
                reviewId = res.body.id;
            }));

    it('should succeed when an owner role replies to a review', () =>
        agent
            .post('/api/users/signin')
            .send({ username: 'Owner', password: 'example' })
            .expect(200)
            .then(() =>
                agent
                    .post(
                        `/api/restaurants/${restaurantId}/reviews/${reviewId}/reply`,
                    )
                    .send({
                        comment: 'Thank You!',
                    })
                    .expect(200),
            ));

    it('should succeed when an admin role replies to a review', () =>
        agent
            .post('/api/users/signin')
            .send({ username: 'Admin', password: 'example' })
            .expect(200)
            .then(() =>
                agent
                    .delete(
                        `/api/restaurants/${restaurantId}/reviews/${reviewId}`,
                    )
                    .send()
                    .expect(200),
            ));

    it('should fail when a user role deletes a restaurant', () =>
        agent
            .post('/api/users/signin')
            .send({ username: 'User', password: 'example' })
            .expect(200)
            .then(() =>
                agent
                    .delete(`/api/restaurants/${restaurantId}`)
                    .send()
                    .expect(401),
            ));

    it('should succeed when an owner role deletes a restaurant', () =>
        agent
            .post('/api/users/signin')
            .send({ username: 'Owner', password: 'example' })
            .expect(200)
            .then(() =>
                agent
                    .delete(`/api/restaurants/${restaurantId}`)
                    .send()
                    .expect(401),
            ));

    it('should succeed when an admin role deletes a restaurant', () =>
        agent
            .post('/api/users/signin')
            .send({ username: 'Admin', password: 'example' })
            .expect(200)
            .then(() =>
                agent
                    .delete(`/api/restaurants/${restaurantId}`)
                    .send()
                    .expect(200),
            ));
});
