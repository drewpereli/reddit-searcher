import Component from '@glimmer/component';

export default class TextInputComponent extends Component {
  get type() {
    return this.args.type || 'text';
  }

  get min() {
    return this.args.min || '0';
  }

  get required() {
    if (this.args.required === false) {
      return false;
    } else {
      return true;
    }
  }
}
