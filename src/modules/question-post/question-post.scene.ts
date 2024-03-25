import { Scenes } from 'telegraf';
import QuestionPostController from './question-post.controller';

const questionPostController = new QuestionPostController();
const QuestionPostScene = new Scenes.WizardScene(
  'Post Questions',
  questionPostController.start,
  questionPostController.chooseOption,
  questionPostController.arBrOption,
  questionPostController.choooseWoreda,
  questionPostController.IDFirstOption,
  questionPostController.enterLastDigit,
  questionPostController.enterLocation,
  questionPostController.enterDescription,
  questionPostController.attachPhoto,
  questionPostController.editPost,
  questionPostController.editData,
  questionPostController.editPhoto,
);

export default QuestionPostScene;
