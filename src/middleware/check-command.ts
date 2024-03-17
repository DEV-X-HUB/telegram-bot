// middleware to check if user entered command or not
// if the user inserts command starting with "/", the middleware will redirect to its scene,
// else return next on telegraf bot

function checkCommand() {
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
export default checkCommand;
