import { deleteKeyboardMarkup, deleteMessage, deleteMessageWithCallback } from '../../../../utils/constants/chat';
import { areEqaul, isInInlineOption } from '../../../../utils/constants/string';

import QuestionPostSectionConstructionFormmater from './construction.formatter';
import QuestionService from '../../post.service';
import { postValidator } from '../../../../utils/validator/question-post-validaor';
import { displayDialog } from '../../../../ui/dialog';
import MainMenuController from '../../../mainmenu/mainmenu.controller';
import Section4ConstructionService from './construction.service';
const constructionFormatter = new QuestionPostSectionConstructionFormmater();

let imagesUploaded: any[] = [];
const imagesNumber = 4;

class QuestionPostSectionConstructionController {
  constructor() {}

  async start(ctx: any) {
    await ctx.reply(...constructionFormatter.chooseSizeDisplay());
    return ctx.wizard.next();
  }
  async chooseConstructionSize(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(constructionFormatter.messages.useButtonError);

    if (areEqaul(callbackQuery.data, 'back', true)) return ctx.scene.enter('Post-Question-Section-4');

    if (!isInInlineOption(callbackQuery.data, constructionFormatter.sizeOption))
      return ctx.reply(...constructionFormatter.messages.unknowOptionError);

    ctx.wizard.state.category = 'Construction';
    ctx.wizard.state.size = callbackQuery.data;
    await deleteMessageWithCallback(ctx);

    if (areEqaul(ctx.wizard.state.size, 'big', true)) {
      ctx.reply(...constructionFormatter.landSizeDisplay());
      return ctx.wizard.selectStep(4); // jump to 5'th controller (land size)
    }
    ctx.reply(...constructionFormatter.companyExpienceDisplay());
    return ctx.wizard.next();
  }

  async chooseCompanyExpience(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(constructionFormatter.messages.useButtonError);

    if (areEqaul(callbackQuery.data, 'back', true)) {
      await deleteMessageWithCallback(ctx);
      await ctx.reply(...constructionFormatter.chooseSizeDisplay());
      return ctx.wizard.back();
    }

    if (!isInInlineOption(callbackQuery.data, constructionFormatter.companyExperienceOption))
      return ctx.reply(...constructionFormatter.messages.unknowOptionError);

    ctx.wizard.state.company_experience = callbackQuery.data;
    await deleteMessageWithCallback(ctx);
    ctx.reply(...constructionFormatter.documentRequestDisplay());
    return ctx.wizard.next();
  }
  async chooseDocumentRequestType(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(constructionFormatter.messages.useButtonError);

    if (areEqaul(callbackQuery.data, 'back', true)) {
      await deleteMessageWithCallback(ctx);
      await ctx.reply(...constructionFormatter.companyExpienceDisplay());
      return ctx.wizard.back();
    }

    if (!isInInlineOption(callbackQuery.data, constructionFormatter.documentRequestOption))
      return ctx.reply(...constructionFormatter.messages.unknowOptionError);

    ctx.wizard.state.document_request_type = callbackQuery.data;
    await deleteMessageWithCallback(ctx);
    ctx.reply(...constructionFormatter.locationDisplay());
    return ctx.wizard.selectStep(6); // jump to 7'th controller (location)
  }
  async chooseLandSize(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(constructionFormatter.messages.useButtonError);

    if (areEqaul(callbackQuery.data, 'back', true)) {
      await deleteMessageWithCallback(ctx);
      await ctx.reply(...constructionFormatter.chooseSizeDisplay());
      return ctx.wizard.selectStep(1); // jump  to first controller(size option)
    }

    if (!isInInlineOption(callbackQuery.data, constructionFormatter.landSizeOption))
      return ctx.reply(...constructionFormatter.messages.unknowOptionError);

    ctx.wizard.state.land_size = callbackQuery.data;
    await deleteMessageWithCallback(ctx);
    ctx.reply(...constructionFormatter.landStatusDisplay());
    return ctx.wizard.next();
  }
  async chooseLandStatus(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (!callbackQuery) return ctx.reply(constructionFormatter.messages.useButtonError);

    if (areEqaul(callbackQuery.data, 'back', true)) {
      await deleteMessageWithCallback(ctx);
      await ctx.reply(...constructionFormatter.landSizeDisplay());
      return ctx.wizard.back();
    }

    if (!isInInlineOption(callbackQuery.data, constructionFormatter.landStatusOption))
      return ctx.reply(...constructionFormatter.messages.unknowOptionError);

    ctx.wizard.state.land_status = callbackQuery.data;
    await deleteMessageWithCallback(ctx);
    ctx.reply(...constructionFormatter.locationDisplay());
    return ctx.wizard.next(); // jump back to second controller
  }

  async enterLocation(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      if (areEqaul(ctx.wizard.state.size, 'small', true)) {
        await deleteKeyboardMarkup(ctx, constructionFormatter.messages.documentRequestTypePrompt);
        ctx.reply(...constructionFormatter.documentRequestDisplay());
        return ctx.wizard.selectStep(3); // jump to 4'th controller (document request type)
      }
      await deleteKeyboardMarkup(ctx, constructionFormatter.messages.landStatusPrompt);
      ctx.reply(...constructionFormatter.documentRequestDisplay());
      return ctx.wizard.back(); // jump to 4'th controller (document request type)
    }

    // assign the location to the state
    ctx.wizard.state.location = message;
    await ctx.reply(...constructionFormatter.descriptionDisplay());
    return ctx.wizard.next();
  }

  async enterDescription(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...constructionFormatter.locationDisplay());
      return ctx.wizard.back();
    }
    const validationMessage = postValidator('description', message);
    if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.description = message;
    ctx.wizard.state.status = 'Previewing';

    if (areEqaul(ctx.wizard.state.size, 'small', true)) {
      deleteKeyboardMarkup(ctx);
      ctx.reply(...constructionFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      ctx.reply(...constructionFormatter.previewCallToAction());
      return ctx.wizard.selectStep(9); // jump to 10'th controller
    }
    ctx.reply(...constructionFormatter.photoDisplay());
    return ctx.wizard.next();
  }
  async attachPhoto(ctx: any) {
    const message = ctx?.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...constructionFormatter.descriptionDisplay());
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...constructionFormatter.photoDisplay());

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
      deleteKeyboardMarkup(ctx);
      ctx.reply(...constructionFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      ctx.reply(...constructionFormatter.previewCallToAction());
      return ctx.wizard.next();
    }
  }
  async preview(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    console.log(callbackQuery.data);
    if (!callbackQuery) {
      const message = ctx.message.text;
      if (message == 'Back') {
        await ctx.reply(...constructionFormatter.photoDisplay(), constructionFormatter.goBackButton());
        return ctx.wizard.back();
      }
      await ctx.reply('....');
    } else {
      const state = ctx.wizard.state;
      switch (callbackQuery.data) {
        case 'edit_data': {
          ctx.wizard.state.editField = null;
          await deleteMessageWithCallback(ctx);
          ctx.reply(...constructionFormatter.editPreview(state), { parse_mode: 'HTML' });
          return ctx.wizard.next();
        }

        case 'cancel': {
          await deleteMessageWithCallback(ctx);
          ctx.scene.leave();
          return MainMenuController.onStart(ctx);
        }
        case 'post_data': {
          console.log('here you are');
          // api request to post the data
          const response = await Section4ConstructionService.createConstructionPost(
            {
              construction_size: state?.size,
              company_experience: state?.company_experience,
              document_request_type: state?.document_request_type,
              land_size: state?.land_size,
              land_status: state?.land_status,
              location: state.location,
              photo: state?.photo,
              description: state.description,
              category: 'Section4Construction',
              notify_option: state.notify_option,
            },
            callbackQuery.from.id,
          );
          // console.log(response);
          // ctx.reply(...constructionFormatter.postingSuccessful());

          if (response?.success) {
            console.log('Posting successful');
            await deleteMessageWithCallback(ctx);
            await displayDialog(ctx, constructionFormatter.messages.postSuccessMsg);
            ctx.scene.leave();
            return MainMenuController.onStart(ctx);
          } else {
            ctx.reply(...constructionFormatter.postingError());
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
        default: {
          await ctx.reply('DEFAULT');
        }
      }
    }
  }

  async editData(ctx: any) {
    const state = ctx.wizard.state;
    const fileds = [
      'document_request_type',
      'company_experience',
      'land_size',
      'land_status',
      'location',
      'description',
      'photo',
    ];
    const callbackQuery = ctx?.callbackQuery;
    const editField = ctx.wizard.state?.editField;
    if (!callbackQuery) {
      const messageText = ctx.message.text;
      if (!editField) return await ctx.reply('invalid input ');

      // changing field value
      ctx.wizard.state[editField] = messageText;
      await deleteKeyboardMarkup(ctx);
      return ctx.reply(...constructionFormatter.editPreview(state), { parse_mode: 'HTML' });
    }

    // if callback exists
    // save the mesage id for later deleting
    ctx.wizard.state.previousMessageData = {
      message_id: ctx.callbackQuery.message.message_id,
      chat_id: ctx.callbackQuery.message.chat.id,
    };
    const callbackMessage = callbackQuery.data;

    if (callbackMessage == 'editing_done') {
      await deleteMessageWithCallback(ctx);
      await ctx.reply(...constructionFormatter.preview(state));
      return ctx.wizard.back();
    }

    if (fileds.some((filed) => filed == callbackQuery.data)) {
      // selecting field to change
      ctx.wizard.state.editField = callbackMessage;
      await ctx.telegram.deleteMessage(
        ctx.wizard.state.previousMessageData.chat_id,
        ctx.wizard.state.previousMessageData.message_id,
      );
      await ctx.reply(...((await constructionFormatter.editFieldDispay(callbackMessage)) as any));
      if (areEqaul(callbackQuery.data, 'photo', true)) return ctx.wizard.next();
      return;
    }

    if (editField) {
      //  if edit filed is selected change field valued
      ctx.wizard.state[editField] = callbackMessage;
      await deleteMessageWithCallback(ctx);
      ctx.wizard.state.editField = null;
      return ctx.reply(...constructionFormatter.editPreview(state), { parse_mode: 'HTML' });
    }
  }
  async editPhoto(ctx: any) {
    const messageText = ctx.message?.text;
    if (messageText && areEqaul(messageText, 'back', true)) {
      await deleteMessage(ctx, {
        message_id: (parseInt(messageText.message_id) - 1).toString(),
        chat_id: messageText.chat.id,
      });
      ctx.reply(...constructionFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...constructionFormatter.photoDisplay());

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
      ctx.reply(...constructionFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
      return ctx.wizard.back();
    }
  }
}

export default QuestionPostSectionConstructionController;
