import { Scenes } from 'telegraf';
import QuestionPostController from './section-4.controller';
import QuestionPostSectionConstructionScene from './construction/construction.scene';

const questionPostController = new QuestionPostController();
const QuestionPostScene4 = new Scenes.WizardScene(
  'Post-Question-Section-4',
  questionPostController.start,
  questionPostController.chooseOption,
);

export default [QuestionPostScene4, QuestionPostSectionConstructionScene];
