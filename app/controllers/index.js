import Controller from '@ember/controller';
import foo from 'reddit-searcher/utils/get-posts';

export default class IndexController extends Controller {
  message = foo;
}
