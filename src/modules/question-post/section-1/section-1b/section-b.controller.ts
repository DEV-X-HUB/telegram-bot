import { deleteKeyboardMarkup, deleteMessage, deleteMessageWithCallback } from '../../../../utils/constants/chat';
import { areEqaul, isInInlineOption } from '../../../../utils/constants/string';

import QuestionPostSectionBFormatter from './section-b.formatter';
import QuestionService from '../../question-post.service';
import { questionPostValidator } from '../../../../utils/validator/question-post-validaor';
const questionPostSectionBFormatter = new QuestionPostSectionBFormatter();

let imagesUploaded: any[] = [];
const imagesNumber = 4;

class QuestionPostSectionBController {
  constructor() {}

  async start(ctx: any) {
    await ctx.reply(...questionPostSectionBFormatter.InsertTiteDisplay());
    return ctx.wizard.next();
  }
  async enterTitle(ctx: any) {
    const text = ctx.message.text;

    if (areEqaul(text, 'back', true)) return ctx.scene.enter('Post-Question-Section-1');
    ctx.wizard.state.title = text;
    await deleteKeyboardMarkup(ctx, questionPostSectionBFormatter.messages.categoriesPrompt);
    ctx.reply(...questionPostSectionBFormatter.mainCategoryOption());

    return ctx.wizard.next();
  }
  async chooseMainCategory(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(questionPostSectionBFormatter.messages.useButtonError);
    if (areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      await ctx.reply(...questionPostSectionBFormatter.InsertTiteDisplay());
      return ctx.wizard.back();
    }
    ctx.wizard.state.mainCategory = callbackQuery.data;
    console.log(callbackQuery.data);
    if (areEqaul(callbackQuery.data, 'main_10', true)) {
      ctx.wizard.state.subCatagory = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...questionPostSectionBFormatter.bIDIOptionDisplay());
      return ctx.wizard.selectStep(4); // jumping to step with step index(bi di selector(id first))
    }
    deleteMessageWithCallback(ctx);
    ctx.reply(...questionPostSectionBFormatter.subCategoryOption(callbackQuery.data));
    return ctx.wizard.next();
  }
  async chooseSubCategory(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(questionPostSectionBFormatter.messages.useButtonError);
    if (areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      await ctx.reply(...questionPostSectionBFormatter.mainCategoryOption());
      return ctx.wizard.back();
    }
    ctx.wizard.state.subCatagory = callbackQuery.data;
    deleteMessageWithCallback(ctx);
    ctx.reply(...questionPostSectionBFormatter.bIDIOptionDisplay());
    return ctx.wizard.next();
  }
  async IDFirstOption(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(questionPostSectionBFormatter.messages.useButtonError);

    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      const mainCategory = ctx.wizard.state.mainCategory;

      if (areEqaul(mainCategory, 'main_10', true)) {
        console.log('yeah equel  ');
        deleteMessageWithCallback(ctx);
        ctx.reply(...questionPostSectionBFormatter.mainCategoryOption());
        return ctx.wizard.selectStep(2);
      } else {
        deleteMessageWithCallback(ctx);
        ctx.reply(...questionPostSectionBFormatter.subCategoryOption(mainCategory));
        return ctx.wizard.back();
      }
    }

    if (isInInlineOption(callbackQuery.data, questionPostSectionBFormatter.bIDiOption)) {
      ctx.wizard.state.bi_di = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...questionPostSectionBFormatter.lastDidtitDisplay());
      return ctx.wizard.next();
    }
    ctx.reply('unkown option');
  }
  async enterLastDigit(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      await deleteKeyboardMarkup(ctx, questionPostSectionBFormatter.messages.biDiPrompt);
      ctx.reply(...questionPostSectionBFormatter.bIDIOptionDisplay());
      return ctx.wizard.back();
    }

    const validationMessage = questionPostValidator('last_digit', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.last_digit = message;
    const mainCategory = ctx.wizard.state.mainCategory;
    if (areEqaul(mainCategory, 'main_4', true)) {
      ctx.reply(...questionPostSectionBFormatter.OpSeCondtionOptionDisplay());
      return ctx.wizard.selectStep(7);
    }

    await deleteKeyboardMarkup(ctx, questionPostSectionBFormatter.messages.conditonPrompt);
    ctx.reply(...questionPostSectionBFormatter.urgencyOptionDisplay());
    return ctx.wizard.next();
  }

  async urgencyCondtion(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(questionPostSectionBFormatter.messages.useButtonError);
    if (areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      await ctx.reply(...questionPostSectionBFormatter.lastDidtitDisplay());
      return ctx.wizard.back();
    }
    ctx.wizard.state.condition = callbackQuery.data;
    deleteMessageWithCallback(ctx);
    ctx.reply(...questionPostSectionBFormatter.woredaListDisplay());
    return ctx.wizard.selectStep(11); // jumping to step with step index(jump to woreda selector)
  }
  async seOpCondition(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) return ctx.reply(questionPostSectionBFormatter.messages.useButtonError);

    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...questionPostSectionBFormatter.lastDidtitDisplay());
      return ctx.wizard.selectStep(5);
    }

    if (isInInlineOption(callbackQuery.data, questionPostSectionBFormatter.OpSeOption)) {
      ctx.wizard.state.condition = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...questionPostSectionBFormatter.dateOfIssue());
      return ctx.wizard.next();
    }
    ctx.reply('unkown option');
  }
  async enterDateofIssue(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      await deleteKeyboardMarkup(ctx, questionPostSectionBFormatter.messages.dateOfIssuePrompt);
      ctx.reply(...questionPostSectionBFormatter.OpSeCondtionOptionDisplay());
      return ctx.wizard.back();
    }

    const validationMessage = questionPostValidator('issue_date', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.date_of_issue = message;
    await ctx.reply(...questionPostSectionBFormatter.dateOfExpire());
    return ctx.wizard.next();
  }
  async enterDateofExpire(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...questionPostSectionBFormatter.dateOfIssue());
      return ctx.wizard.back();
    }

    // assign the location to the state
    const validationMessage = questionPostValidator('issue_date', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.date_of_expire = message;
    await ctx.reply(...questionPostSectionBFormatter.originalLocation());
    return ctx.wizard.next();
  }
  async enterOriginlaLocation(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...questionPostSectionBFormatter.dateOfExpire());
      return ctx.wizard.back();
    }

    // assign the location to the state
    ctx.wizard.state.location = message;
    await deleteKeyboardMarkup(ctx, questionPostSectionBFormatter.messages.chooseWoredaPrompt);
    await ctx.reply(...questionPostSectionBFormatter.woredaListDisplay());
    return ctx.wizard.next();
  }
  async choooseWoreda(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    const mainCategory = ctx.wizard.state.mainCategory;

    if (!callbackQuery) return ctx.reply(questionPostSectionBFormatter.messages.useButtonError);

    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      if (!areEqaul(mainCategory, 'main_4', true)) {
        deleteMessageWithCallback(ctx);
        ctx.reply(...questionPostSectionBFormatter.originalLocation());
        return ctx.wizard.back();
      }
      ctx.reply(...questionPostSectionBFormatter.urgencyOptionDisplay());
      deleteMessageWithCallback(ctx);
      return ctx.wizard.selectStep(6); // go back to urgency
    }

    if (isInInlineOption(callbackQuery.data, questionPostSectionBFormatter.woredaList)) {
      ctx.wizard.state.woreda = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...questionPostSectionBFormatter.descriptionDisplay());
      return ctx.wizard.next();
    }
    return ctx.reply('Unknown option. Please choose a valid option.');
  }

  async enterDescription(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      await deleteKeyboardMarkup(ctx, questionPostSectionBFormatter.messages.chooseWoredaPrompt);
      ctx.reply(...questionPostSectionBFormatter.woredaListDisplay());
      return ctx.wizard.back();
    }

    const validationMessage = questionPostValidator('description', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.description = message;
    ctx.reply(...questionPostSectionBFormatter.photoDisplay());
    return ctx.wizard.next();
  }
  async attachPhoto(ctx: any) {
    console.log(' being received');
    const message = ctx?.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...questionPostSectionBFormatter.bIDIOptionDisplay());
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...questionPostSectionBFormatter.photoDisplay());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length == imagesNumber) {
      const file = await ctx.telegram.getFile(ctx.message.photo[0].file_id);
      // console.log(file);

      const mediaGroup = imagesUploaded.map((image: any) => ({
        media: image,
        type: 'photo',
        caption: image == imagesUploaded[0] ? 'Here are the images you uploaded' : '',
      }));

      await ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);

      // Save the images to the state
      ctx.wizard.state.photo = imagesUploaded;
      ctx.wizard.state.status = 'previewing';

      // empty the images array
      imagesUploaded = [];
      ctx.reply(...questionPostSectionBFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      ctx.reply(...questionPostSectionBFormatter.previewCallToAction());
      return ctx.wizard.next();
    }
  }
  async editPost(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    console.log('here is the callback');

    console.log(callbackQuery);

    if (!callbackQuery) {
      const message = ctx.message.text;
      if (message == 'Back') {
        await ctx.reply(...questionPostSectionBFormatter.photoDisplay(), questionPostSectionBFormatter.goBackButton());
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
          ctx.reply(...questionPostSectionBFormatter.editPreview(state), { parse_mode: 'HTML' });
          return ctx.wizard.next();
        }

        // case 'editing_done': {
        //   // await deleteMessageWithCallback(ctx);
        //   await ctx.reply(questionPostSectionBFormatter.preview(state));
        //   return ctx.wizard.back();
        // }

        case 'post_data': {
          console.log('here you are');
          // api request to post the data
          const response = await QuestionService.createQuestionPost(ctx.wizard.state, callbackQuery.from.id);
          console.log(response);

          if (response?.success) {
            await deleteMessageWithCallback(ctx);
            ctx.reply(...questionPostSectionBFormatter.postingSuccessful());
            return ctx.scene.enter('start');
          } else {
            ctx.reply(...questionPostSectionBFormatter.postingError());
            if (parseInt(ctx.wizard.state.postingAttempt) >= 2) {
              await deleteMessageWithCallback(ctx);
              return ctx.scene.enter('start');
            }

            // increment the registration attempt
            return (ctx.wizard.state.postingAttempt = ctx.wizard.state.postingAttempt
              ? parseInt(ctx.wizard.state.postingAttempt) + 1
              : 1);
          }
        }
        default: {
          await ctx.reply('DEFAULT');
        }
      }
    }
  }

  async editData(ctx: any) {
    const state = ctx.wizard.state;
    const fileds = ['ar_br', 'bi_di', 'woreda', 'last_digit', 'location', 'description', 'photo', 'cancel'];
    const callbackQuery = ctx?.callbackQuery;
    const editField = ctx.wizard.state?.editField;
    if (!callbackQuery) {
      // changing field value
      const messageText = ctx.message.text;
      if (!editField) return await ctx.reply('invalid input ');

      ctx.wizard.state[editField] = messageText;
      await deleteKeyboardMarkup(ctx);
      return ctx.reply(...questionPostSectionBFormatter.editPreview(state), { parse_mode: 'HTML' });
    }

    // if callback exists
    // save the mesage id for later deleting
    ctx.wizard.state.previousMessageData = {
      message_id: ctx.callbackQuery.message.message_id,
      chat_id: ctx.callbackQuery.message.chat.id,
    };
    const callbackMessage = callbackQuery.data;

    if (callbackMessage == 'post_data') {
      // registration
      // api call for registration
      const response = await QuestionService.createQuestionPost(ctx.wizard.state, callbackQuery.from.id);

      if (response.success) {
        ctx.wizard.state.status = 'pending';
        await deleteMessageWithCallback(ctx);
        await ctx.reply(...questionPostSectionBFormatter.postingSuccessful());
        return ctx.scene.enter('start');
      }

      const registrationAttempt = parseInt(ctx.wizard.state.registrationAttempt);

      // ctx.reply(...questionPostSectionBFormatter.postingError());
      if (registrationAttempt >= 2) {
        await deleteMessageWithCallback(ctx);
        return ctx.scene.enter('start');
      }
      return (ctx.wizard.state.registrationAttempt = registrationAttempt ? registrationAttempt + 1 : 1);
    } else if (callbackMessage == 'editing_done') {
      // await deleteMessageWithCallback(ctx);

      await ctx.reply(...questionPostSectionBFormatter.preview(state));
      return ctx.wizard.back();
    }

    if (fileds.some((filed) => filed == callbackQuery.data)) {
      // selecting field to change
      ctx.wizard.state.editField = callbackMessage;
      await ctx.telegram.deleteMessage(
        ctx.wizard.state.previousMessageData.chat_id,
        ctx.wizard.state.previousMessageData.message_id,
      );
      await ctx.reply(...((await questionPostSectionBFormatter.editFieldDispay(callbackMessage)) as any));
      if (areEqaul(callbackQuery.data, 'photo', true)) return ctx.wizard.next();
      return;
    }

    if (editField) {
      //  if edit filed is selected

      ctx.wizard.state[editField] = callbackMessage;
      await deleteMessageWithCallback(ctx);
      ctx.wizard.state.editField = null;
      return ctx.reply(...questionPostSectionBFormatter.editPreview(state), { parse_mode: 'HTML' });
    }
  }
  async editPhoto(ctx: any) {
    const messageText = ctx.message?.text;
    if (messageText && areEqaul(messageText, 'back', true)) {
      await deleteMessage(ctx, {
        message_id: (parseInt(messageText.message_id) - 1).toString(),
        chat_id: messageText.chat.id,
      });
      ctx.reply(...questionPostSectionBFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...questionPostSectionBFormatter.photoDisplay());

    // Add the image to the array
    imagesUploaded.push(ctx.message.photo[0].file_id);

    // Check if all images received
    if (imagesUploaded.length === imagesNumber) {
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
      ctx.reply(...questionPostSectionBFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }
  }
}

export default QuestionPostSectionBController;
