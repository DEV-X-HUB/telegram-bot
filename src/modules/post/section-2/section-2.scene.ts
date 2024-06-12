import { Scenes } from 'telegraf';
import PostSection2Controller from './section-2.controller';
import { restartScene } from '../../../middleware/check-command';

const postSection2Controller = new PostSection2Controller();
const PostSection2Scene = new Scenes.WizardScene(
  'Post-Section-2',
  postSection2Controller.start.bind(postSection2Controller),
  postSection2Controller.chooseType.bind(postSection2Controller),
  postSection2Controller.enterTitle.bind(postSection2Controller),
  postSection2Controller.enterDescription.bind(postSection2Controller),
  postSection2Controller.attachPhoto.bind(postSection2Controller),
  postSection2Controller.preview.bind(postSection2Controller),
  postSection2Controller.editData.bind(postSection2Controller),
  postSection2Controller.editPhoto.bind(postSection2Controller),
  postSection2Controller.postReview.bind(postSection2Controller),
  postSection2Controller.adjustNotifySetting.bind(postSection2Controller),
  postSection2Controller.mentionPreviousPost.bind(postSection2Controller),
);

PostSection2Scene.use(restartScene('Post-Section-2'));
export default PostSection2Scene;
