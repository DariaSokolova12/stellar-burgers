import { modal, ingredients } from './selectors';
export {};
declare global {
  namespace Cypress {
    interface Chainable {
      addingIngredient(
        ingredientData: string,
        constructorData: string,
        ingredientName: string
      ): Chainable<void>;
      checkIngredientModal(
        ingredientName: string,
        buttonClose: string,
        overlay: string
      ): Chainable<void>;
      addAllIngredientsToCart(): Chainable<void>;
    }
  }
}
Cypress.Commands.add(
  'addingIngredient',
  (ingredientData, constructorData, ingredientName) => {
    cy.get(ingredientData).contains(ingredients.addButton).click();
    cy.get(constructorData).should('contain', ingredientName);
  }
);
Cypress.Commands.add('addAllIngredientsToCart', () => {
  cy.get(ingredients.bun.data).contains(ingredients.addButton).click();
  cy.get(ingredients.main.data).contains(ingredients.addButton).click();
  cy.get(ingredients.sauce.data).contains(ingredients.addButton).click();
});
Cypress.Commands.add(
  'checkIngredientModal',
  (ingredientName, buttonClose, overlay) => {
    // Открытие модального окна ингредиента
    cy.contains(ingredientName).click();
    cy.contains(modal.title).should('exist');

    // Закрытие модального окна по клику на крестик
    cy.get(buttonClose).click();
    cy.contains(modal.title).should('not.exist');

    // Открытие модального окна снова
    cy.contains(ingredientName).click();
    cy.contains(modal.title).should('exist');

    // Закрытие модального окна по клику на оверлей
    cy.get(overlay).click({ force: true });
    cy.contains(modal.title).should('not.exist');
  }
);
