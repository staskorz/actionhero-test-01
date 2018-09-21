"use strict"
const { Action, api } = require("actionhero")

module.exports.postAdd = class PostAdd extends Action {
  constructor() {
    super()
    this.name = "postAdd"
    this.description = "I add a post"
    this.outputExample = {}
    this.authenticated = true
    this.inputs = {
      userName: { required: true },
      password: { required: true },
      title: { required: true },
      content: { required: true },
    }
  }

  async run({ params: { userName, title, content } }) {
    await api.blog.postAdd(userName, title, content)
  }
}

module.exports.postView = class PostView extends Action {
  constructor() {
    super()
    this.name = "postView"
    this.description = "I view a post"
    this.outputExample = {}
    this.authenticated = false
    this.inputs = {
      userName: { required: true },
      title: { required: true },
    }
  }

  async run({ response, params: { userName, title } }) {
    response.post = await api.blog.postView(userName, title)
  }
}

module.exports.postsList = class PostsList extends Action {
  constructor() {
    super()
    this.name = "postsList"
    this.description = "I list all of user's posts"
    this.outputExample = {}
    this.authenticated = false
    this.inputs = {
      userName: { required: true },
    }
  }

  async run({ response, params: { userName } }) {
    response.posts = await api.blog.postsList(userName)
  }
}

module.exports.postEdit = class PostEdit extends Action {
  constructor() {
    super()
    this.name = "postEdit"
    this.description = "I edit a post"
    this.outputExample = {}
    this.authenticated = true
    this.inputs = {
      userName: { required: true },
      password: { required: true },
      title: { required: true },
      content: { required: true },
    }
  }

  async run({ params: { userName, title, content } }) {
    await api.blog.postEdit(userName, title, content)
  }
}

module.exports.postDelete = class PostDelete extends Action {
  constructor() {
    super()
    this.name = "postDelete"
    this.description = "I delete a post"
    this.outputExample = {}
    this.authenticated = true
    this.inputs = {
      userName: { required: true },
      password: { required: true },
      title: { required: true },
    }
  }

  async run({ params: { userName, title } }) {
    await api.blog.postDelete(userName, title)
  }
}

module.exports.commentAdd = class CommentAdd extends Action {
  constructor() {
    super()
    this.name = "commentAdd"
    this.description = "I add a comment"
    this.outputExample = {}
    this.authenticated = false
    this.inputs = {
      userName: { required: true },
      title: { required: true },
      commenterName: { required: true },
      comment: { required: true },
    }
  }

  async run({ params: { userName, title, commenterName, comment } }) {
    await api.blog.commentAdd(userName, title, commenterName, comment)
  }
}

module.exports.commentsView = class CommentsView extends Action {
  constructor() {
    super()
    this.name = "commentsView"
    this.description = "I show all comments for a post"
    this.outputExample = {}
    this.authenticated = false
    this.inputs = {
      userName: { required: true },
      title: { required: true },
    }
  }

  async run({ response, params: { userName, title } }) {
    response.comments = await api.blog.commentsView(userName, title)
  }
}

module.exports.commentDelete = class CommentDelete extends Action {
  constructor() {
    super()
    this.name = "commentDelete"
    this.description = "I delete a comment"
    this.outputExample = {}
    this.authenticated = true
    this.inputs = {
      userName: { required: true },
      password: { required: true },
      title: { required: true },
      commentId: { required: true },
    }
  }

  async run({ params: { userName, title, commentId } }) {
    await api.blog.commentDelete(userName, title, commentId)
  }
}
