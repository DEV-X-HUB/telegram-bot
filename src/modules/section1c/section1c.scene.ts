import { Scenes } from 'telegraf';
import Section1cController from './section1c.controller';

const section1cController = new Section1cController();
const Section1cScene = new Scenes.WizardScene(
  'Section 1C',
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
);

export default Section1cScene;
