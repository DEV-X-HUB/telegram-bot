import { Telegraf, Context, Scenes, Markup } from 'telegraf';
import QuestionController from './question.controller';

const AnswerQuestionScene = new Scenes.WizardScene(
  'answer_scene',
  QuestionController.AnswerQuestion,
  QuestionController.AnswerQuestionPreview,
);

export { AnswerQuestionScene };

// Handle errors gracefully (optional)
