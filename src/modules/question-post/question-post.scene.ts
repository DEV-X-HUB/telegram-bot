import { Scenes } from 'telegraf';
import QuestionPostController from './question-post.controller';
import QuestionPostSectionAScene from './section-a/sectoion-a-scene';
import QuestionPostSectionBScene from './section-b/section-b.scene';

const questionPostController = new QuestionPostController();
const QuestionPostScene = new Scenes.WizardScene(
  'Post Questions',
  questionPostController.start,
  questionPostController.chooseOption,
);

export default [QuestionPostScene, QuestionPostSectionBScene, QuestionPostSectionAScene];
