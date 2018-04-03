const blog = require('../libraries/blog');

const AbstractController = require('./index');

class BlogController extends AbstractController {
  constructor() {
    super();

    this.posts = [{
      id: 1,
      title: 'title-1',
      body: 'body-1',
    }, {
      id: 2,
      title: 'title-2',
      body: 'body-2',
    }];
  }

  initRouter() {
    // GET /posts
    // GET /posts/1

    this.router.get('/posts', (request, response) => this.listPosts(request, response));
    this.router.get('/posts/:postId', (request, response, next) => this.retrievePost(request, response, next));
  }

  async listPosts(request, response) {
    const posts = await blog.getPosts();

    response.json(posts);
  }

  async retrievePost(request, response, next) {
    const { postId } = request.params;

    const post = await blog.getPost(postId);

    if (!post) {
      const error = new Error('post not found');

      next(error);

      return;
    }

    post.author = await blog.getAuthor(post.userId);
    post.comments = await blog.getPostComments(postId);

    response.json(post);
  }
}

module.exports = BlogController;
