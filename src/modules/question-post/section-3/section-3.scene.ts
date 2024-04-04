import { Scenes } from 'telegraf';
import Section3Controller from './section-3.controller';

const section3Controller = new Section3Controller();
const Section3Scene = new Scenes.WizardScene(
  'Post-Question-Section-3',
  section3Controller.start,
  section3Controller.chooseBirthOrMarital,
  section3Controller.enterTitle,
  section3Controller.enterDescription,
  section3Controller.attachPhoto,
  section3Controller.preview,
  section3Controller.editData,
  section3Controller.editPhoto,
);

export default Section3Scene;
