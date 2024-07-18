import { Scenes } from 'telegraf';
import ManufactureController from './manufacture.controller';
import { restartScene } from '../../../../middleware/check-command';

const manufactureController = new ManufactureController();
const ManufactureScene = new Scenes.WizardScene(
  'Post-Section4-Manufacture',
  manufactureController.start.bind(manufactureController),
  manufactureController.enterSector.bind(manufactureController),
  manufactureController.chooseNumberOfWorker.bind(manufactureController),
  manufactureController.chooseEstimatedCapital.bind(manufactureController),
  manufactureController.enterEnterpriseName.bind(manufactureController),
  manufactureController.enterDescription.bind(manufactureController),
  manufactureController.attachPhoto.bind(manufactureController),
  manufactureController.preview.bind(manufactureController),
  manufactureController.editData.bind(manufactureController),
  manufactureController.editPhoto.bind(manufactureController),
  manufactureController.postedReview.bind(manufactureController),
  manufactureController.adjustNotifySetting.bind(manufactureController),
  manufactureController.mentionPreviousPost.bind(manufactureController),
);

ManufactureScene.use(restartScene('Post-Section-4'));

export default ManufactureScene;
