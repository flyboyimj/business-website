/**
 * Lambda entry point: connects the handler to Amazon SES.
 * The AWS SDK v3 is included in the Node.js 22 Lambda runtime, so there is
 * nothing to install. The function authenticates with its IAM role; no keys
 * are stored anywhere in this project.
 */
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { createHandler } from './handler.mjs';

const ses = new SESv2Client({});
export const handler = createHandler({ send: (input) => ses.send(new SendEmailCommand(input)) });
