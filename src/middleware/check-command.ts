// Middleware to check if user entered command and redirect to its scene
export function checkAndRedirectToScene() {
  return (ctx: any, next: any) => {
    const text = ctx.message.text;

    // get all the scenes from the bot
    const scenes = ctx.scene.scenes;
    console.log(scenes);

    if (text && text.startsWith('/')) {
      const command = text.slice(1); // Remove the leading slash
      //check for a scene with the command name
      const scene = scenes.get(command);

      if (scene) {
        ctx.scene = scene;
        ctx.scene.enter(ctx); // Enter the scene
      } else {
        ctx.reply('Unknown command.');
      }
    } else {
      return next();
    }
  };
}
