import { Scenes } from 'telegraf';
import QuestionPostController from './question-post.controller';

const questionPostController = new QuestionPostController();
const QuestionPostScene = new Scenes.WizardScene(
  'posting',
  questionPostController.start,
  questionPostController.chooseOption,
  questionPostController.arBrOption,
  questionPostController.choooseWoreda,
);

export default QuestionPostScene;
