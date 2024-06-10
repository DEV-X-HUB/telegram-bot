import { Scenes } from 'telegraf';
import PostSectionBController from './section-b.controller';
import { restartScene } from '../../../../middleware/check-command';

const postSectionBController = new PostSectionBController();
const PostSectionBScene = new Scenes.WizardScene(
  'Post-SectionB',
  postSectionBController.start.bind(postSectionBController),
  postSectionBController.enterTitle.bind(postSectionBController),
  postSectionBController.chooseMainCategory.bind(postSectionBController),
  postSectionBController.chooseSubCategory.bind(postSectionBController),
  postSectionBController.IDFirstOption.bind(postSectionBController),
  postSectionBController.enterLastDigit.bind(postSectionBController),
  postSectionBController.urgencyCondtion.bind(postSectionBController),
  postSectionBController.seOpCondition.bind(postSectionBController),
  postSectionBController.enterDateofIssue.bind(postSectionBController),
  postSectionBController.enterDateofExpire.bind(postSectionBController),
  postSectionBController.enterOriginlaLocation.bind(postSectionBController),
  postSectionBController.chooseCity.bind(postSectionBController),
  postSectionBController.enterDescription.bind(postSectionBController),
  postSectionBController.attachPhoto.bind(postSectionBController),
  postSectionBController.preview.bind(postSectionBController),
  postSectionBController.editData.bind(postSectionBController),
  postSectionBController.editPhoto.bind(postSectionBController),
  postSectionBController.editCity.bind(postSectionBController),
  postSectionBController.postedReview.bind(postSectionBController),
  postSectionBController.adjustNotifySetting.bind(postSectionBController),
  postSectionBController.mentionPreviousPost.bind(postSectionBController),
);

PostSectionBScene.use(restartScene('Post-Section-1'));

export default PostSectionBScene;
