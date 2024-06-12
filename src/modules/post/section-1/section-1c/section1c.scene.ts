import { Scenes } from 'telegraf';
import QuestionPostSection1cController from './section1c.controller';
import { restartScene } from '../../../../middleware/check-command';

const section1cController = new QuestionPostSection1cController();
const PostSectionCScene = new Scenes.WizardScene(
  'Post-SectionC',
  section1cController.start.bind(section1cController),
  section1cController.choosePaperTimeStamp.bind(section1cController),
  section1cController.arBrOption.bind(section1cController),
  section1cController.chooseCity.bind(section1cController),
  section1cController.chooseServiceType1.bind(section1cController),
  section1cController.chooseServiceType2.bind(section1cController),
  section1cController.chooseServiceType3.bind(section1cController),
  section1cController.yearOfConfirmation.bind(section1cController),
  section1cController.IDFirstOption.bind(section1cController),
  section1cController.enterLastDigit.bind(section1cController),
  section1cController.enterDescription.bind(section1cController),
  section1cController.attachPhoto.bind(section1cController),
  section1cController.preview.bind(section1cController),
  section1cController.editData.bind(section1cController),
  section1cController.editPhoto.bind(section1cController),
  section1cController.editCity.bind(section1cController),
  section1cController.postedReview.bind(section1cController),
  section1cController.adjustNotifySetting.bind(section1cController),
  section1cController.mentionPreviousPost.bind(section1cController),
);

PostSectionCScene.use(restartScene('Post-Section-1'));

export default PostSectionCScene;
