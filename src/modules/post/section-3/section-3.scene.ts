import { Scenes } from 'telegraf';
import Section3Controller from './section-3.controller';
import { restartScene } from '../../../middleware/check-command';

const section3Controller = new Section3Controller();
const Section3Scene = new Scenes.WizardScene(
  'Post-Section-3',
  section3Controller.start.bind(section3Controller),
  section3Controller.chooseBirthOrMarital.bind(section3Controller),
  section3Controller.enterTitle.bind(section3Controller),
  section3Controller.enterDescription.bind(section3Controller),
  section3Controller.attachPhoto.bind(section3Controller),
  section3Controller.preview.bind(section3Controller),
  section3Controller.editData.bind(section3Controller),
  section3Controller.editPhoto.bind(section3Controller),
  section3Controller.postReview.bind(section3Controller),
  section3Controller.adjustNotifySetting.bind(section3Controller),
  section3Controller.mentionPreviousPost.bind(section3Controller),
);

Section3Scene.use(restartScene('Post-Section-3'));
export default Section3Scene;
