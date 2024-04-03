import { Scenes } from 'telegraf';
import QuestionPostSection1cController from './section1c.controller';

const section1cController = new QuestionPostSection1cController();
const QuestionPostSectionCScene = new Scenes.WizardScene(
  'Post-Question-SectionC',
  section1cController.start,
  section1cController.choosePaperTimeStamp,
  section1cController.arBrOption,
  section1cController.choooseWoreda,
  section1cController.chooseServiceType1,
  section1cController.chooseServiceType2,
  section1cController.chooseServiceType3,
  section1cController.yearOfConfirmation,
  section1cController.IDFirstOption,
  section1cController.enterLastDigit,
  section1cController.enterDescription,
  section1cController.attachPhoto,
  section1cController.editPost,
  section1cController.editData,
  section1cController.editPhoto,
);

export default QuestionPostSectionCScene;
