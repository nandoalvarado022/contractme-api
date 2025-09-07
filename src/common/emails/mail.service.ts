import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendRawEmailCommand, SESClient } from '@aws-sdk/client-ses'
const nodemailer = require('nodemailer');
import * as fs from 'fs';
import * as path from 'path';
import { emailTemplates } from './templates';
const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");

@Injectable()
export class MailService {
  // constructor(private mailerService: MailerService) { }

  async sendWelcomeEmail(to: string, name: string) {
    const sesClient = new SESv2Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.BREVO_KEY,
        secretAccessKey: process.env.BREVO_SECRET_KEY,
      }
    });

    const transporter = nodemailer.createTransport({
      SES: { sesClient, SendEmailCommand },
    });

    try {
      await transporter.sendMail({
        from: "comunicaciones@contractme.cloud",
        to: [to],
        subject: '¡Bienvenido a nuestra app! 🎉',
        text: `Hola ${name}, bienvenido a nuestra plataforma.`,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async SendWelcomeEmailBrevo(to: string, name: string, templateName: string) {
    const fileName = emailTemplates[templateName];
    if (!fileName) {
      throw new Error('Template de email no encontrado.');
    }

    const templatePath = path.join(__dirname, '../../assets/email_templates', fileName);
    let html = '';
    try {
      html = fs.readFileSync(templatePath, 'utf8');
      html = html.replace(/{{\s*name\s*}}/g, name);
    } catch (err) {
      console.error('Error loading email template:', err);
      throw new Error('No se pudo cargar el template de email.');
    }

    const transporter = nodemailer.createTransport({
      // host: 'smtp-relay.brevo.com',
      host: process.env.BREVO_SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: 'Gaby de ContractMe <comunicaciones@contractme.cloud>',
        to: [to],
        subject: '¡Bienvenido a nuestra app! 🎉',
        html,
      });
    } catch (error) {
      console.error('Error sending email with Brevo:', error);
    }
  }

  // sendWelcomeEmail2(to: string, name: string) {
  //   return  this.mailerService.sendMail({
  //     to,
  //     subject: '¡Bienvenido a nuestra app! 🎉',
  //     template: './welcome', // si usas plantillas
  //     context: { name },     // variables para la plantilla
  //     text: `Hola ${name}, bienvenido a nuestra plataforma.`,
  //   })
  // }
}
