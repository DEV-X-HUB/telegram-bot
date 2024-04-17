import { Scenes } from 'telegraf';
import QuestionPostSectionBController from './section-2.controller';

const questionPostSectionBController = new QuestionPostSectionBController();
const QuestionPostSection2Scene = new Scenes.WizardScene(
  'Post-Question-Section-2',
  questionPostSectionBController.start,
  questionPostSectionBController.chooseType,
  questionPostSectionBController.enterTitle,
  questionPostSectionBController.enterDescription,
  questionPostSectionBController.attachPhoto,
  questionPostSectionBController.editPost,
  questionPostSectionBController.editData,
  questionPostSectionBController.editPhoto,
);

export default QuestionPostSection2Scene;
