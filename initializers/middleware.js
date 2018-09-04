"use strict"
const { Initializer, api } = require("actionhero")

module.exports = class AuthenticationMiddleware extends Initializer {
  constructor() {
    super()
    this.name = "middleware"
  }

  async initialize() {
    const middleware = {
      name: this.name,
      global: true,
      preProcessor: async ({ actionTemplate, params }) => {
        if (actionTemplate.authenticated === true) {
          const match = await api.users.authenticate(
            params.userName,
            params.password,
          )

          if (!match) {
            throw new Error(
              "Authentication failed. userName and password required.",
            )
          }
        }
      },
    }

    api.actions.addMiddleware(middleware)
  }
}
