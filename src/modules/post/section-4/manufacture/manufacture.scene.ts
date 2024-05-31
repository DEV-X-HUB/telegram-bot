import { Scenes } from 'telegraf';
import ManufactureController from './manufacture.controller';
import { restartScene } from '../../../../middleware/check-command';

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
  manufactureController.postedReview,
  manufactureController.adjustNotifySetting,
  manufactureController.mentionPreviousPost,
);

ManufactureScene.use(restartScene('Post-Section-4'));

export default ManufactureScene;
