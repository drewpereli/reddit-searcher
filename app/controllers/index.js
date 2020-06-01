import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { getPosts, subredditExists } from 'reddit-searcher/utils/reddit-utils';
import { timeout } from 'ember-concurrency';
import { task, restartableTask } from 'ember-concurrency-decorators';

export default class IndexController extends Controller {
  constructor() {
    super(...arguments);
    setTimeout(() => {
      this.refreshPosts.perform();

      setInterval(() => {
        this.refreshPosts.perform();
      }, 10000);
    }, 0);
  }

  queryParams = ['params'];

  @tracked params = '[]';

  @tracked flashMessage = {
    text: null,
    color: null,
    show: false,
  };

  get postParamsList() {
    return JSON.parse(this.params);
  }

  set postParamsList(list) {
    this.params = JSON.stringify(list);
  }

  @tracked posts = [];

  get hasParams() {
    return this.postParamsList.length > 0;
  }

  @task
  *onAddParams(params) {
    let subredditName = params.subredditName;

    if (this.postParamsList.findBy('subredditName', subredditName)) {
      this.flash.perform(`/r/${subredditName} is already included`, 'blue');
      return false;
    }

    let exists = yield subredditExists(subredditName);
    if (!exists) {
      this.flash.perform(`/r/${subredditName} does not exist, is private, or has been banned`, 'red');
      return false;
    }

    let newParamsList = [...this.postParamsList, params];

    yield this.refreshPosts.perform(newParamsList);

    this.flash.perform(`/r/${subredditName} added`, 'green');

    this.postParamsList = newParamsList;

    return true;
  }

  @task
  *onDeleteParams({ subredditName }) {
    let params, paramsIndex;

    for (let i = 0; i < this.postParamsList.length; i++) {
      let currParams = this.postParamsList[i];
      if (currParams.subredditName === subredditName) {
        params = currParams;
        paramsIndex = i;
        break;
      }
    }

    if (!params) {
      throw new Error(`Could not find params with subreddit "${subredditName}"`);
    }

    let newParamsList = [...this.postParamsList.slice(0, paramsIndex), ...this.postParamsList.slice(paramsIndex + 1)];

    yield this.refreshPosts.perform(newParamsList);

    this.flash.perform(`/r/${subredditName} removed`, 'green');

    this.postParamsList = newParamsList;
  }

  @restartableTask
  *refreshPosts(paramsList = false) {
    if (!paramsList) {
      paramsList = this.postParamsList;
    }

    let posts = yield getPosts(paramsList);

    this.posts = posts;
  }

  @restartableTask
  *flash(text, color) {
    this.flashMessage = { text, color, show: true };

    yield timeout(3000);

    this.flashMessage = { text, color, show: false };
  }
}
