import { Scenes } from 'telegraf';
import QuestionPostController from './question-post.controller';
import QuestionPostSectionAScene from './section-1/section-1a/sectoion-a-scene';
import QuestionPostSectionBScene from './section-1/section-1b/section-b.scene';
import QuestionPostSectionCScene from './section-1/section-1c/section1c.scene';

const questionPostController = new QuestionPostController();
const QuestionPostScene = new Scenes.WizardScene(
  'Post Questions',
  questionPostController.start,
  questionPostController.chooseOption,
);

export default [QuestionPostScene, QuestionPostSectionBScene, QuestionPostSectionAScene, QuestionPostSectionCScene];
