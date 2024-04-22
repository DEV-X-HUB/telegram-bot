import { Scenes } from 'telegraf';
import QuestionPostSectionBController from './section-b.controller';

const questionPostSectionBController = new QuestionPostSectionBController();
const QuestionPostSectionBScene = new Scenes.WizardScene(
  'Post-SectionB',
  questionPostSectionBController.start,
  questionPostSectionBController.enterTitle,
  questionPostSectionBController.chooseMainCategory,
  questionPostSectionBController.chooseSubCategory,
  questionPostSectionBController.IDFirstOption,
  questionPostSectionBController.enterLastDigit,
  questionPostSectionBController.urgencyCondtion,
  questionPostSectionBController.seOpCondition,
  questionPostSectionBController.enterDateofIssue,
  questionPostSectionBController.enterDateofExpire,
  questionPostSectionBController.enterOriginlaLocation,
  questionPostSectionBController.choooseWoreda,
  questionPostSectionBController.enterDescription,
  questionPostSectionBController.attachPhoto,
  questionPostSectionBController.editPreview,
  questionPostSectionBController.editData,
  questionPostSectionBController.editPhoto,
  questionPostSectionBController.postedReview,
  questionPostSectionBController.adjustNotifySetting,
);

export default QuestionPostSectionBScene;
