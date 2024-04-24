import { Scenes } from 'telegraf';
import PostSection2Controller from './section-2.controller';

const postSection2Controller = new PostSection2Controller();
const PostSection2Scene = new Scenes.WizardScene(
  'Post-Section-2',
  postSection2Controller.start,
  postSection2Controller.chooseType,
  postSection2Controller.enterTitle,
  postSection2Controller.enterDescription,
  postSection2Controller.attachPhoto,
  postSection2Controller.preview,
  postSection2Controller.editData,
  postSection2Controller.editPhoto,
  postSection2Controller.postReview,
  postSection2Controller.adjustNotifySetting,
  postSection2Controller.mentionPreviousPost,
);

export default PostSection2Scene;
