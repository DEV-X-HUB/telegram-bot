import { Scenes } from 'telegraf';
import QuestionPostSectionConstructionController from './construction.controller';

const constructionController = new QuestionPostSectionConstructionController();
const QuestionPostSectionConstructionScene = new Scenes.WizardScene(
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
);

export default QuestionPostSectionConstructionScene;
