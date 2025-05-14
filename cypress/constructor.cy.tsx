import { ingredients, modal, globalInfo } from './support/selectors';

describe('Интеграционные тесты для страницы конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.setCookie('accessToken', 'testAccessToken');
    localStorage.setItem('refreshToken', 'testRefreshToken');
    cy.visit(globalInfo.localUrl);
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Добавление ингредиентов в конструктор', () => {
    // Добавление булки
    cy.addingIngredient(
      ingredients.bun.data,
      ingredients.bun.constructor,
      ingredients.bun.name
    );
    // Добавление начинки
    cy.addingIngredient(
      ingredients.main.data,
      ingredients.main.constructor,
      ingredients.main.name
    );
    // Добавление соуса
    cy.addingIngredient(
      ingredients.sauce.data,
      ingredients.sauce.constructor,
      ingredients.sauce.name
    );
  });

  it('Работа модальных окон', () => {
    // Проверка при клике на булку
    cy.checkIngredientModal(
      ingredients.bun.name,
      modal.closeButtonData,
      modal.overlayData
    );
    // Проверка при клике на начинку
    cy.checkIngredientModal(
      ingredients.main.name,
      modal.closeButtonData,
      modal.overlayData
    );
    // Проверка при клике на соус
    cy.checkIngredientModal(
      ingredients.sauce.name,
      modal.closeButtonData,
      modal.overlayData
    );
  });

  it('Создание заказа', () => {
    // Добавление ингредиентов
    cy.addAllIngredientsToCart();

    // Оформление заказа
    cy.get(globalInfo.createOrderBtnData).click();
    cy.contains(globalInfo.orderNumber).should('exist');

    // Закрытие модального окна
    cy.get(modal.overlayData).click({ force: true });
    cy.contains(globalInfo.orderNumber).should('not.exist');

    // Проверка, что конструктор пуст
    cy.get(ingredients.bun.constructor).should(
      'not.contain',
      ingredients.bun.name
    );
    cy.get(ingredients.main.constructor).should(
      'not.contain',
      ingredients.main.name
    );
    cy.get(ingredients.main.constructor).should(
      'not.contain',
      ingredients.sauce.name
    );
  });
});