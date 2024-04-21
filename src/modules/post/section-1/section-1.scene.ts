import { Scenes } from 'telegraf';
import QuestionPostController from './section-1.controller';
import QuestionPostSectionAScene from './section-1a/section-a-scene';
import QuestionPostSectionBScene from './section-1b/section-b.scene';
import QuestionPostSectionCScene from './section-1c/section1c.scene';

const questionPostController = new QuestionPostController();
const QuestionPostScene1 = new Scenes.WizardScene(
  'Post-Question-Section-1',
  questionPostController.start,
  questionPostController.chooseOption,
);

export default [QuestionPostScene1, QuestionPostSectionBScene, QuestionPostSectionAScene, QuestionPostSectionCScene];
