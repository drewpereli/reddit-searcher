import Component from '@glimmer/component';

export default class PostComponent extends Component {
  get ageText() {
    let age = this.args.post.ageMinutes;
    return `${age} minutes ago`;
  }
}
