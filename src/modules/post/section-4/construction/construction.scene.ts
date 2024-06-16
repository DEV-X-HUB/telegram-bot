import { Scenes } from 'telegraf';
import QuestionPostSectionConstructionController from './construction.controller';
import { restartScene } from '../../../../middleware/check-command';

const constructionController = new QuestionPostSectionConstructionController();
const ConstructionScene = new Scenes.WizardScene(
  'Post-Question-SectionB-Construction',
  constructionController.start.bind(constructionController),
  constructionController.chooseConstructionSize.bind(constructionController),
  constructionController.chooseCompanyExpience.bind(constructionController),
  constructionController.chooseDocumentRequestType.bind(constructionController),
  constructionController.chooseLandSize.bind(constructionController),
  constructionController.chooseLandStatus.bind(constructionController),
  constructionController.enterLocation.bind(constructionController),
  constructionController.enterDescription.bind(constructionController),
  constructionController.attachPhoto.bind(constructionController),
  constructionController.preview.bind(constructionController),
  constructionController.editData.bind(constructionController),
  constructionController.editPhoto.bind(constructionController),
  constructionController.postedReview.bind(constructionController),
  constructionController.adjustNotifySetting.bind(constructionController),
  constructionController.mentionPreviousPost.bind(constructionController),
);

ConstructionScene.use(restartScene('Post-Section-4'));

export default ConstructionScene;
