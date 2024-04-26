import { Scenes } from 'telegraf';
import ChickenFarmController from './chicken-farm.controller';
import { restartScene } from '../../../../middleware/check-command';

const chickenFarmController = new ChickenFarmController();
const chickenFarmScene = new Scenes.WizardScene(
  'Post-Question-Section4-Chicken-Farm',
  chickenFarmController.start,
  chickenFarmController.enterSector,
  chickenFarmController.chooseEstimatedCapital,
  chickenFarmController.enterEnterpriseName,
  chickenFarmController.enterDescription,
  chickenFarmController.preview,
  chickenFarmController.mentionPreviousPost,
  chickenFarmController.editData,
  chickenFarmController.postedReview,
  chickenFarmController.adjustNotifySetting,
);

chickenFarmScene.use(restartScene('Post-Section-4'));
export default chickenFarmScene;
