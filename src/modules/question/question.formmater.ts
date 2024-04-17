import config from '../../config/config';
import { TableInlineKeyboardButtons } from '../../types/components';
import { InlineKeyboardButtons } from '../../ui/button';
import { formatDateFromIsoString } from '../../utils/constants/date';

class QuestionFormmatter {
  messages = {
    noQuestionTitle: '**No question found mathcing your query**',
    noQuestionDesc: 'Click here to ask a question',
    NoQuestionMessageText: 'Click the button below  to ask ',
    allQuestionsMsg: 'Click the button below  to list the questions ',
  };

  constructor() {}

  seachQuestionTopBar(questionsNumber: number = 0, searchString: string) {
    return {
      button: {
        text: `${questionsNumber} Questions: Show All`,
        start_parameter: `all_questions_${searchString}_${questionsNumber}`,
      },
    };
  }

  questionOptionsButtons(questionId: string, withUrl?: boolean) {
    if (withUrl)
      return [
        // navigate to the bot and start the bot with the command 'answer'
        { text: `Answer`, url: `${config.bot_url}?start=answer_${questionId}` },
        { text: `Browse`, url: `${config.bot_url}?start=browse_${questionId}` },
      ];
    else
      return InlineKeyboardButtons([
        [
          { text: 'Answer', cbString: `answer_${questionId}` },
          { text: 'Browse', cbString: `browse_${questionId}` },
        ],
      ]);
  }

  formatSearchQuestions(questions: any[]) {
    return questions.map((question, index) => ({
      type: 'article',
      id: `${question.id}_${index}`,
      title: question.description,
      input_message_content: {
        message_text: `#${question.category}\n\n${question.description}? \n\nBy: @username`,
        parse_mode: 'Markdown',
        entities: [
          {
            type: 'bold',
            offset: 0,
            length: 10,
          },
        ],
      },
      reply_markup: {
        inline_keyboard: [this.questionOptionsButtons(question.id.toString(), true)],
      },
      description: `Asked ${formatDateFromIsoString(question?.created_at)}, ${question.Answer.length} Answers`,
      // thumbnail_url:
      //   'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w600/2023/10/free-images.jpg',
      // thumbnail_url: question.photo[0],
      // send image inside the message
      photo_url: question.photo[0],
      photo_width: 500,
      photo_height: 500,

      // thumbnail
      // thumb_url: question.photo[0],
      // thumb_width: 500,
      // thumb_height: 500,
    }));
  }
  formatNoQuestionsErrorMessage() {
    return [
      {
        type: 'article',
        id: `_${1111}`,
        title: this.messages.noQuestionTitle,
        description: this.messages.noQuestionDesc,
        input_message_content: {
          message_text: this.messages.NoQuestionMessageText,
          parse_mode: 'Markdown',
          entities: [
            {
              type: 'bold',
              offset: 0,
              length: 10,
            },
          ],
        },
        reply_markup: {
          inline_keyboard: [
            // navigate to the bot and start the bot with the command 'answer'
            { text: `Ask a question`, url: `${config.bot_url}?start` },
          ],
        },
      },
    ];
  }
  displayAllPromptFomatter = (questionsNumber: number, searchString: string) => {
    return [
      `Found ${questionsNumber} Questions matching word "${searchString}"\n${this.messages.allQuestionsMsg}`,
      InlineKeyboardButtons([[{ text: 'Show All Question', cbString: 'show_all_questions:1' }]]),
    ];
  };
  formatSingleQuestion(question: any) {
    return [
      `#${question.category}\n\n${question.description}\n\nBy: <a href="${config.bot_url}?start=userProfile_${question.user.id}">${question.user.display_name}</a>\n${formatDateFromIsoString(question.created_at)}`,
      this.questionOptionsButtons(question.id),
    ];
  }
}

export default QuestionFormmatter;
