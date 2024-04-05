import { Scenes } from 'telegraf';
import QuestionPostController from './section-4.controller';

const questionPostController = new QuestionPostController();
const QuestionPostScene4 = new Scenes.WizardScene(
  'Post-Question-Section-4',
  questionPostController.start,
  questionPostController.chooseOption,
);

export default [QuestionPostScene4];
