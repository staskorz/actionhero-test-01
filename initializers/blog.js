"use strict"
const { Initializer, api } = require("actionhero")

module.exports = class Blog extends Initializer {
  constructor() {
    super()
    this.name = "blog"
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize() {
    const redis = api.redis.clients.client

    api.blog = {
      separator: ";",
      postPrefix: "posts",
      commentPrefix: "comments",

      postAdd: async (userName, title, content) => {
        const key = api.blog.buildTitleKey(userName, title)

        const data = {
          content,
          title,
          userName,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
        }

        await redis.hmset(key, data)
      },

      postView: async (userName, title) => {
        const key = api.blog.buildTitleKey(userName, title)

        return redis.hgetall(key)
      },

      postList: async userName => {
        const search = [api.blog.postPrefix, userName, "*"].join(
          api.blog.separator,
        )

        const keys = await redis.keys(search)

        const titles = keys
          .map(key => {
            const parts = key.split(api.blog.separator)

            return parts[parts.length - 1]
          })
          .sort()

        return titles
      },

      postEdit: async (userName, title, content) => {
        const key = api.blog.buildTitleKey(userName, title)

        const data = await api.blog.postView(key)

        const newData = {
          content,
          title,
          userName,
          createdAt: data.createdAt,
          updatedAt: new Date().getTime(),
        }

        await redis.hmset(key, newData)
      },

      postDelete: async (userName, title) => {
        const key = api.blog.buildTitleKey(userName, title)

        await redis.del(key)

        const commentKey = api.blog.buildCommentKey(userName, title)

        await redis.del(commentKey)
      },

      commentAdd: async (userName, title, commenterName, comment) => {
        const key = api.blog.buildCommentKey(userName, title)

        const commentId = api.blog.buildCommentId(commenterName)

        const data = {
          comment,
          commenterName,
          createdAtt: new Date().getTime(),
          commentId,
        }

        await redis.hset(key.commentId, JSON.stringify(data))
      },

      commentsView: async (userName, title) => {
        const key = api.blog.buildCommentKey(userName, title)

        const data = await redis.hgetall(key)

        const comments = Object.keys(data).map(key => {
          const comment = data[key]

          return JSON.parse(comment)
        })

        return comments
      },

      commentDelete: async (userName, title, commentId) => {
        const key = api.blog.buildCommentKey(userName, title)

        await redis.hdel(key, commentId)
      },

      buildTitleKey: (userName, title) =>
        api.blog.postPrefix +
        api.blog.separator +
        userName +
        api.blog.separator +
        title,

      buildCommentKey: (userName, title) =>
        api.blog.commentPrefix +
        api.blog.separator +
        userName +
        api.blog.separator +
        title,

      buildCommentId: commenterName => commenterName + new Date().getTime(),
    }
  }
}
