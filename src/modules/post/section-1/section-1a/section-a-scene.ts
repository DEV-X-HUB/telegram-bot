import { Scenes } from 'telegraf';
import QuestionPostSectionAController from './section-a.controller';

const questionPostSectionAController = new QuestionPostSectionAController();
const QuestionPostSectionAScene = new Scenes.WizardScene(
  'Post-SectionA',
  questionPostSectionAController.start,
  questionPostSectionAController.arBrOption,
  questionPostSectionAController.choooseWoreda,
  questionPostSectionAController.IDFirstOption,
  questionPostSectionAController.enterLastDigit,
  questionPostSectionAController.enterLocation,
  questionPostSectionAController.enterDescription,
  questionPostSectionAController.attachPhoto,
  questionPostSectionAController.editPreview,
  questionPostSectionAController.editData,
  questionPostSectionAController.editPhoto,
  questionPostSectionAController.postedReview,
);

export default QuestionPostSectionAScene;
