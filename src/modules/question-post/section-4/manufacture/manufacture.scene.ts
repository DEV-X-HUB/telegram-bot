import { Scenes } from 'telegraf';
import ManufactureController from './manufacture.controller';

const manufactureController = new ManufactureController();
const ManufactureScene = new Scenes.WizardScene(
  'Post-Question-Section4-Manufacture',
  manufactureController.start,
  manufactureController.enterSector,
  manufactureController.chooseNumberOfWorker,
  manufactureController.chooseEstimatedCapital,
  manufactureController.enterEnterpriseName,
  manufactureController.enterDescription,
  manufactureController.attachPhoto,
  manufactureController.preview,
  manufactureController.editData,
  manufactureController.editPhoto,
);

export default ManufactureScene;
