import { Scenes } from 'telegraf';
import PostingController from './posting.controller';

const postingController = new PostingController();
const PostingScene = new Scenes.WizardScene(
  'Post Questions',
  postingController.start,
  postingController.chooseOption,
  postingController.arBrOption,
  postingController.choooseWoreda,
);

export default PostingScene;
