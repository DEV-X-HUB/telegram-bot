import config from '../../../../config/config';
import {
  CreatePostService4ConstructionDto,
  CreatePostService4ManufactureDto,
} from '../../../../types/dto/create-question-post.dto';
import { ImageCounter } from '../../../../types/params';
import { displayDialog } from '../../../../ui/dialog';
import {
  deleteKeyboardMarkup,
  deleteMessage,
  deleteMessageWithCallback,
  findSender,
  replyPostPreview,
  sendMediaGroup,
} from '../../../../utils/helpers/chat';
import { areEqaul, extractElements, isInInlineOption, isInMarkUPOption } from '../../../../utils/helpers/string';
import MainMenuController from '../../../mainmenu/mainmenu.controller';
import ProfileService from '../../../profile/profile.service';
import PostService from '../../post.service';

import ManufactureFormatter from './manufacture.formatter';
import ManufactureService from './manufacture.service';
import Section4ManufactureService from './manufacture.service';
const manufactureFormatter = new ManufactureFormatter();

const profileService = new ProfileService();

let imagesUploaded: any[] = [];

class ManufactureController {
  imageCounter: ImageCounter[] = [];
  imageTimer: any;
  setImageWaiting(ctx: any) {
    const sender = findSender(ctx);
    if (this.isWaitingImages(sender.id)) return;
    this.imageTimer = setTimeout(
      () => {
        this.sendImageWaitingPrompt(ctx);
      },
      parseInt(config.image_upload_minute.toString()) * 60 * 1000,
    );

    this.imageCounter.push({ id: sender.id, waiting: true });
  }
  clearImageWaiting(id: number) {
    this.imageCounter = this.imageCounter.filter(({ id: counterId }) => counterId != id);
  }

  isWaitingImages(id: number): boolean {
    return this.imageCounter.find(({ id: counterId }) => counterId == id) ? true : false;
  }
  async sendImageWaitingPrompt(ctx: any) {
    const sender = findSender(ctx);
    if (this.isWaitingImages(sender.id)) await displayDialog(ctx, manufactureFormatter.messages.imageWaitingMsg);
  }

  constructor() {}
  async start(ctx: any) {
    ctx.wizard.state.category = 'Manufacture';

    await ctx.reply(...manufactureFormatter.sectorPrompt());
    return ctx.wizard.next();
  }

  async enterSector(ctx: any) {
    const message = ctx.message.text;
    if (message && areEqaul(message, 'back', true)) {
      await deleteKeyboardMarkup(ctx);
      return ctx.scene.leave();
    }

    ctx.wizard.state.sector = message;
    await deleteKeyboardMarkup(ctx, 'What is the estimated capital?');
    await ctx.reply(...manufactureFormatter.numberOfWorkerPrompt());
    return ctx.wizard.next();
  }

  async chooseNumberOfWorker(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (callbackQuery) {
      if (areEqaul(callbackQuery.data, 'back', true)) {
        await ctx.reply(...manufactureFormatter.sectorPrompt());
        return ctx.wizard.back();
      }

      if (isInInlineOption(callbackQuery.data, manufactureFormatter.numberOfWorkerOption)) {
        ctx.wizard.state.number_of_worker = Number(callbackQuery.data);
        console.log(typeof ctx.wizard.state.number_of_worker);
        await deleteMessageWithCallback(ctx);
        await ctx.reply(...manufactureFormatter.estimatedCapitalPrompt());
        return ctx.wizard.next();
      }
    } else {
      await ctx.reply(...manufactureFormatter.inputError());
    }
  }

  async chooseEstimatedCapital(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (callbackQuery) {
      if (areEqaul(callbackQuery.data, 'back', true)) {
        await ctx.reply(...manufactureFormatter.numberOfWorkerPrompt());
        return ctx.wizard.back();
      }

      if (isInInlineOption(callbackQuery.data, manufactureFormatter.estimatedCapitalOption)) {
        ctx.wizard.state.estimated_capital = callbackQuery.data;
        await deleteMessageWithCallback(ctx);
        await ctx.reply(...manufactureFormatter.enterpriseNamePrompt());
        return ctx.wizard.next();
      }
    } else {
      await ctx.reply(...manufactureFormatter.inputError());
    }
  }

  async enterEnterpriseName(ctx: any) {
    const message = ctx.message.text;
    if (message && areEqaul(message, 'back', true)) {
      await ctx.reply(...manufactureFormatter.estimatedCapitalPrompt());
      return ctx.wizard.back();
    }

    ctx.wizard.state.enterprise_name = message;
    await ctx.reply(...manufactureFormatter.descriptionPrompt());
    return ctx.wizard.next();
  }

  async enterDescription(ctx: any) {
    const message = ctx.message.text;
    if (message && areEqaul(message, 'back', true)) {
      await ctx.reply(...manufactureFormatter.enterpriseNamePrompt());
      return ctx.wizard.back();
    }

    ctx.wizard.state.description = message;

    await ctx.reply(...manufactureFormatter.photoPrompt());
    return ctx.wizard.next();
  }

  async attachPhoto(ctx: any) {
    const sender = findSender(ctx);
    const message = ctx?.message?.text;

    if (ctx?.message?.document) return ctx.reply(`Please only upload compressed images`);
    this.setImageWaiting(ctx);

    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...manufactureFormatter.descriptionPrompt());
      this.clearImageWaiting(sender.id);
      return ctx.wizard.back();
    }

    this.setImageWaiting(ctx);
    if (ctx.message.document) return ctx.reply(`Please only upload compressed images`);

    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...manufactureFormatter.descriptionPrompt());
      this.clearImageWaiting(sender.id);
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...manufactureFormatter.photoPrompt());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length == manufactureFormatter.imagesNumber) {
      this.clearImageWaiting(sender.id);
      const file = await ctx.telegram.getFile(ctx.message.photo[0].file_id);
      // console.log(file);

      const mediaGroup = imagesUploaded.map((image: any) => ({
        media: image,
        type: 'photo',
        caption: image == imagesUploaded[0] ? 'Here are the images you uploaded' : '',
      }));

      await ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);

      const user = await profileService.getProfileByTgId(sender.id);
      if (user) {
        ctx.wizard.state.user = {
          id: user.id,
          display_name: user.display_name,
        };
      }
      if (!user) return await ctx.reply(...manufactureFormatter.somethingWentWrongError());

      ctx.wizard.state.user = {
        id: user?.id,
        display_name: user?.display_name,
      };

      ctx.wizard.state.status = 'preview';
      ctx.wizard.state.notify_option = user?.notify_option || 'none';

      // Save the images to the state
      ctx.wizard.state.photo = imagesUploaded;

      // empty the images array
      imagesUploaded = [];
      ctx.replyWithHTML(...manufactureFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      //   ctx.reply(...section1cFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      //   ctx.reply(...postingFormatter.previewCallToAction());
      return ctx.wizard.next();
    }
  }

  async preview(ctx: any) {
    const user = findSender(ctx);
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) {
      const message = ctx.message.text;
      if (message == 'Back') {
        await ctx.reply(...manufactureFormatter.descriptionPrompt(), manufactureFormatter.goBackButton());
        return ctx.wizard.back();
      }
      await ctx.reply('....');
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'preview_edit': {
          console.log('preview edit');
          ctx.wizard.state.editField = null;
          await deleteMessageWithCallback(ctx);
          ctx.replyWithHTML(...manufactureFormatter.editPreview(state), { parse_mode: 'HTML' });
          return ctx.wizard.next();
        }

        case 'editing_done': {
          // await deleteMessageWithCallback(ctx);
          await ctx.replyWithHTML(manufactureFormatter.preview(state));
          return ctx.wizard.back();
        }

        case 'post_data': {
          // api request to post the data

          const postDto: CreatePostService4ManufactureDto = {
            sector: ctx.wizard.state.sector,
            number_of_workers: ctx.wizard.state.number_of_worker,
            estimated_capital: ctx.wizard.state.estimated_capital,
            enterprise_name: ctx.wizard.state.enterprise_name,
            description: ctx.wizard.state.description,
            photo: ctx.wizard.state.photo,
            category: ctx.wizard.state.category,
            notify_option: ctx.wizard.state.notify_option,
            previous_post_id: ctx.wizard.state.mention_post_id || undefined,
          };

          const response = await ManufactureService.createManufacturePost(postDto, callbackQuery.from.id);
          // console.log(response);
          // ctx.reply(...constructionFormatter.postingSuccessful());

          if (response?.success) {
            ctx.wizard.state.post_id = response?.data?.id;
            ctx.wizard.state.post_main_id = response?.data?.post_id;

            await displayDialog(ctx, manufactureFormatter.messages.postSuccessMsg, true);
            await deleteMessageWithCallback(ctx);
            // await ctx.replyWithHTML(...manufactureFormatter.preview(ctx.wizard.state, 'submitted'), {
            //   parse_mode: 'HTML',
            // });

            const elements = extractElements<string>(ctx.wizard.state.photo);
            const [caption, button] = manufactureFormatter.preview(ctx.wizard.state, 'submitted');
            if (elements) {
              // if array of elelement has many photos
              await sendMediaGroup(ctx, elements.firstNMinusOne, 'Images Uploaded with post');

              await replyPostPreview({
                ctx,
                photoURl: elements.lastElement,
                caption: caption as string,
              });
            } else {
              // if array of  has one  photo
              await replyPostPreview({
                ctx,
                photoURl: ctx.wizard.state.photo[0],
                caption: caption as string,
              });
            }

            // jump to posted review
            return ctx.wizard.selectStep(10);
          } else {
            ctx.reply(...manufactureFormatter.postingError());
            if (parseInt(ctx.wizard.state.postingAttempt) >= 2) {
              await deleteMessageWithCallback(ctx);
              ctx.scene.leave();
              return MainMenuController.onStart(ctx);
            }
          }
          //   ctx.reply(...constructionFormatter.postingSuccessful());
          // ctx.scene.leave();
          // return MainMenuController.onStart(ctx);
          // } else {
          //   ctx.reply(...constructionFormatter.postingError());
          //   if (parseInt(ctx.wizard.state.postingAttempt) >= 2) {
          //     await deleteMessageWithCallback(ctx);
          //       ctx.scene.leave();
          // return MainMenuController.onStart(ctx);
          //   }

          // increment the registration attempt
          // return (ctx.wizard.state.postingAttempt = ctx.wizard.state.postingAttempt
          //   ? parseInt(ctx.wizard.state.postingAttempt) + 1
          //   : 1);
        }

        case 'notify_settings': {
          await deleteMessageWithCallback(ctx);
          await ctx.reply(...manufactureFormatter.notifyOptionDisplay(ctx.wizard.state.notify_option));
          // jump to notify setting
          return ctx.wizard.selectStep(11);
        }

        case 'mention_previous_post': {
          console.log('mention_previous_post1');
          await ctx.reply('mention_previous_post');
          // fetch previous posts of the user
          const { posts, success, message } = await PostService.getUserPostsByTgId(user.id);
          if (!success || !posts) {
            // remove past post
            await deleteMessageWithCallback(ctx);
            return await ctx.reply(message);
          }
          if (posts.length == 0) {
            await deleteMessageWithCallback(ctx);
            return await ctx.reply(...manufactureFormatter.noPostsErrorMessage());
          }

          await deleteMessageWithCallback(ctx);
          await ctx.reply(...manufactureFormatter.mentionPostMessage());
          for (const post of posts as any) {
            await ctx.reply(...manufactureFormatter.displayPreviousPostsList(post));
          }

          // jump to mention previous post
          return ctx.wizard.selectStep(12);
        }

        case 'remove_mention_previous_post': {
          state.mention_post_data = '';
          state.mention_post_id = '';
          await deleteMessageWithCallback(ctx);
          ctx.replyWithHTML(...manufactureFormatter.preview(state));
          // return to preview
          return ctx.wizard.selectStep(7);
        }
      }

      // default: {
      //   await ctx.reply('DEFAULT');
      // }
    }
  }

  async editData(ctx: any) {
    const state = ctx.wizard.state;
    const fileds = [
      'sector',
      'number_of_worker',
      'estimated_capital',
      'enterprise_name',
      'description',
      'photo',
      'cancel',
      'done',
    ];
    const callbackQuery = ctx?.callbackQuery;
    const editField = ctx.wizard.state?.editField;
    if (!callbackQuery) {
      // changing field value
      const messageText = ctx.message.text;
      if (!editField) return await ctx.reply('invalid input ');

      // const validationMessage = questionPostValidator(ctx.wizard.state.editField, ctx.message.text);
      // if (validationMessage != 'valid') return await ctx.reply(validationMessage);

      ctx.wizard.state[editField] = messageText;
      await deleteKeyboardMarkup(ctx);
      // await deleteMessage(ctx, {
      //   message_id: (parseInt(ctx.message.message_id) - 1).toString(),
      //   chat_id: ctx.message.chat.id,
      // });
      return ctx.reply(...manufactureFormatter.editPreview(state), { parse_mode: 'HTML' });
    }

    // if callback exists
    // save the mesage id for later deleting
    ctx.wizard.state.previousMessageData = {
      message_id: ctx.callbackQuery.message.message_id,
      chat_id: ctx.callbackQuery.message.chat.id,
    };
    const callbackMessage = callbackQuery.data;

    if (callbackMessage == 'post_data') {
      console.log('here you are');
      // api request to post the data
      const response = await ManufactureService.createManufacturePost(
        {
          sector: state.sector as string,
          number_of_workers: state.number_of_worker,
          estimated_capital: state.estimated_capital as string,
          enterprise_name: state.enterprise_name as string,
          description: state.description as string,
          photo: state.photo,
          category: 'Section4manufacture',
          notify_option: state.notify_option,
        },
        callbackQuery.from.id,
      );

      if (response?.success) {
        console.log('Posting successful');
        await deleteMessageWithCallback(ctx);
        await displayDialog(ctx, manufactureFormatter.messages.postingSuccess);
        ctx.scene.leave();
        return MainMenuController.onStart(ctx);
      } else {
        ctx.reply(...manufactureFormatter.postingError());
        if (parseInt(ctx.wizard.state.postingAttempt) >= 2) {
          await deleteMessageWithCallback(ctx);
          ctx.scene.leave();
          return MainMenuController.onStart(ctx);
        }

        //   ctx.reply(...constructionFormatter.postingSuccessful());
        // ctx.scene.leave();
        // return MainMenuController.onStart(ctx);
        // } else {
        //   ctx.reply(...constructionFormatter.postingError());
        //   if (parseInt(ctx.wizard.state.postingAttempt) >= 2) {
        //     await deleteMessageWithCallback(ctx);
        //       ctx.scene.leave();
        // return MainMenuController.onStart(ctx);
        //   }

        // increment the registration attempt
        // return (ctx.wizard.state.postingAttempt = ctx.wizard.state.postingAttempt
        //   ? parseInt(ctx.wizard.state.postingAttempt) + 1
        //   : 1);
      }

      const registrationAttempt = parseInt(ctx.wizard.state.registrationAttempt);

      // ctx.reply(...postingFormatter.postingError());
      if (registrationAttempt >= 2) {
        await deleteMessageWithCallback(ctx);
        ctx.scene.leave();
        return MainMenuController.onStart(ctx);
      }
      return (ctx.wizard.state.registrationAttempt = registrationAttempt ? registrationAttempt + 1 : 1);
    } else if (callbackMessage == 'editing_done') {
      // await deleteMessageWithCallback(ctx);

      await ctx.replyWithHTML(...manufactureFormatter.preview(state));

      return ctx.wizard.back();
    }

    // if user chooses a field to edit
    if (fileds.some((filed) => filed == callbackQuery.data)) {
      // selecting field to change
      ctx.wizard.state.editField = callbackMessage;
      await ctx.telegram.deleteMessage(
        ctx.wizard.state.previousMessageData.chat_id,
        ctx.wizard.state.previousMessageData.message_id,
      );
      await ctx.reply(...((await manufactureFormatter.editFieldDisplay(callbackMessage)) as any));
      return;
    }
  }

  async editPhoto(ctx: any) {
    const sender = findSender(ctx);
    const messageText = ctx.message?.text;

    this.setImageWaiting(ctx);
    if (ctx.message.document) return ctx.reply(`Please only upload compressed images`);

    if (messageText && areEqaul(messageText, 'back', true)) {
      ctx.reply(...manufactureFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      this.clearImageWaiting(sender.id);
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...manufactureFormatter.photoPrompt());

    if (messageText && areEqaul(messageText, 'back', true)) {
      await deleteMessage(ctx, {
        message_id: (parseInt(messageText.message_id) - 1).toString(),
        chat_id: messageText.chat.id,
      });
      ctx.reply(...manufactureFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      this.clearImageWaiting(sender.id);
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...manufactureFormatter.photoPrompt());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length === manufactureFormatter.imagesNumber) {
      this.clearImageWaiting(sender.id);
      const file = await ctx.telegram.getFile(ctx.message.photo[0].file_id);

      const mediaGroup = imagesUploaded.map((image: any) => ({
        media: image,
        type: 'photo',
        caption: image == imagesUploaded[0] ? 'Here are the images you uploaded' : '',
      }));

      await ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);

      // Save the images to the state
      ctx.wizard.state.photo = imagesUploaded;

      // empty the images array
      // imagesUploaded.length = 0;
      ctx.replyWithHTML(...manufactureFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }
  }

  async postedReview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return;
    switch (callbackQuery.data) {
      case 're_submit_post': {
        const postDto: CreatePostService4ManufactureDto = {
          sector: ctx.wizard.state.sector,
          number_of_workers: ctx.wizard.state.number_of_worker,
          estimated_capital: ctx.wizard.state.estimated_capital,
          enterprise_name: ctx.wizard.state.enterprise_name,
          description: ctx.wizard.state.description,
          photo: ctx.wizard.state.photo,
          category: ctx.wizard.state.category,
          notify_option: ctx.wizard.state.notify_option,
          previous_post_id: ctx.wizard.state.mention_post_id || undefined,
        };
        const response = await PostService.createCategoryPost(postDto, callbackQuery.from.id);
        if (!response?.success) await displayDialog(ctx, manufactureFormatter.messages.postErroMsg);

        ctx.wizard.state.post_id = response?.data?.id;
        ctx.wizard.state.post_main_id = response?.data?.post_id;
        await displayDialog(ctx, manufactureFormatter.messages.postResubmit);
        return ctx.editMessageReplyMarkup({
          inline_keyboard: [
            [{ text: 'Cancel', callback_data: `cancel_post` }],
            [{ text: 'Main menu', callback_data: 'main_menu' }],
          ],
        });
      }
      case 'cancel_post': {
        console.log(ctx.wizard.state);
        const deleted = await PostService.deletePostById(ctx.wizard.state.post_main_id);

        if (!deleted) return await displayDialog(ctx, manufactureFormatter.messages.postErroMsg);
        await displayDialog(ctx, manufactureFormatter.messages.postCancelled);
        return ctx.editMessageReplyMarkup({
          inline_keyboard: [
            [{ text: 'Resubmit', callback_data: `re_submit_post` }],
            [{ text: 'Main menu', callback_data: 'main_menu' }],
          ],
        });
      }
      case 'main_menu': {
        deleteMessageWithCallback(ctx);
        ctx.scene.leave();
        return MainMenuController.onStart(ctx);
      }
    }
  }
  async adjustNotifySetting(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return;
    switch (callbackQuery.data) {
      case 'notify_none': {
        ctx.wizard.state.notify_option = 'none';
        await deleteMessageWithCallback(ctx);
        await ctx.replyWithHTML(...manufactureFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        // jump to preview
        return ctx.wizard.selectStep(7);
      }
      case 'notify_friend': {
        ctx.wizard.state.notify_option = 'friend';
        await deleteMessageWithCallback(ctx);
        await ctx.replyWithHTML(...manufactureFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        // jump to preview
        return ctx.wizard.selectStep(7);
      }
      case 'notify_follower': {
        await deleteMessageWithCallback(ctx);
        ctx.wizard.state.notify_option = 'follower';
        await ctx.replyWithHTML(...manufactureFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
        // jump to preview
        return ctx.wizard.selectStep(7);
      }
    }
  }

  async mentionPreviousPost(ctx: any) {
    const state = ctx.wizard.state;
    console.log(state);
    const callbackQuery = ctx.callbackQuery;
    if (callbackQuery) {
      if (areEqaul(callbackQuery.data, 'back', true)) {
        await ctx.replyWithHTML(...manufactureFormatter.preview(ctx.wizard.state));
        return ctx.wizard.back();
      }

      if (callbackQuery.data.startsWith('select_post_')) {
        const post_id = callbackQuery.data.split('_')[2];

        state.mention_post_id = post_id;
        state.mention_post_data = ctx.callbackQuery.message.text;
        await deleteMessageWithCallback(ctx);
        await ctx.replyWithHTML(...manufactureFormatter.preview(state));
        // go back to preview
        return ctx.wizard.selectStep(7);
      }
    }
  }
}

export default ManufactureController;
