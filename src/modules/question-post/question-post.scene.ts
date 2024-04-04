import { Scenes } from 'telegraf';
import QuestionPostController from './question-post.controller';
import QuestionPostSection1AScene from './section-1/section-1a/sectoion-a-scene';
import QuestionPostSection1BScene from './section-1/section-1b/section-b.scene';
import QuestionPostSection1CScene from './section-1/section-1c/section1c.scene';

const questionPostController = new QuestionPostController();
const QuestionPostScene = new Scenes.WizardScene(
  'Post Questions',
  questionPostController.start,
  questionPostController.chooseOption,
);

export default [QuestionPostScene, QuestionPostSection1AScene, QuestionPostSection1BScene, QuestionPostSection1CScene];
