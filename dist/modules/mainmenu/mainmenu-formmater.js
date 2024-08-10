"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const button_1 = require("../../ui/button");
const config_1 = __importDefault(require("../../config/config"));
class MainmenuFormatter {
    constructor() {
        this.messages = {
            selectOptionPrompt: 'Select an option',
        };
        this.mainMenuOptionsFristRound = [
            [
                { text: 'Service 1', cbString: '' },
                { text: 'Service 2', cbString: '' },
            ],
            [
                { text: 'Service 3', cbString: '' },
                { text: 'Service 4', cbString: '' },
            ],
            [
                { text: '🔍 Search Questions', cbString: '' },
                { text: 'Browse', cbString: '' },
            ],
            [
                { text: 'Profile', cbString: '' },
                { text: 'Next', cbString: '' },
            ],
        ];
        this.mainMenuOptionsSecondRound = [
            [
                { text: 'FAQ', cbString: '' },
                { text: 'Terms and Conditions', cbString: '' },
            ],
            [
                { text: 'About Us', cbString: '' },
                { text: 'Contact Us', cbString: '' },
            ],
            [
                { text: 'Customer Service', cbString: '' },
                { text: 'Go Back', cbString: '' },
            ],
        ];
        this.faqs = [
            {
                question: 'how long do quetios take to be appoved',
                answer: 'Questiosn can take from less than hour to a day or two to be appvroded',
            },
            {
                question: 'is my identity hidden',
                answer: 'Yes!, ther is no way for other to know who you truely are',
            },
        ];
        this.termsAndConditions = {
            intro: `These Terms and Conditions  govern your use of <b> <a href="${config_1.default.bot_url}">${config_1.default.bor_name}</a></b>  provided by  <b> <a href="${config_1.default.company_url}">${config_1.default.comapny_name}</a></b>. By accessing or using the Service, you agree to comply with and be bound by these Terms. If you do not agree with these Terms, please do not use the Service.`,
            details: [
                {
                    title: 'Acceptance of Terms',
                    description: `By using the Service, you confirm that you are at least 18 years old or have reached the age of majority in your jurisdiction, and have the legal capacity to enter into these Terms.`,
                },
                {
                    title: 'Changes to Terms',
                    description: `We reserve the right to modify these Terms at any time. Any changes will be effective immediately upon posting the updated Terms on our website. Your continued use of the Service after any changes indicates your acceptance of the new Terms.`,
                },
                {
                    title: 'Account Registration',
                    description: `To access certain features of the Service, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your account information and for all activities that occur under your account.`,
                },
                {
                    title: 'Privacy Policy',
                    description: `Your use of the Service is also governed by our Privacy Policy, which can be found at [Privacy Policy URL]. By using the Service, you consent to the practices described in the Privacy Policy.`,
                },
                {
                    title: 'User Conduct',
                    description: `You agree not to:
  - Use the Service for any unlawful purpose or in any way that violates these Terms.
  - Post or transmit any content that is offensive, defamatory, obscene, or otherwise objectionable.
  - Interfere with or disrupt the Service or servers or networks connected to the Service.`,
                },
                {
                    title: 'Intellectual Property',
                    description: `All content and materials available on the Service, including but not limited to text, graphics, website name, code, images, and logos, are the intellectual property of [Your Company Name] and are protected by applicable copyright and trademark law. You agree not to reproduce, duplicate, copy, modify, or use any portion of the Service without our prior written permission.`,
                },
                {
                    title: 'Termination',
                    description: `We reserve the right to terminate or suspend your account and access to the Service at our sole discretion, without notice and without liability, for any reason, including if we believe you have violated these Terms.`,
                },
                {
                    title: 'Disclaimer of Warranties',
                    description: `The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components.`,
                },
                {
                    title: 'Limitation of Liability',
                    description: `To the fullest extent permitted by law, [Your Company Name] shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (i) your use or inability to use the Service; (ii) any unauthorized access to or use of our servers and/or any personal information stored therein; (iii) any interruption or cessation of transmission to or from the Service.`,
                },
                {
                    title: 'Governing Law',
                    description: `These Terms shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law principles.`,
                },
                {
                    title: 'Contact Us',
                    description: `If you have any questions about these Terms, please contact us at [Your Contact Information].`,
                },
            ],
        };
        this.aboutUs = `Welcome to Tech Innovators Inc. We are dedicated to revolutionizing the technology landscape with innovative solutions and sustainable practices. Our mission is to drive progress and create a smarter, more connected future for everyone.
`;
        this.customerServiceLinks = [
            {
                name: 'Support Team',
                telegramLink: 'https://t.me/support_team',
            },
            {
                name: 'Sales Inquiries',
                telegramLink: 'https://t.me/sales_inquiries',
            },
            {
                name: 'Technical Assistance',
                telegramLink: 'https://t.me/technical_assistance',
            },
        ];
        this.contactLinks = [
            {
                name: 'Telegram',
                link: 'https://t.me/your_telegram_username',
            },
            {
                name: 'Facebook',
                link: 'https://www.facebook.com/your_page',
            },
            {
                name: 'Email',
                link: 'your@email.com',
            },
        ];
    }
    chooseServiceDisplay(round) {
        if (round == 2)
            return [this.messages.selectOptionPrompt, (0, button_1.MarkupButtons)(this.mainMenuOptionsSecondRound)];
        else
            return [this.messages.selectOptionPrompt, (0, button_1.MarkupButtons)(this.mainMenuOptionsFristRound)];
    }
    formatJoinMessage(first_name) {
        return [
            `Hey ${first_name} 👋\nIt seems like you haven't joined our channel yet,the channel is where we post questions asked by you and others,\n\nJoin using the button below!`,
            (0, button_1.urlButton)('Join', `https://t.me/${config_1.default.channel_username}`),
        ];
    }
    formatReJoinMessage(first_name) {
        return [
            `Hey ${first_name} 👋\nIt seems like you have left our channel,the channel is where we post questions asked by you and others,\n\nJoin using the button below!`,
            (0, button_1.urlButton)('Join', `https://t.me/${config_1.default.channel_username}`),
        ];
    }
    formatFailedJoinCheck(message) {
        return [`<b>Failed to check user in channel</b>\n<i>${message}</i> \n<b>Please try again!</b>`];
    }
    formatFailedDevMessage() {
        return [
            `<b>The Bot is Under Development.</b>\n<i>${'Please wait until deployment'}</i> \n<b>We appreciate your intereset!</b>`,
        ];
    }
    formatFAQ() {
        let index = 0;
        let responseMessage = `-------------  <b>Frequently Asked Questions</b> ------------\n\n`;
        for (const { question, answer } of this.faqs) {
            responseMessage += `<b>${index + 1}. ${question}</b>\n  <b>---</b> ${answer}\n\n`;
            index++;
        }
        return responseMessage;
    }
    formatCustomerSerive() {
        let index = 0;
        let responseMessage = `-------------  <b>Customer Serivce</b> ------------\n\nUse the follwing links to get help\n\n`;
        for (const { name, telegramLink } of this.customerServiceLinks) {
            responseMessage += ` <b> <a href="${telegramLink}">${name}</a></b>\n\n`;
            index++;
        }
        return responseMessage;
    }
    formatContactUs() {
        let index = 0;
        let responseMessage = `-------------  <b>Contact Us</b> ------------\n\nUse the follwing links to get reach us\n\n`;
        for (const { name, link } of this.contactLinks) {
            if (name.toLocaleLowerCase() == 'email')
                responseMessage += `<b>${name.toLocaleUpperCase()}</b> :<i>${link}</i>\n\n`;
            else
                responseMessage += `<b>${name.toLocaleUpperCase()}</b> :<a href="${link}">${name}</a>\n\n`;
            index++;
        }
        return responseMessage;
    }
    formatAboutUs() {
        let index = 0;
        let responseMessage = `-------------  <b>About Us</b> ------------\n\n`;
        return responseMessage + this.aboutUs;
    }
    formatTermsandCondtions() {
        let index = 0;
        let responseMessage = `-------------  <b>Terms and Conditions</b> ------------\n\n${this.termsAndConditions.intro}\n\n`;
        for (const { title, description } of this.termsAndConditions.details) {
            responseMessage += `<b>${index + 1}. ${title}</b>\n  <b>---</b> ${description}\n\n`;
            index++;
        }
        return responseMessage;
    }
}
exports.default = MainmenuFormatter;
//# sourceMappingURL=mainmenu-formmater.js.map