import { Scenes } from 'telegraf';
import ChickenFarmController from './chicken-farm.controller';

const chickenFarmController = new ChickenFarmController();
const chickenFarmScene = new Scenes.WizardScene(
  'Post-Question-Section4-Chicken-Farm',
  chickenFarmController.start,
  chickenFarmController.enterSector,
  chickenFarmController.chooseEstimatedCapital,
  chickenFarmController.enterEnterpriseName,
  chickenFarmController.enterDescription,
  chickenFarmController.preview,
  chickenFarmController.editData,
);

export default chickenFarmScene;
