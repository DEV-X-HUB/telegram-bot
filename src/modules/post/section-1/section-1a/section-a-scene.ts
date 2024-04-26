import { Scenes } from 'telegraf';
import PostSectionAController from './section-a.controller';
import { restartScene } from '../../../../middleware/check-command';

const postSectionAController = new PostSectionAController();
const PostSectionAScene = new Scenes.WizardScene(
  'Post-SectionA',
  postSectionAController.start,
  postSectionAController.arBrOption,
  postSectionAController.choooseWoreda,
  postSectionAController.IDFirstOption,
  postSectionAController.enterLastDigit,
  postSectionAController.enterLocation,
  postSectionAController.enterDescription,
  postSectionAController.attachPhoto,
  postSectionAController.preview,
  postSectionAController.editData,
  postSectionAController.editPhoto,
  postSectionAController.postReview,
  postSectionAController.adjustNotifySetting,
  postSectionAController.mentionPreviousPost,
);
PostSectionAScene.use(restartScene('Post-Section-1'));

export default PostSectionAScene;
