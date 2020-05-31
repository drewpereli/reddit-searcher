import Component from '@glimmer/component';

function simplePluralize(amount, word) {
  if (amount === 1) {
    return `1 ${word}`;
  } else {
    return `${amount} ${word}s`;
  }
}

export default class Post extends Component {
  get ageText() {
    let ageMinutes = this.args.post.ageMinutes;

    if (ageMinutes < 60) {
      return `${simplePluralize(ageMinutes, 'minute')} ago`;
    } else {
      let hours = Math.round(ageMinutes / 60);
      return `${simplePluralize(hours, 'hour')} ago`;
    }
  }

  get numCommentsText() {
    return simplePluralize(this.args.post.numComments, 'comment');
  }
}
