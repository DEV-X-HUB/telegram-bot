import { Scenes } from 'telegraf';
import QuestionPostController from './section-4.controller';
import QuestionPostSectionConstructionScene from './construction/construction.scene';
import ChickenFarmScene from './chicken-farm/chicken-farm.scene';
import ManufactureScene from './manufacture/manufacture.scene';

const questionPostController = new QuestionPostController();
const QuestionPostSection4Scene = new Scenes.WizardScene(
  'Post-Question-Section-4',
  questionPostController.start,
  questionPostController.chooseOption,
);

export default [QuestionPostSection4Scene, ChickenFarmScene, ManufactureScene, QuestionPostSectionConstructionScene];
