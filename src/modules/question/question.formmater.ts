import { Question, User } from '@prisma/client';
import config from '../../config/config';
import { TableInlineKeyboardButtons } from '../../types/components';
import { InlineKeyboardButtons } from '../../ui/button';
import { formatDateFromIsoString } from '../../utils/constants/date';
import { capitalize, areEqaul } from '../../utils/constants/string';

class QuestionFormmatter {
  answerOptions: TableInlineKeyboardButtons = [
    [
      { text: '✏️ Edit', cbString: 'edit_answer' },
      { text: 'cancel', cbString: 'cancel_answer' },
    ],
    [{ text: '✅ Post', cbString: 'post_answer' }],
  ];
  messages = {
    noQuestionTitle: '**No question found mathcing your query**',
    noQuestionDesc: 'Click here to ask a question',
    NoQuestionMessageText: 'Click the button below  to ask ',
    allQuestionsMsg: 'Click the button below  to list the questions ',
    useButtonError: 'use buttons to select  ',
  };

  constructor() {}

  seachQuestionTopBar(questionsNumber: number = 0, searchString: string) {
    return {
      text: `${questionsNumber} Questions: Show All`,
      start_parameter: `all_questions_${searchString}_${questionsNumber}`,
    };
  }

  questionOptionsButtons(questionId: string, withUrl?: boolean) {
    if (withUrl)
      return [
        // navigate to the bot and start the bot with the command 'answer'
        { text: `Answer`, url: `${config.bot_url}?start=answer_${questionId}` },
        // { text: `Browse`, url: `${config.bot_url}?start=browse_${questionId}` },
      ];
    else
      return InlineKeyboardButtons([
        [
          { text: 'Browse', cbString: `browse_${questionId}` },
          { text: 'Subscribe', cbString: `subscribe_${questionId}` },
        ],
      ]);
  }

  formatSearchQuestions(questions: any[]) {
    return questions.map((question, index) => ({
      type: 'article',
      id: `${question.id}_${index}`,
      title: question.description,
      input_message_content: {
        message_text: `#${question.category}\n\n${question.description}\n\nBy: <a href="${config.bot_url}?start=userProfile_${question.user.id}">${question.user.display_name}</a>\n${formatDateFromIsoString(question.created_at)}`,
        parse_mode: 'HTML',
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
      description: `Posted ${formatDateFromIsoString(question?.created_at)},  ${capitalize(question.status)}`,
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
  formatSingleQuestion(question: any, forAnswer?: boolean) {
    return [
      `#${question.category}\n\n${question.description}\n\nBy: <a href="${config.bot_url}?start=userProfile_${question.user.id}">${question.user.display_name}</a>\n${formatDateFromIsoString(question.created_at)}`,
      this.questionOptionsButtons(question.id, !forAnswer),
    ];
  }
  getFormattedQuestionPreview(question: any) {
    switch (true) {
      case areEqaul(question.category, 'Section 1A', true): {
        return `#${question.category.replace(/ /g, '_')}\n________________\n\n${question.ar_br.toLocaleUpperCase()}\n\nWoreda: ${question.woreda} \n\nLast digit: ${question.last_digit}\n\nBy: <a href="${config.bot_url}?start=userProfile_${question.user.id}">${question.user.display_name}</a>`;
      }
    }
  }
  formatQuestionDetail(question: any, forAnswer?: boolean) {
    return [this.getformattedQuestionDetail(question)];
  }
  formatAnswerPreview(answer: string, sender: User) {
    return [
      `${answer}\n\n\nBy: <a href="${config.bot_url}?start=userProfile_${sender.id}">${sender.display_name || 'Anonymous'}</a>\n${formatDateFromIsoString(new Date().toISOString())}`,
      InlineKeyboardButtons(this.answerOptions),
    ];
  }

  getformattedQuestionDetail(question: any) {
    switch (true) {
      case areEqaul(question.category, 'Section 1A', true): {
        return `#${question.category.replace(/ /g, '_')}\n________________\n\n${question.ar_br.toLocaleUpperCase()}\n\nWoreda: ${question.woreda} \n\nLast digit: ${question.last_digit} ${question.bi_di.toLocaleUpperCase()} \n\nSp. Locaton: ${question.location} \n\nDescription: ${question.description}\n\nBy: <a href="${config.bot_url}?start=userProfile_${question.user.id}">${question.user.display_name || 'Anonymous '}</a>\n\nStatus : ${question.status}`;
      }
    }
  }
}

export default QuestionFormmatter;
