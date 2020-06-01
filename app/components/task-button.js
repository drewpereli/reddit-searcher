import Component from '@glimmer/component';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';

export default class TaskButtonComponent extends Component {
  get taskIsRunning() {
    return this.wrapperTask.isRunning;
  }

  @action
  onClick() {
    this.wrapperTask.perform();
  }

  // Wrap the task, so that even if the task is running from another source, this components intsance of the task is the only one that changes the taskIsRunning value
  @task
  *wrapperTask() {
    yield this.args.task.perform(this.args.params);
  }
}
