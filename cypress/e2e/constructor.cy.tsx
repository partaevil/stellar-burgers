/// <reference types="cypress" />

describe('Burger Constructor Page E2E Tests', () => {
  const BUN_NAME = 'Краторная булка N-200i';
  const BUN_ID = '643d69a5c3f7b9001cfa093c';
  const MAIN_INGREDIENT_NAME = 'Биокотлета из марсианской Магнолии';
  const MAIN_INGREDIENT_ID = '643d69a5c3f7b9001cfa0941';
  const SAUCE_INGREDIENT_NAME = 'Соус Spicy-X';
  const SAUCE_INGREDIENT_ID = '643d69a5c3f7b9001cfa0942';

  const API_URL =
    Cypress.env('API_URL') || 'https://norma.nomoreparties.space/api';

  beforeEach(() => {
    cy.fixture('ingredients.json').then((ingredientsData) => {
      cy.intercept('GET', `${API_URL}/ingredients`, {
        statusCode: 200,
        body: {
          success: true,
          data: ingredientsData
        }
      }).as('getIngredients');
    });

    cy.fixture('user.json').then((userData) => {
      cy.intercept('GET', `${API_URL}/auth/user`, {
        statusCode: 200,
        body: userData
      }).as('getUser');
    });

    cy.fixture('order.json').then((orderData) => {
      cy.intercept('POST', `${API_URL}/orders`, {
        statusCode: 200,
        body: orderData
      }).as('createOrder');
    });

    window.localStorage.setItem('refreshToken', 'mockTestRefreshToken');
    cy.setCookie('accessToken', 'mockTestAccessToken');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should load ingredients correctly', () => {
    cy.get(`[data-cy="ingredient-${BUN_NAME}"]`).should('be.visible');
    cy.get(`[data-cy="ingredient-${MAIN_INGREDIENT_NAME}"]`).should(
      'be.visible'
    );
    cy.get(`[data-cy="ingredient-${SAUCE_INGREDIENT_NAME}"]`).should(
      'be.visible'
    );
  });

  describe('Adding ingredients to constructor', () => {
    it('should add a bun and a filling to the constructor', () => {
      cy.get(`[data-cy="ingredient-${BUN_NAME}"]`)
        .contains('button', 'Добавить')
        .click();
      cy.get('[data-cy="burger-constructor"]').as('constructorSection');

      cy.get('@constructorSection')
        .find('[data-cy="constructor-bun-top"]')
        .contains(`${BUN_NAME} (верх)`)
        .should('be.visible');
      cy.get('@constructorSection')
        .find('[data-cy="constructor-bun-bottom"]')
        .contains(`${BUN_NAME} (низ)`)
        .should('be.visible');

      cy.get(`[data-cy="ingredient-${MAIN_INGREDIENT_NAME}"]`)
        .contains('button', 'Добавить')
        .click();

      cy.get('@constructorSection')
        .find('[data-cy="constructor-ingredients-list"]')
        .contains(MAIN_INGREDIENT_NAME)
        .should('be.visible');

      cy.get(`[data-cy="ingredient-${BUN_NAME}"]`)
        .find('div.counter')
        .find('p')
        .should('have.text', '2')
        .and('be.visible');

      cy.get(`[data-cy="ingredient-${MAIN_INGREDIENT_NAME}"]`)
        .find('div.counter')
        .find('p')
        .should('have.text', '1')
        .and('be.visible');
    });
  });

  describe('Ingredient Details Modal', () => {
    it('should open ingredient details modal on click and close it', () => {
      cy.get(`[data-cy="ingredient-link-${MAIN_INGREDIENT_ID}"]`).click();

      cy.get('#modals').as('modalRoot');
      cy.get('@modalRoot')
        .find('[data-cy="modal-title"]')
        .contains('Детали ингредиента')
        .should('be.visible');
      cy.get('@modalRoot').contains(MAIN_INGREDIENT_NAME).should('be.visible');

      cy.get('@modalRoot').find('[data-cy="modal-close-button"]').click();
      cy.get('@modalRoot').should('be.empty');
    });

    it('should close ingredient details modal by clicking overlay', () => {
      cy.get(`[data-cy="ingredient-link-${SAUCE_INGREDIENT_ID}"]`).click();

      cy.get('#modals').as('modalRoot');
      cy.get('@modalRoot')
        .find('[data-cy="modal-title"]')
        .contains('Детали ингредиента')
        .should('be.visible');

      cy.get('[data-cy="modal-overlay"]').click({ force: true });
      cy.get('@modalRoot').should('be.empty');
    });
  });

  describe('Order Creation', () => {
    it('should allow creating an order, show order number in modal, and reset constructor', () => {
      cy.get(`[data-cy="ingredient-${BUN_NAME}"]`)
        .contains('button', 'Добавить')
        .click();
      cy.get(`[data-cy="ingredient-${MAIN_INGREDIENT_NAME}"]`)
        .contains('button', 'Добавить')
        .click();
      cy.get(`[data-cy="ingredient-${SAUCE_INGREDIENT_NAME}"]`)
        .contains('button', 'Добавить')
        .click();

      cy.get('[data-cy="burger-constructor"]').as('constructorSection');
      cy.get('[data-cy="order-button"]').click();

      cy.wait('@createOrder').its('response.statusCode').should('eq', 200);

      cy.get('#modals').as('modalRoot');
      cy.fixture('order.json').then((orderFixture) => {
        cy.get('@modalRoot')
          .find('[data-cy="order-number"]')
          .contains(orderFixture.order.number.toString())
          .should('be.visible');
      });
      cy.get('@modalRoot')
        .contains('идентификатор заказа')
        .should('be.visible');

      cy.get('@modalRoot').find('[data-cy="modal-close-button"]').click();
      cy.get('@modalRoot').should('be.empty');

      cy.get('[data-cy="constructor-placeholder-bun-top"]').should(
        'be.visible'
      );
      cy.get('[data-cy="constructor-placeholder-ingredients"]').should(
        'be.visible'
      );
      cy.get('[data-cy="constructor-total-price"]')
        .contains('0')
        .should('be.visible');

      cy.get(`[data-cy="ingredient-${BUN_NAME}"]`)
        .find('div.counter')
        .should('not.exist');
      cy.get(`[data-cy="ingredient-${MAIN_INGREDIENT_NAME}"]`)
        .find('div.counter')
        .should('not.exist');
      cy.get(`[data-cy="ingredient-${SAUCE_INGREDIENT_NAME}"]`)
        .find('div.counter')
        .should('not.exist');
    });

    it('should redirect to login if trying to order while unauthenticated (after clearing tokens)', () => {
      cy.clearLocalStorage('refreshToken');
      cy.clearCookie('accessToken');

      cy.intercept('GET', `${API_URL}/auth/user`, {
        statusCode: 401,
        body: { success: false, message: 'You should be authorised' }
      }).as('getUnauthUser');

      cy.visit('/');
      cy.wait('@getIngredients');

      cy.get(`[data-cy="ingredient-${BUN_NAME}"]`)
        .contains('button', 'Добавить')
        .click();
      cy.get(`[data-cy="ingredient-${MAIN_INGREDIENT_NAME}"]`)
        .contains('button', 'Добавить')
        .click();

      cy.get('[data-cy="order-button"]').click();

      cy.url().should('include', '/login');
      cy.contains('Вход').should('be.visible');
    });
  });
});
