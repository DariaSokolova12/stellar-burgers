import { ingredients, modal, globalInfo } from '../support/selectors';
import '../support/customCommands';

describe('Интеграционные тесты для страницы конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');
    cy.intercept('POST', '**/auth/login', { fixture: 'user.json' }).as('login');
      // Отключаем native fetch
    Cypress.on('window:before:load', (win) => {
      delete (win as any).fetch
    });

    // Переход на страницу
    cy.visit('http://localhost:4000');

    // Ждём данные
    cy.wait('@getIngredients');
  });

  it('Добавление ингредиентов, авторизация и оформление заказа', () => {
    // Находим ингредиенты по видимому тексту внутри карточек
    cy.contains('Краторная булка N-200i').parents('[draggable]').click();
    cy.get('.constructor-element__row').should('contain', 'Краторная булка N-200i');

    cy.contains('Биокотлета из марсианской Магнолии').parents('[draggable]').click();
    cy.get('.constructor-element__row').should('contain', 'Биокотлета из марсианской Магнолии');

    cy.contains('Соус Spicy-X').parents('[draggable]').click();
    cy.get('.constructor-element__row').should('contain', 'Соус Spicy-X');

    // Переход к оформлению заказа
    cy.get('button').contains('Оформить заказ').click();
    cy.url().should('include', '/login');

    // Авторизация
    cy.get('input[name="email"]').type('wawa@wa.ru');
    cy.get('input[name="password"]').type('wawa123');
    cy.get('button').contains('Войти').click();

    cy.wait('@login');
    cy.url().should('not.include', '/login');

    // Повторно жмём "Оформить заказ"
    cy.get('button').contains('Оформить заказ').click();
    cy.wait('@createOrder');

    // Проверка модалки
    cy.get('[data-test-id="modal"]').should('exist').and('be.visible');
    cy.get('[data-test-id="order-number"]').should('contain', '911');

    cy.get('[data-test-id="modal-close"]').click();
    cy.get('[data-test-id="modal"]').should('not.exist');

    // Проверка, что всё очищено
    cy.get('.constructor-element__row').should('not.exist');
  });
});
