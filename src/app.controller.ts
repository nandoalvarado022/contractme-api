import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { sendEmail } from './utils/brevo';
import { MailService } from './common/emails/mail.service';
import { MailerService } from '@nestjs-modules/mailer';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailService: MailService,
    // private readonly mailerService: MailerService,
  ) { }

  @Get()
  async getHello() {
    // return await this.mailService.sendWelcomeEmail('contractme395@gmail.com', 'Test User');
    // await this.mailerService.sendMail({
    //   to: 'nandoalvarado022@gmail.com',
    //   subject: '¡Bienvenido a nuestra app! 🎉',
    //   text: `Hola Test User, bienvenido a nuestra plataforma.`,
    //   context: { name: 'Test User' },
    // });
    return this.appService.getHello();
  }

  @Get('send-brevo')
  async sendBrevo() {
    await this.mailService.SendWelcomeEmailBrevo('nandoalvarado022@gmail.com', 'Test User', 'password_remember');
    return { message: 'Correo enviado con Brevo y template.' };
  }

  @Get('logs')
  getLogs() {
    return this.appService.getLogs();
  }

  @Post('send-email')
  sendEmail(@Body() emailData: any) {
    return sendEmail(emailData);
  }
}
