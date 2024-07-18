import { Scenes } from 'telegraf';
import ChickenFarmController from './chicken-farm.controller';
import { restartScene } from '../../../../middleware/check-command';

const chickenFarmController = new ChickenFarmController();
const chickenFarmScene = new Scenes.WizardScene(
  'Post-Section4-Chicken-Farm',
  chickenFarmController.start.bind(chickenFarmController),
  chickenFarmController.enterSector.bind(chickenFarmController),
  chickenFarmController.chooseEstimatedCapital.bind(chickenFarmController),
  chickenFarmController.enterEnterpriseName.bind(chickenFarmController),
  chickenFarmController.enterDescription.bind(chickenFarmController),
  chickenFarmController.preview.bind(chickenFarmController),
  chickenFarmController.mentionPreviousPost.bind(chickenFarmController),
  chickenFarmController.editData.bind(chickenFarmController),
  chickenFarmController.postedReview.bind(chickenFarmController),
  chickenFarmController.adjustNotifySetting.bind(chickenFarmController),
);

chickenFarmScene.use(restartScene('Post-Section-4'));
export default chickenFarmScene;
