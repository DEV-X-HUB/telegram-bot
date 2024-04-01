import config from '../../config/config';
import { deleteKeyboardMarkup, deleteMessage, deleteMessageWithCallback } from '../../utils/constants/chat';
import { areEqaul, isInInlineOption, isInMarkUPOption } from '../../utils/constants/string';

import Section1CFormatter from './section1c.formatter';
// import QuestionService from './question.service';
const section1cFormatter = new Section1CFormatter();

let imagesUploaded: any[] = [];
const imagesNumber = 4;

class Section1cController {
  constructor() {}

  async start(ctx: any) {
    ctx.wizard.state.category = 'Section1c';
    await ctx.reply(...section1cFormatter.choosePaperStampDisplay());

    return ctx.wizard.next();
  }

  async choosePaperTimeStamp(ctx: any) {
    const callbackQuery = ctx.callbackQuery;

    // if the user is using the inline keyboard
    if (callbackQuery) {
      if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
        deleteMessageWithCallback(ctx);
        ctx.reply(...section1cFormatter.choosePaperStampDisplay());
        return ctx.wizard.back();
      }

      if (isInInlineOption(callbackQuery.data, section1cFormatter.paperStampOption)) {
        ctx.wizard.state.paper_stamp = callbackQuery.data;
        deleteMessageWithCallback(ctx);
        ctx.reply(...section1cFormatter.arBrOptionDisplay());
        return ctx.wizard.next();
      }
    }

    // if the user is using the text message
    else {
      await ctx.reply(...section1cFormatter.paperTimestampError());
      // stay on the same step
      // return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }
  }
  async arBrOption(ctx: any) {
    const message = ctx?.message?.text;
    const callbackQuery = ctx?.callbackQuery;

    if (!callbackQuery) {
      if (message && areEqaul(message, 'back', true)) {
        ctx.reply(...section1cFormatter.choosePaperStampDisplay());
        return ctx.wizard.back();
      }
    }
    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.choosePaperStampDisplay());
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, section1cFormatter.arBrOption)) {
      ctx.wizard.state.ar_br = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      // await deleteMessage(ctx, {
      //   message_id: (parseInt(callbackQuery.message.message_id) - 1).toString(),
      //   chat_id: callbackQuery.message.chat.id,
      // });
      ctx.reply(...section1cFormatter.woredaListDisplay());
      return ctx.wizard.next();
    }
    return ctx.reply('Unknown option. Please choose a valid option.');
  }
  async choooseWoreda(ctx: any) {
    const message = ctx.message?.text;
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) {
      if (message && areEqaul(message, 'back', true)) {
        ctx.reply(...section1cFormatter.arBrOptionDisplay());
        return ctx.wizard.back();
      }
    }
    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.arBrOptionDisplay());
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, section1cFormatter.woredaList)) {
      ctx.wizard.state.woreda = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.serviceType1Display());
      return ctx.wizard.next();
    }
    return ctx.reply('Unknown option. Please choose a valid option.');
  }

  async chooseServiceType1(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.woredaListDisplay());
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, section1cFormatter.serviceType1)) {
      ctx.wizard.state.service_type_1 = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.serviceType2Display());
      return ctx.wizard.next();
    }
  }

  async chooseServiceType2(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.serviceType1Display());
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, section1cFormatter.serviceType2)) {
      ctx.wizard.state.service_type_2 = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.serviceType3Display());
      return ctx.wizard.next();
    }
  }

  async chooseServiceType3(ctx: any) {
    const callbackQuery = ctx.callbackQuery;
    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.serviceType2Display());
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, section1cFormatter.serviceType3)) {
      ctx.wizard.state.service_type_3 = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.yearOfConfirmationPrompt());
      return ctx.wizard.next();
    }
  }

  async yearOfConfirmation(ctx: any) {
    const message = ctx.message.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section1cFormatter.serviceType3Display());
      return ctx.wizard.back();
    }

    // const validationMessage = questionPostValidator('year_of_confirmation', message);
    // if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.year_of_confirmation = message;
    await ctx.reply(...section1cFormatter.bIDIOptionDisplay());
    return ctx.wizard.next();
  }

  // bi/di
  async IDFirstOption(ctx: any) {
    const message = ctx.message?.text;
    const callbackQuery = ctx.callbackQuery;

    if (!callbackQuery) {
      if (message && areEqaul(message, 'back', true)) {
        ctx.reply(...section1cFormatter.yearOfConfirmationPrompt());
        return ctx.wizard.back();
      }
      return ctx.reply('Unknown option. Please use buttons to choose .');
    }
    if (callbackQuery.data && areEqaul(callbackQuery.data, 'back', true)) {
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.yearOfConfirmationPrompt());
      return ctx.wizard.back();
    }

    if (isInInlineOption(callbackQuery.data, section1cFormatter.bIDiOption)) {
      ctx.wizard.state.bi_di = callbackQuery.data;
      deleteMessageWithCallback(ctx);
      ctx.reply(...section1cFormatter.lastDigitPrompt());
      return ctx.wizard.next();
    }
  }
  async enterLastDigit(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section1cFormatter.bIDIOptionDisplay());
      return ctx.wizard.back();
    }

    // const validationMessage = questionPostValidator('last_digit', message);
    // if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.last_digit = message;
    ctx.reply(...section1cFormatter.descriptionPrompt());
    return ctx.wizard.next();
  }

  async enterDescription(ctx: any) {
    const message = ctx.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section1cFormatter.lastDigitPrompt());
      return ctx.wizard.back();
    }

    // const validationMessage = questionPostValidator('description', message);
    // if (validationMessage != 'valid') return await ctx.reply(validationMessage);
    ctx.wizard.state.description = message;
    ctx.reply(...section1cFormatter.photoPrompt());
    return ctx.wizard.next();
  }
  async attachPhoto(ctx: any) {
    console.log(' being received');
    const message = ctx?.message?.text;
    if (message && areEqaul(message, 'back', true)) {
      ctx.reply(...section1cFormatter.descriptionPrompt());
      return ctx.wizard.back();
    }

    // check if image is attached
    if (!ctx.message.photo) return ctx.reply(...section1cFormatter.photoPrompt());

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
      ctx.reply(...section1cFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      //   ctx.reply(...section1cFormatter.preview(ctx.wizard.state), { parse_mode: 'HTML' });
      //   ctx.reply(...postingFormatter.previewCallToAction());
      // return ctx.wizard.next();
    }
  }
}

// async editData(ctx: any) {
//   const state = ctx.wizard.state;
//   const fileds = ['ar_br', 'bi_di', 'woreda', 'last_digit', 'location', 'description', 'photo', 'cancel'];
//   const callbackQuery = ctx?.callbackQuery;
//   const editField = ctx.wizard.state?.editField;
//   if (!callbackQuery) {
//     // changing field value
//     const messageText = ctx.message.text;
//     if (!editField) return await ctx.reply('invalid input ');

//     // const validationMessage = questionPostValidator(ctx.wizard.state.editField, ctx.message.text);
//     // if (validationMessage != 'valid') return await ctx.reply(validationMessage);

//     ctx.wizard.state[editField] = messageText;
//     await deleteKeyboardMarkup(ctx);
//     // await deleteMessage(ctx, {
//     //   message_id: (parseInt(ctx.message.message_id) - 1).toString(),
//     //   chat_id: ctx.message.chat.id,
//     // });
//     return ctx.reply(...postingFormatter.editPreview(state), { parse_mode: 'HTML' });
//   }

//   // if callback exists
//   // save the mesage id for later deleting
//   ctx.wizard.state.previousMessageData = {
//     message_id: ctx.callbackQuery.message.message_id,
//     chat_id: ctx.callbackQuery.message.chat.id,
//   };
//   const callbackMessage = callbackQuery.data;

//   if (callbackMessage == 'post_data') {
//     // registration
//     // api call for registration
//     const response = await QuestionService.createQuestionPost(ctx.wizard.state, callbackQuery.from.id);

//     if (response.success) {
//       ctx.wizard.state.status = 'pending';
//       await deleteMessageWithCallback(ctx);
//       await ctx.reply(...postingFormatter.postingSuccessful());
//       return ctx.scene.enter('start');
//     }

//     const registrationAttempt = parseInt(ctx.wizard.state.registrationAttempt);

//     // ctx.reply(...postingFormatter.postingError());
//     if (registrationAttempt >= 2) {
//       await deleteMessageWithCallback(ctx);
//       return ctx.scene.enter('start');
//     }
//     return (ctx.wizard.state.registrationAttempt = registrationAttempt ? registrationAttempt + 1 : 1);
//   } else if (callbackMessage == 'editing_done') {
//     // await deleteMessageWithCallback(ctx);

//     await ctx.reply(...postingFormatter.preview(state));
//     return ctx.wizard.back();
//   }

//   if (fileds.some((filed) => filed == callbackQuery.data)) {
//     // selecting field to change
//     ctx.wizard.state.editField = callbackMessage;
//     await ctx.telegram.deleteMessage(
//       ctx.wizard.state.previousMessageData.chat_id,
//       ctx.wizard.state.previousMessageData.message_id,
//     );
//     await ctx.reply(...((await postingFormatter.editFieldDispay(callbackMessage)) as any));
//     if (areEqaul(callbackQuery.data, 'photo', true)) return ctx.wizard.next();
//     return;
//   }

//   if (editField) {
//     //  if edit filed is selected

//     ctx.wizard.state[editField] = callbackMessage;
//     await deleteMessageWithCallback(ctx);
//     ctx.wizard.state.editField = null;
//     return ctx.reply(...postingFormatter.editPreview(state), { parse_mode: 'HTML' });
//   }
// }
// async editPhoto(ctx: any) {
//   const messageText = ctx.message?.text;
//   if (messageText && areEqaul(messageText, 'back', true)) {
//     await deleteMessage(ctx, {
//       message_id: (parseInt(messageText.message_id) - 1).toString(),
//       chat_id: messageText.chat.id,
//     });
//     ctx.reply(...postingFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
//     return ctx.wizard.back();
//   }

//   // check if image is attached
//   if (!ctx.message.photo) return ctx.reply(...postingFormatter.photoPrompt());

//   // Add the image to the array
//   imagesUploaded.push(ctx.message.photo[0].file_id);

//   // Check if all images received
//   if (imagesUploaded.length === imagesNumber) {
//     const file = await ctx.telegram.getFile(ctx.message.photo[0].file_id);

//     const mediaGroup = imagesUploaded.map((image: any) => ({
//       media: image,
//       type: 'photo',
//       caption: image == imagesUploaded[0] ? 'Here are the images you uploaded' : '',
//     }));

//     await ctx.telegram.sendMediaGroup(ctx.chat.id, mediaGroup);

//     // Save the images to the state
//     ctx.wizard.state.photo = imagesUploaded;

//     // empty the images array
//     // imagesUploaded.length = 0;
//     ctx.reply(...postingFormatter.editPreview(ctx.wizard.state), { parse_mode: 'HTML' });
//     return ctx.wizard.back();
//   }
// }

export default Section1cController;
