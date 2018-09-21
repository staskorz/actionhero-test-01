"use strict"
const { Action, api } = require("actionhero")

module.exports.userAdd = class UserAdd extends Action {
  constructor() {
    super()
    this.name = "userAdd"
    this.description = "I add a user"
    this.outputExample = {}
    this.authenticated = false
    this.inputs = {
      userName: { required: true },
      password: { required: true },
    }
  }

  async run({ params: { userName, password } }) {
    await api.users.add(userName, password)
  }
}

module.exports.userDelete = class UserDelete extends Action {
  constructor() {
    super()
    this.name = "userDelete"
    this.description = "I delete a user"
    this.outputExample = {}
    this.authenticated = true
    this.inputs = {
      userName: { required: true },
      password: { required: true },
    }
  }

  async run({ params: { userName, password } }) {
    await api.users.delete(userName, password)
  }
}

module.exports.usersList = class UsersList extends Action {
  constructor() {
    super()
    this.name = "usersList"
    this.description = "I list all the users"
    this.outputExample = {}
    this.authenticated = false
    this.inputs = {}
  }

  async run({ response }) {
    const users = await api.users.list()

    response.users = users.map(({ userName }) => userName)
  }
}

module.exports.authenticate = class Authenticate extends Action {
  constructor() {
    super()
    this.name = "authenticate"
    this.description = "I authenticate a user"
    this.outputExample = {}
    this.authenticated = false
    this.inputs = {
      userName: { required: true },
      password: { required: true },
    }
  }

  async run({ response, params: { userName, password } }) {
    response.authenticated = await api.users.authenticate(userName, password)

    if (!response.authenticated) {
      throw new Error("unable to log in")
    }
  }
}
