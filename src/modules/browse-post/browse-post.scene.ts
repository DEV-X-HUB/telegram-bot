import { Scenes } from 'telegraf';
import BrowsePostController from './browse-post.controller';

const browsePostController = new BrowsePostController();

const BrowsePostScene = new Scenes.WizardScene(
  'browse',
  browsePostController.displayPost,
  browsePostController.handleFilters,
  browsePostController.handleFilterByCategory,
  browsePostController.handleFilterByTimeframe,
);

export default BrowsePostScene;
