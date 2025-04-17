import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(request: Request) {
  try {
    console.log('Received POST request to /api/SEND-MAIL');
    const formData = await request.formData();
    const employeeName = formData.get('employeeName') as string;
    const receiptDate = formData.get('receiptDate') as string;
    const records = JSON.parse(formData.get('records') as string);
    const email = formData.get('email') as string;
    const signature = formData.get('signature');

    // إضافة سجلات للتحقق من القيم
    console.log('Form data:', {
      employeeName,
      receiptDate,
      records,
      email,
      signature: signature ? 'Signature present' : 'No signature',
    });

    // التحقق من أن القيم هي سلاسل نصية
    if (typeof employeeName !== 'string' || employeeName === '') {
      console.error('Invalid employeeName:', employeeName);
      return NextResponse.json({ error: 'Invalid employeeName' }, { status: 400 });
    }
    if (typeof receiptDate !== 'string' || receiptDate === '') {
      console.error('Invalid receiptDate:', receiptDate);
      return NextResponse.json({ error: 'Invalid receiptDate' }, { status: 400 });
    }
    if (!Array.isArray(records)) {
      console.error('Records is not an array:', records);
      return NextResponse.json({ error: 'Records must be an array' }, { status: 400 });
    }
    if (typeof email !== 'string' || email === '') {
      console.error('Invalid email:', email);
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Invalid email format:', email);
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // التحقق من أسماء الحقول في السجل الأول
    if (records.length > 0) {
      const firstRecordFields = records[0].fields || {};
      console.log('Fields in the first record:', Object.keys(firstRecordFields));
      console.log('Value of "مواصفات اضافية " in the first record:', firstRecordFields['مواصفات اضافية ']);
    }

    // التحقق من الحقول في records وتنظيف القيم
    const cleanedRecords = records.map((record, index) => {
      const fields = record.fields || {};
      const requiredFields = ['اسم الاصل', 'assetnum', 'الرقم التسلسلي', 'الشركة المصنعة', 'مواصفات اضافية '];
      const cleanedFields: { [key: string]: string } = {};
      requiredFields.forEach(field => {
        const value = fields[field];
        cleanedFields[field] = value === undefined || value === null || Number.isNaN(value) ? 'غير متوفر' : String(value);
      });
      console.log(`Record ${index} fields (after cleaning):`, cleanedFields);
      return { fields: cleanedFields };
    });

    // تحويل الشعار إلى Base64 لتضمينه مباشرة في الـ HTML
    let logoBase64 = '';
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    try {
      const logoBuffer = await fs.readFile(logoPath);
      logoBase64 = logoBuffer.toString('base64');
    } catch (error) {
      console.error('Error reading logo file:', error);
    }

    // إنشاء صفحة HTML
    const signatureDataUrl = signature ? Buffer.from(await (signature as Blob).arrayBuffer()).toString('base64') : null;
    const htmlContent = `
  <!DOCTYPE html>
  <html lang="ar">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نموذج استلام عهدة</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        direction: rtl;
        text-align: right;
        margin: 0;
        padding: 20px;
        font-size: 12px;
        position: relative;
      }
      .header {
        position: relative;
        width: 100%;
        height: 60px;
        margin-bottom: 10px;
      }
      .logo {
        position: absolute;
        top: 0;
        right: 0;
        width: 100px;
        height: auto;
        max-height: 50px;
      }
      h1 {
        text-align: center;
        font-size: 24px;
        margin-top: 60px;
        margin-bottom: 15px;
      }
      .info {
        margin-bottom: 8px;
        font-size: 14px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
        table-layout: fixed;
      }
      th, td {
        border: 1px solid black;
        padding: 5px;
        text-align: right;
        font-size: 10px;
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
      }
      th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      td {
        vertical-align: top;
      }
      th:nth-child(1), td:nth-child(1) { width: 20%; }
      th:nth-child(2), td:nth-child(2) { width: 20%; }
      th:nth-child(3), td:nth-child(3) { width: 20%; }
      th:nth-child(4), td:nth-child(4) { width: 20%; }
      th:nth-child(5), td:nth-child(5) { width: 20%; }
      .signature {
        margin-top: 20px;
      }
      .signature img {
        width: 100px;
        height: 50px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      ${logoBase64 ? `<img src="data:image/png;base64,${logoBase64}" alt="Logo" class="logo" />` : '<div>الشعار غير متوفر</div>'}
    </div>
    <h1>نموذج استلام عهدة</h1>
    <div class="info">اسم الموظف: ${employeeName}</div>
    <div class="info">تاريخ الاستلام: ${receiptDate}</div>
    <div class="info">البريد الإلكتروني: ${email}</div>
    <div class="info">الأصول المستلمة:</div>
    ${
      cleanedRecords.length > 0
        ? `
          <table>
            <thead>
              <tr>
                <th>اسم الأصل</th>
                <th>رقم الأصل</th>
                <th>الرقم التسلسلي</th>
                <th>الشركة المصنعة</th>
                <th>مواصفات اضافية</th>
              </tr>
            </thead>
            <tbody>
              ${cleanedRecords
                .map(
                  record => `
                    <tr>
                      <td>${record.fields['اسم الاصل']}</td>
                      <td>${record.fields['assetnum']}</td>
                      <td>${record.fields['الرقم التسلسلي']}</td>
                      <td>${record.fields['الشركة المصنعة']}</td>
                      <td><pre style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 10px; ">${record.fields['مواصفات اضافية '] || 'غير متوفر'}</pre></td>
                    </tr>
                  `
                )
                .join('')}
            </tbody>
          </table>
        `
        : '<div>لا توجد أصول مختارة</div>'
    }
    <div class="signature">
      <div>التوقيع:</div>
      ${
        signatureDataUrl
          ? `<img src="data:image/png;base64,${signatureDataUrl}" alt="Signature" />`
          : '<div>لم يتم إضافة توقيع</div>'
      }
    </div>
  </body>
  </html>
`;
    // إنشاء ملف PDF باستخدام puppeteer
    console.log('Generating PDF with Puppeteer...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
    });
    await browser.close();

    // إعداد Nodemailer باستخدام SMTP لدومين rawaes.com
    console.log('Setting up Nodemailer transporter...');
    const transporter = nodemailer.createTransport({
      host: 'mail.rawaes.com',
      port: 465,
      secure: true,
      auth: {
        user: 'hrdoc@rawaes.com',
        pass: 'a-f09JRnpZOk', // تأكد من أن كلمة المرور صحيحة
      },
      debug: true,
      logger: true,
    });

    // اختبار الاتصال بخادم البريد قبل الإرسال
    console.log('Verifying SMTP connection...');
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error('SMTP verification failed:', error);
          reject(error);
        } else {
          console.log('SMTP connection verified successfully:', success);
          resolve(success);
        }
      });
    });

    // إعداد البريد الإلكتروني
    const mailOptions = {
      from: 'hrdoc@rawaes.com',
      to: `${email}, hrdoc@rawaes.com`,// استخدام البريد الإلكتروني المدخل من المستخدم
      subject: 'نموذج استلام عهدة',
      text: 'مرحبًا،\n\nمرفق مع هذا البريد نموذج استلام العهدة.\n\nشكرًا!',
      attachments: [
        {
          filename: 'asset_receipt.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    // إرسال البريد الإلكتروني
    console.log('Sending email to:', email);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return NextResponse.json({ message: 'PDF generated and email sent successfully', messageId: info.messageId }, { status: 200 });
  } catch (error) {
    console.error('Error generating PDF or sending email:', error);
    console.error('Error message:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
    return NextResponse.json({ error: 'Failed to generate PDF or send email: ' + (error as Error).message }, { status: 500 });
  }
}

