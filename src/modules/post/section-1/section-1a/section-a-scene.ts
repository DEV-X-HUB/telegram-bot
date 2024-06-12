import { Scenes } from 'telegraf';
import PostSectionAController from './section-a.controller';
import { restartScene } from '../../../../middleware/check-command';

const postSectionAController = new PostSectionAController();
const PostSectionAScene = new Scenes.WizardScene(
  'Post-SectionA',
  postSectionAController.start.bind(postSectionAController),
  postSectionAController.arBrOption.bind(postSectionAController),
  postSectionAController.chooseCity.bind(postSectionAController),
  postSectionAController.IDFirstOption.bind(postSectionAController),
  postSectionAController.enterLastDigit.bind(postSectionAController),
  postSectionAController.enterLocation.bind(postSectionAController),
  postSectionAController.enterDescription.bind(postSectionAController),
  postSectionAController.attachPhoto.bind(postSectionAController),
  postSectionAController.preview.bind(postSectionAController),
  postSectionAController.editData.bind(postSectionAController),
  postSectionAController.editPhoto.bind(postSectionAController),
  postSectionAController.editCity.bind(postSectionAController),
  postSectionAController.postReview.bind(postSectionAController),
  postSectionAController.adjustNotifySetting.bind(postSectionAController),
  postSectionAController.mentionPreviousPost.bind(postSectionAController),
);
PostSectionAScene.use(restartScene('Post-Section-1'));

export default PostSectionAScene;
