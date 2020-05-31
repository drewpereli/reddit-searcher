import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import getPosts from 'reddit-searcher/utils/get-posts';

export default class IndexController extends Controller {
  constructor() {
    super(...arguments);
    this.refreshPosts();
    setInterval(this.refreshPosts.bind(this), 10000);
  }

  @tracked posts;

  async refreshPosts() {
    let posts = await getPosts();
    this.posts = posts;
  }
}
