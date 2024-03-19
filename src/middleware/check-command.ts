// Middleware (Validator) to check if the user entered a command in the wizard scene
export function checkCommandInWizardScene(ctx: any, errorMsg?: string): boolean {
  // if the user enters a command(starting with "/") t
  if (ctx?.message?.text && ctx?.message?.text?.startsWith('/')) {
    ctx.reply('Invalid input.');
    errorMsg && ctx.reply(errorMsg);
    return true;
  }

  return false;
}

// Middleware to check if user entered command and redirect to its scene
export function checkAndRedirectToScene() {
  return (ctx: any, next: any) => {
    console.log(ctx.callbackQuery, 'check commad ');
    console.log(ctx.message, 'check commad ');
    const text = ctx.message.text;

    if (text && text.startsWith('/')) {
      const command = text.slice(1); // Remove the leading slash
      if (sceneNames.some((sceneName) => sceneName == command)) ctx.scene.enter(command); // Enter the scene
    }
    return next();
  };
}

const sceneNames = ['start', 'register'];
