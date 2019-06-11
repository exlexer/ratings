/// <reference types="Cypress" />

context('Actions', () => {
    const dateOffset = new Date().valueOf();

    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it('Signup', () => {
        cy.get('.btn-secondary').click();

        cy.get('input[name="username"]').type(`user${dateOffset}`);

        cy.get('input[name="password"]').type('example');

        cy.get('.btn-info').click();

        cy.get('.navbar').should('have.length', 2);
    });

    it('Make Owner', () => {
        cy.get('input[name="username"]')
            .type('Admin')
            .should('have.value', 'Admin');

        cy.get('input[name="password"]')
            .type('example')
            .should('have.value', 'example');

        cy.get('.btn-info').click();

        cy.get(`input[value="user${dateOffset}"]`)
            .parent()
            .next()
            .find('select')
            .select('Owner')
            .parent()
            .next()
            .find('button')
            .click();

        //     // TODO: check that is owner
    });

    it('Add restaurant', () => {
        cy.get('input[name="username"]').type(`user${dateOffset}`);

        cy.get('input[name="password"]').type('example');

        cy.get('.btn-info').click();

        cy.wait(1000);

        cy.get('button[name="new-restaurant"]').click();

        cy.get('input[name="name"]').type(
            `SuperCool Express Takeout ${dateOffset}`,
        );

        cy.get('button[type="submit"]').click();

        cy.wait(1000);

        cy.get('.container')
            .children()
            .then(restaurants => {
                expect(restaurants.length).to.equal(1);
            });
    });

    it('Signup and add a review restaurant', () => {
        cy.get('.btn-secondary').click();

        cy.get('input[name="username"]').type(`user2${dateOffset}`);

        cy.get('input[name="password"]').type('example');

        cy.get('.btn-info').click();
        cy.wait(1000);

        cy.get('div')
            .contains(`SuperCool Express Takeout ${dateOffset}`)
            .next()
            .children()
            .last()
            .click();

        cy.get('textarea[name="comment"]').type('Fantastic food!');
        cy.get('input[name="date"]').type('2019-01-01');
        cy.get('button[type="submit"]').click();

        // TODO: Make sure that updates
    });

    it('Signin as Owner and reply to review', () => {
        // cy.get('.btn-secondary').click();

        cy.get('input[name="username"]').type(`user${dateOffset}`);

        cy.get('input[name="password"]').type('example');

        cy.get('.btn-info').click();
        cy.wait(1000);

        cy.get('div')
            .contains(`SuperCool Express Takeout ${dateOffset}`)
            .parent()
            .next()
            .children()
            .within(() => {
                cy.get('div')
                    .contains('user2')
                    .prev()
                    .find('button')
                    .first()
                    .click();
            });

        cy.get('textarea[name="comment"]').type('Thanks a bunch!');
        cy.get('button[type="submit"]').click();
        // TODO: Make sure that updates
    });

    it('Signin as Admin and delete new users and restaurants', () => {
        // cy.get('.btn-secondary').click();

        cy.get('input[name="username"]').type('Admin');

        cy.get('input[name="password"]').type('example');

        cy.get('.btn-info').click();
        cy.wait(1000);

        cy.get(`input[value="user2${dateOffset}"]`)
            .parent()
            .parent()
            .within(() => {
                cy.get('.btn-danger').click();
            });

        cy.get(`input[value="user${dateOffset}"]`)
            .parent()
            .parent()
            .within(() => {
                cy.get('.btn-danger').click();
            });

        cy.get('a[data-rb-event-key="restaurants"]').click();

        cy.get(`input[value="SuperCool Express Takeout ${dateOffset}"]`)
            .parent()
            .parent()
            .within(() => {
                cy.get('.btn-danger').click();
            });
    });
});
