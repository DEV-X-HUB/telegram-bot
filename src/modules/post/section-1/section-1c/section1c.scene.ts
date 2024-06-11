import { Scenes } from 'telegraf';
import QuestionPostSection1cController from './section1c.controller';
import { restartScene } from '../../../../middleware/check-command';

const section1cController = new QuestionPostSection1cController();
const PostSectionCScene = new Scenes.WizardScene(
  'Post-SectionC',
  section1cController.start,
  section1cController.choosePaperTimeStamp,
  section1cController.arBrOption,
  section1cController.chooseCity,
  section1cController.chooseServiceType1,
  section1cController.chooseServiceType2,
  section1cController.chooseServiceType3,
  section1cController.yearOfConfirmation,
  section1cController.IDFirstOption,
  section1cController.enterLastDigit,
  section1cController.enterDescription,
  section1cController.attachPhoto,
  section1cController.preview,
  section1cController.editData,
  section1cController.editPhoto,
  section1cController.editCity,
  section1cController.postedReview,
  section1cController.adjustNotifySetting,
  section1cController.mentionPreviousPost,
);

PostSectionCScene.use(restartScene('Post-Section-1'));

export default PostSectionCScene;
