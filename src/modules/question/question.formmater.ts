import config from '../../config/config';
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

  seachQuestionTopBar(questionsNumber: number = 0) {
    return {
      button: {
        text: `${questionsNumber} Questions: Show All`,
        start_parameter: 'all_questions',
      },
    };
  }

  questionOptionsButtons(questionId: string) {
    return [
      // navigate to the bot and start the bot with the command 'answer'
      { text: `Answer`, url: `${config.bot_url}?start=answer_${questionId}` },
      { text: `Browse`, url: `${config.bot_url}?start=browse_${questionId}` },
    ];
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
        inline_keyboard: [this.questionOptionsButtons(question.id.toString())],
      },
      description: `Asked ${formatDateFromIsoString(question?.created_at)}, ${question.Answer.length} Answers`,
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
      `Found ${questionsNumber} qustiosn matching word $${searchString}\n${this.messages.allQuestionsMsg}`,
      InlineKeyboardButtons([]),
    ];
  };
}

export default QuestionFormmatter;
