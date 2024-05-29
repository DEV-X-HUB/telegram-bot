import { Scenes } from 'telegraf';
import BrowsePostController from './browse-post.controller';

const browsePostController = new BrowsePostController();

const BrowsePostScene = new Scenes.WizardScene(
  'browse',
  browsePostController.displayPost,
  browsePostController.handleFilters,
  browsePostController.handleFilterByCategory,
  browsePostController.handleFilterByTimeframe,
  browsePostController.handleFilterSection1AWithARBR,
  browsePostController.handleFilterBySection1BMain,
  browsePostController.handleFilterBySection1BSub,
  browsePostController.handleFilterSection1CWithARBR,
  browsePostController.handleFilterSection2Type,
  browsePostController.handleFilterSection3BirthMarital,
  browsePostController.handleFilterSection4Type,
  browsePostController.handleFilterByWoreda,
);

export default BrowsePostScene;
