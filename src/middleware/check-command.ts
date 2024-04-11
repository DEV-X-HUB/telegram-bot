import QuestionController from '../modules/question/question.controller';
import RegistrationFormatter from '../modules/registration/registration-formatter';
import RegistrationService from '../modules/registration/restgration.service';
import QuestionFormmatter from '../modules/question/question.formmater';

// Middleware (Validator) to check if the user entered a command in the wizard scene
export function checkCommandInWizardScene(ctx: any, errorMsg?: string): boolean {
  // if the user enters a command(starting with "/") t

  if (ctx.message && ctx?.message?.text && ctx?.message?.text?.startsWith('/')) {
    ctx.reply('Invalid input.');
    errorMsg && ctx.reply(errorMsg);
    return true;
  }

  return false;
}

// Middleware to check if user entered command and redirect to its scene
export function checkAndRedirectToScene() {
  return async (ctx: any, next: any) => {
    const text = ctx?.message?.text;
    if (!text) return next();
    if (text && text.startsWith('/')) {
      const query = ctx.message.text.split(' ')[1];
      console.log(query);
      if (query == 'all_questions') {
        ctx.reply(
          new QuestionFormmatter().displayAllPromptFomatter(
            ctx.scene.state.searchText,
            ctx.scene.state.questionsNumber,
          ),
        );
      }
      if (text.includes('start') && query) return QuestionController.handleAnswerBrowseQuery(ctx, query);

      const command = text.slice(1); // Remove the leading slash
      if (command == 'register') {
        const isUserRegistered = await new RegistrationService().isUserRegisteredWithTGId(ctx.message.from.id);
        if (isUserRegistered) {
          // ctx.reply(...new RegistrationFormatter().userExistMessage());
          // return ctx.scene.enter('start'); // Enter main menu the scene
        }
      }
      if (ctx.scene.scenes.has(command)) {
        return ctx.scene.enter(command);
      } else {
        return ctx.reply('Unknown option. Please choose a valid option.');
      }
    }

    return next();
  };
}

const sceneNames = ['start', 'register'];
