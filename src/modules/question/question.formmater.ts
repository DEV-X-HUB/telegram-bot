import config from '../../config/config';

class QuestionFormmatter {
  constructor() {}

  displayAllQuestionsButton(questionsNumber: number = 0) {
    return {
      button: {
        text: `${questionsNumber} Questions: Show All`,
        start_parameter: 'from_inline',
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
}

export default QuestionFormmatter;
