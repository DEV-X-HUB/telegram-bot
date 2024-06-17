import { Scenes } from 'telegraf';
import Section4PostController from './section-4.controller';
import QuestionPostSectionConstructionScene from './construction/construction.scene';
import ChickenFarmScene from './chicken-farm/chicken-farm.scene';
import ManufactureScene from './manufacture/manufacture.scene';
import { restartScene } from '../../../middleware/check-command';

const section4PostController = new Section4PostController();
const PostSection4Scene = new Scenes.WizardScene(
  'Post-Section-4',
  section4PostController.start.bind(section4PostController),
  section4PostController.chooseOption.bind(section4PostController),
);

PostSection4Scene.use(restartScene('Post-Section-4'));
export default [PostSection4Scene, ChickenFarmScene, ManufactureScene, QuestionPostSectionConstructionScene];
