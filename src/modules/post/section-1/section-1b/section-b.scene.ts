import { Scenes } from 'telegraf';
import PostSectionBController from './section-b.controller';
import { restartScene } from '../../../../middleware/check-command';

const postSectionBController = new PostSectionBController();
const PostSectionBScene = new Scenes.WizardScene(
  'Post-SectionB',
  postSectionBController.start,
  postSectionBController.enterTitle,
  postSectionBController.chooseMainCategory,
  postSectionBController.chooseSubCategory,
  postSectionBController.IDFirstOption,
  postSectionBController.enterLastDigit,
  postSectionBController.urgencyCondtion,
  postSectionBController.seOpCondition,
  postSectionBController.enterDateofIssue,
  postSectionBController.enterDateofExpire,
  postSectionBController.enterOriginlaLocation,
  postSectionBController.choooseWoreda,
  postSectionBController.enterDescription,
  postSectionBController.attachPhoto,
  postSectionBController.preview,
  postSectionBController.editData,
  postSectionBController.editPhoto,
  postSectionBController.postedReview,
  postSectionBController.adjustNotifySetting,
  postSectionBController.mentionPreviousPost,
);

PostSectionBScene.use(restartScene('Post-Section-1'));

export default PostSectionBScene;
