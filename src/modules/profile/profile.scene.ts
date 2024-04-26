import { Telegraf, Context, Scenes, Markup } from 'telegraf';
import ProfileController from './profile.controller';
import ProfileFormatter from './profile-formatter';
import { restartScene } from '../../middleware/check-command';
import { checkRegistration } from '../../middleware/auth';

const profileController = new ProfileController();

const ProfileScene = new Scenes.WizardScene('Profile', async (ctx: any) => {
  let tg_id;
  if (ctx.callbackQuery) tg_id = ctx.callbackQuery.from.id;
  else tg_id = ctx.message.from.id;
  const state = ctx.wizard.state;
  if (!state.activity || state.activity == '') return profileController.preview(ctx);

  switch (state.activity) {
    case 'preview':
      return profileController.previewHandler(ctx);
    case 'profile_edit_option_view':
      return profileController.editProfileOption(ctx);
    case 'profile_edit_editing':
      return profileController.editProfileEditField(ctx);
    case 'followers_list_view':
      return profileController.followersList(ctx);
    case 'followings_list_view':
      return profileController.followersList(ctx);
    case 'post_list_view':
      return profileController.postList(ctx);
    case 'profile_setting':
      return profileController.settingPreview(ctx);
    case 'notify_setting':
      return profileController.changeNotifSetting(ctx);
  }
});

ProfileScene.use(checkRegistration());
ProfileScene.use(restartScene('Profile'));

export default ProfileScene;

// Handle errors gracefully (optional)
