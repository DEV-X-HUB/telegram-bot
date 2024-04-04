import { Scenes } from 'telegraf';
import QuestionPostSectionAController from './section-a.controller';

const questionPostSectionAController = new QuestionPostSectionAController();
const QuestionPostSectionAScene = new Scenes.WizardScene(
  'Post-Question-SectionA',
  questionPostSectionAController.start,
  questionPostSectionAController.arBrOption,
  questionPostSectionAController.choooseWoreda,
  questionPostSectionAController.IDFirstOption,
  questionPostSectionAController.enterLastDigit,
  questionPostSectionAController.enterLocation,
  questionPostSectionAController.enterDescription,
  questionPostSectionAController.attachPhoto,
  questionPostSectionAController.editPost,
  questionPostSectionAController.editData,
  questionPostSectionAController.editPhoto,
);

export default QuestionPostSectionAScene;
