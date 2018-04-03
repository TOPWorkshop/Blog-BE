const axios = require('axios');

class BlogLibrary {
  constructor() {
    this.baseUrl = 'https://jsonplaceholder.typicode.com';
  }

  async getPosts() {
    const { data } = await axios.get(this.baseUrl + '/posts');

    return data;
  }

  async getPost(postId) {
    const { data } = await axios.get(this.baseUrl + '/posts/' + postId);

    return data;
  }

  async getAuthor(authorId) {
    const { data } = await axios.get(this.baseUrl + '/users/' + authorId);

    return data;
  }

  async getPostComments(postId) {
    const { data } = await axios.get(this.baseUrl + '/posts/' + postId + '/comments');

    return data;
  }
}

module.exports = new BlogLibrary();
