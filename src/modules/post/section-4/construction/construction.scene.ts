import { Scenes } from 'telegraf';
import QuestionPostSectionConstructionController from './construction.controller';
import { restartScene } from '../../../../middleware/check-command';

const constructionController = new QuestionPostSectionConstructionController();
const ConstructionScene = new Scenes.WizardScene(
  'Post-Question-SectionB-Construction',
  constructionController.start,
  constructionController.chooseConstructionSize,
  constructionController.chooseCompanyExpience,
  constructionController.chooseDocumentRequestType,
  constructionController.chooseLandSize,
  constructionController.chooseLandStatus,
  constructionController.enterLocation,
  constructionController.enterDescription,
  constructionController.attachPhoto,
  constructionController.preview,
  constructionController.editData,
  constructionController.editPhoto,
  constructionController.postedReview,
  constructionController.adjustNotifySetting,
  constructionController.mentionPreviousPost,
);

ConstructionScene.use(restartScene('Post-Section-4'));

export default ConstructionScene;
