class QuestionService {
  constructor() {}

  async handleSearch(ctx: any) {
    return await ctx.answerInlineQuery(
      [
        {
          type: 'article',
          id: '0',
          title: 'Hello guys here is my question 3',
          input_message_content: {
            message_text: '#tech\n\nWhat is the best programming language for beginners? \n\nBy: @username',
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
              [
                // navigate to the bot and start the bot with the command 'answer'
                { text: 'Answer', url: 'https://t.me/ttynabot?start=answer' },
                { text: 'Browse', url: 'https://t.me/ttynabot?start=browse' },
              ],
            ],
          },
          description: 'Asked 1 month ago, 2 Answers',
        },
      ],

      {
        button: {
          text: '62 Questions: Show All',
          start_parameter: 'from_inline',
        },
      },
    );
  }
  async searchByTitle() {}
}

export default QuestionService;
