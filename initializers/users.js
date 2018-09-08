"use strict"
const { Initializer, api } = require("actionhero")
const bcrypt = require("bcrypt")

module.exports = class Users extends Initializer {
  constructor() {
    super()
    this.name = "users"
    this.saltRounds = 10
    this.userHash = "users"
  }

  async initialize() {
    const redis = api.redis.clients.client

    api.users = {
      add: async (userName, password) => {
        const savedUser = await redis.hget(this.userHash, userName)

        if (savedUser) {
          throw new Error("userName already exists")
        }

        const hashedPassword = await api.users.cryptPassword(password)

        const data = {
          userName,
          hashedPassword,
          createdAt: new Date().getTime(),
        }

        await redis.hset(this.userHash, userName, JSON.stringify(data))
      },

      list: async () => {
        const userData = await redis.hgetall(this.userHash)

        return Object.keys(userData).map(k => {
          const { hashedPassword, ...data } = JSON.parse(userData[k])

          return data
        })
      },

      authenticate: async (userName, password) => {
        try {
          const data = await redis.hget(this.userHash, userName)

          const parsedData = JSON.parse(data)

          return api.users.comparePassword(parsedData.hashedPassword, password)
        } catch (error) {
          throw new Error(`userName does not exist (${error})`)
        }
      },

      delete: async userName => {
        await redis.del(this.userHash, userName)

        const titles = await api.blog.postList(userName)

        for (let i in titles) {
          await api.blog.deletePost(userName, titles[i])
        }
      },

      cryptPassword: async password => bcrypt.hash(password, this.saltRounds),

      comparePassword: async (hashedPassword, userPassword) =>
        bcrypt.compare(userPassword, hashedPassword),
    }
  }
}
