import { Scenes } from 'telegraf';
import QuestionPostController from './question-post.controller';
import QuestionPostSectionAScene from './section-1/section-1a/sectoion-a-scene';
import QuestionPostSectionBScene from './section-1/section-1b/section-b.scene';
import QuestionPostSectionCScene from './section-1/section-1c/section1c.scene';
import QuestionPostSection2Scene from './section-2/section-2.scene';

const questionPostController = new QuestionPostController();
const QuestionPostScene = new Scenes.WizardScene(
  'Post Questions',
  questionPostController.start,
  questionPostController.chooseOption,
);

export default [
  QuestionPostScene,
  QuestionPostSectionBScene,
  QuestionPostSectionAScene,
  QuestionPostSectionCScene,
  QuestionPostSection2Scene,
];
