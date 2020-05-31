import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import getPosts from 'reddit-searcher/utils/get-posts';

export default class IndexController extends Controller {
  constructor() {
    super(...arguments);
    getPosts([
      {
        subredditName: 'cptsd',
        minAgeMinutes: 60,
        maxComments: 1,
      },
    ]).then(console.log);
  }

  @tracked posts;
}
