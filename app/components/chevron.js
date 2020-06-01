import Component from '@glimmer/component';

export default class ChevronComponent extends Component {
  get rotationClass() {
    if (this.args.direction === 'down') {
      return 'rotate-90';
    }
    return null;
  }
}
