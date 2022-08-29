import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { google } from 'googleapis';
import * as Handlebars from 'handlebars';
import * as juice from 'juice';
import { readFileSync } from 'fs';
import * as path from 'path';

dotenv.config();

const OAuth2_client = new google.auth.OAuth2(
  process.env.GCP_CLIENT_ID,
  process.env.GCP_CLIENT_PW,
);

OAuth2_client.setCredentials({ refresh_token: process.env.GCP_REFRESH_TOKEN });

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    type: 'OAuth2',
    user: 'looknote.official@befferent.co.kr',
    clientId: process.env.GCP_CLIENT_ID,
    clientSecret: process.env.GCP_CLIENT_PW,
    refreshToken: process.env.GCP_REFRESH_TOKEN,
  },
});

interface IFile {
  filename: string;
  path: string;
}

interface IOption {
  to: string;
  subject: string;
  attachments?: Array<IFile>;
  html?: any;
  text?: any;
}

export function mailer(templateVars, options: IOption) {
  const file = readFileSync(
    path.join(process.cwd(), 'src', 'static', 'code.html'),
    'utf-8',
  );
  const htmlWithStylesInlined = juice(file, {
    removeStyleTags: true,
    preserveMediaQueries: true,
  });
  const template = Handlebars.compile(htmlWithStylesInlined);
  const result = template(templateVars);

  return transporter.sendMail({
    from: '<LookNote> looknote.official@befferent.co.kr',
    html: result,
    ...options,
  });
}
