import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';

/**
 * @param {Object[]} paramsList
 * @param {task} onAddParams
 * @param {task} onDeleteParams
 */
export default class SubredditParamsEditorComponent extends Component {
  @tracked isOpen = true;

  @tracked newParamsSubredditName = '';
  @tracked newParamsMinAgeMinutes = 60;
  @tracked newParamsMaxAgeMinutes = 60 * 24;
  @tracked newParamsMaxComments = 0;

  get newParams() {
    return {
      subredditName: this.newParamsSubredditName,
      minAgeMinutes: this.newParamsMinAgeMinutes,
      maxAgeMinutes: this.newParamsMaxAgeMinutes,
      maxComments: this.newParamsMaxComments,
    };
  }

  @action
  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  @task
  *onAddParams() {
    let success = yield this.args.onAddParams.perform(this.newParams);
    if (success) {
      this.resetForm();
    }
  }

  resetForm() {
    this.newParamsSubredditName = '';
    this.newParamsMinAgeMinutes = 60;
    this.newParamsMaxAgeMinutes = 60 * 24;
    this.newParamsMaxComments = 0;
  }
}
