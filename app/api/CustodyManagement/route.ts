

import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import path from 'path';
import { promises as fs } from 'fs';

// إعداد Airtable
const base = new Airtable({ apiKey: 'pathInbmmQ2GimI5Q.6994f95d5d0f915839960010ca25d49fe1d152b2d2be189a4508947684511e91' }).base('appwChimKKH5U0rtH');

export async function GET() {
  try {
    console.log('Fetching records from Airtable table "العهد المستلمة"...');
    const records = await base('العهد المستلمة')
      .select({ view: 'Grid view' })
      .all();
    console.log('Records fetched successfully:', records.length);
    return NextResponse.json(records.map((record) => ({ id: record.id, fields: record.fields })));
  } catch (error) {
    console.error('Error fetching custodies from Airtable:', error);
    return NextResponse.json(
      { error: 'فشل في استرجاع العهد: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { assetIds } = await request.json();

    if (!Array.isArray(assetIds) || assetIds.length === 0) {
      return NextResponse.json({ assets: [] }, { status: 200 });
    }

    const assetRecords = await base('قائمة الاصول')
      .select({
        filterByFormula: `OR(${assetIds.map((id: string) => `RECORD_ID()="${id}"`).join(',')})`,
      })
      .all();

    const assets = assetRecords.map((record) => ({
      id: record.id,
      fields: record.fields,
    }));

    return NextResponse.json(assets, { status: 200 });
  } catch (error) {
    console.error('Error fetching assets from Airtable:', error);
    return NextResponse.json(
      { error: 'فشل في جلب تفاصيل الاصول: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const employeeName = formData.get('employeeName') as string;
    const receiptDate = formData.get('receiptDate') as string;
    const recordsString = formData.get('records') as string;
    const signature = formData.get('signature') as string;

    console.log('FormData received:', { id, employeeName, receiptDate, recordsString, signature });

    if (!id) {
      return NextResponse.json({ error: 'معرف العهدة مطلوب' }, { status: 400 });
    }

    const record = await base('العهد المستلمة').find(id);
    if (!record) {
      return NextResponse.json({ error: 'لم يتم العثور على العهدة' }, { status: 404 });
    }

    const email = record.fields['Email'] as string | undefined;
    if (!email) {
      return NextResponse.json({ error: 'البريد الإلكتروني غير متوفر في سجل العهدة' }, { status: 400 });
    }

    if (!employeeName || !receiptDate || !recordsString || !signature) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
    }

    let assetIds: string[];
    try {
      assetIds = JSON.parse(recordsString);
    } catch (parseError) {
      console.error('Failed to parse records:', parseError);
      return NextResponse.json({ error: 'فشل في تحليل بيانات الاصول' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'صيغة البريد الإلكتروني في السجل غير صحيحة' }, { status: 400 });
    }

    let assets: any[] = [];
    if (assetIds.length > 0) {
      const assetRecords = await base('قائمة الاصول')
        .select({
          filterByFormula: `OR(${assetIds.map((id: string) => `RECORD_ID()="${id}"`).join(',')})`,
        })
        .all();
      assets = assetRecords.map((record) => ({
        id: record.id,
        fields: record.fields,
      }));
    }

    const cleanedRecords = assets.map((asset) => {
      const fields = asset.fields || {};
      const requiredFields = ['اسم الاصل', 'assetnum', 'الرقم التسلسلي', 'الشركة المصنعة', 'مواصفات اضافية '];
      const cleanedFields: { [key: string]: string } = {};
      requiredFields.forEach((field) => {
        const value = fields[field];
        cleanedFields[field] = value === undefined || value === null || Number.isNaN(value) ? 'غير متوفر' : String(value);
      });
      return { fields: cleanedFields };
    });

    // تحويل الشعار إلى Base64
    let logoBase64 = '';
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    try {
      const logoBuffer = await fs.readFile(logoPath);
      logoBase64 = logoBuffer.toString('base64');
    } catch (error) {
      console.error('Error reading logo file:', error);
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>نموذج إخلاء عهدة</title>
        <style>
          body { font-family: Arial, sans-serif; direction: rtl; text-align: right; margin: 0; padding: 20px; font-size: 12px; position: relative; }
          .header { position: relative; width: 100%; height: 60px; margin-bottom: 10px; }
          .logo { position: absolute; top: 0; right: 0; width: 100px; height: auto; max-height: 50px; }
          h1 { text-align: center; font-size: 24px; margin-top: 60px; margin-bottom: 20px; color: #d32f2f; }
          .info { margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid black; padding: 5px; text-align: right; font-size: 10px; }
          th { background-color: #f2f2f2; }
          .signature { margin-top: 20px; }
          .signature img { width: 100px; height: 50px; }
          pre { margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 10px; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <div class="header">
          ${logoBase64 ? `<img src="data:image/png;base64,${logoBase64}" alt="Logo" class="logo" />` : '<div>الشعار غير متوفر</div>'}
        </div>
        <h1>نموذج إخلاء عهدة</h1>
        <div class="info">اسم الموظف: ${employeeName}</div>
        <div class="info">تاريخ الاستلام: ${receiptDate}</div>
        <div class="info">تاريخ الإخلاء: ${new Date().toLocaleDateString('ar-EG')}</div>
        <div class="info">البريد الإلكتروني: ${email}</div>
        <div class="info">الاصول المرتبطة:</div>
        ${
          cleanedRecords.length > 0
            ? `
              <table>
                <thead>
                  <tr>
                    <th>اسم الاصل</th>
                    <th>رقم الاصل</th>
                    <th>الرقم التسلسلي</th>
                    <th>الشركة المصنعة</th>
                    <th>مواصفات اضافية </th>
                  </tr>
                </thead>
                <tbody>
                  ${cleanedRecords
                    .map(
                      (record: any) => `
                        <tr>
                          <td>${record.fields['اسم الاصل']}</td>
                          <td>${record.fields['assetnum']}</td>
                          <td>${record.fields['الرقم التسلسلي']}</td>
                          <td>${record.fields['الشركة المصنعة']}</td>
                          <td><pre>${record.fields['مواصفات اضافية ']}</pre></td>
                        </tr>
                      `
                    )
                    .join('')}
                </tbody>
              </table>
            `
            : '<div>لا توجد اصول مرتبطة</div>'
        }
        <div class="signature">
          <div>توقيع الموظف:</div>
          <img src="${signature}" alt="Signature" />
        </div>
      </body>
      </html>
    `;

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

    const transporter = nodemailer.createTransport({
      host: 'mail.rawaes.com',
      port: 465,
      secure: true,
      auth: {
        user: 'HrDoc@rawaes.com',
        pass: process.env.EMAIL_PASSWORD || 'a-f09JRnpZOk',
      },
      debug: true,
      logger: true,
    });

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

    const mailOptions = {
      from: 'HrDoc@rawaes.com',
      to: `${email}, hrdoc@rawaes.com`,
      subject: 'نموذج إخلاء عهدة',
      text: 'مرحبًا،\n\nمرفق مع هذا البريد نموذج إخلاء العهدة.\n\nشكرًا!',
      attachments: [
        {
          filename: 'custody_clearance.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    await base('العهد المستلمة').destroy(id);

    return NextResponse.json({ message: 'تم إخلاء العهدة وإرسال النموذج بنجاح' }, { status: 200 });
  } catch (error) {
    console.error('Error clearing custody:', error);
    return NextResponse.json(
      { error: 'فشل في إخلاء العهدة: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      const { id, fields } = await request.json();

      if (!id) {
        return NextResponse.json({ error: 'معرف العهدة مطلوب' }, { status: 400 });
      }

      const updatedRecord = await base('العهد المستلمة').update(id, fields);
      return NextResponse.json(updatedRecord, { status: 200 });
    } else if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      const id = formData.get('id') as string;
      const employeeName = formData.get('employeeName') as string;
      const receiptDate = formData.get('receiptDate') as string;
      const recordsString = formData.get('records') as string;
      const removedAssetId = formData.get('removedAssetId') as string;

      console.log('FormData received for asset removal:', { id, employeeName, receiptDate, recordsString, removedAssetId });

      if (!id || !recordsString || !removedAssetId) {
        return NextResponse.json({ error: 'جميع الحقول مطلوبة (معرف العهدة، السجلات، معرف الأصل المحذوف)' }, { status: 400 });
      }

      const record = await base('العهد المستلمة').find(id);
      if (!record) {
        return NextResponse.json({ error: 'لم يتم العثور على العهدة' }, { status: 404 });
      }

      const email = record.fields['Email'] as string | undefined;
      if (!email) {
        return NextResponse.json({ error: 'البريد الإلكتروني غير متوفر في سجل العهدة' }, { status: 400 });
      }

      let updatedAssetIds: string[];
      try {
        updatedAssetIds = JSON.parse(recordsString);
      } catch (parseError) {
        console.error('Failed to parse records:', parseError);
        return NextResponse.json({ error: 'فشل في تحليل بيانات الأصول' }, { status: 400 });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: 'صيغة البريد الإلكتروني في السجل غير صحيحة' }, { status: 400 });
      }

      const assetRecord = await base('قائمة الاصول').find(removedAssetId);
      if (!assetRecord) {
        return NextResponse.json({ error: 'لم يتم العثور على الأصل المحذوف' }, { status: 404 });
      }

      const removedAsset = {
        id: assetRecord.id,
        fields: assetRecord.fields,
      };

      const cleanedAssetFields = {
        'اسم الاصل': String(removedAsset.fields['اسم الاصل'] || 'غير متوفر'),
        'assetnum': String(removedAsset.fields['assetnum'] || 'غير متوفر'),
        'الرقم التسلسلي': String(removedAsset.fields['الرقم التسلسلي'] || 'غير متوفر'),
        'الشركة المصنعة': String(removedAsset.fields['الشركة المصنعة'] || 'غير متوفر'),
        'مواصفات اضافية ': String(removedAsset.fields['مواصفات اضافية '] || 'غير متوفر'),
      };

      const updatedRecord = await base('العهد المستلمة').update(id, {
        'رقم الاصل': updatedAssetIds,
      });

      // تحويل الشعار إلى Base64
      let logoBase64 = '';
      const logoPath = path.join(process.cwd(), 'public', 'logo.png');
      try {
        const logoBuffer = await fs.readFile(logoPath);
        logoBase64 = logoBuffer.toString('base64');
      } catch (error) {
        console.error('Error reading logo file:', error);
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>إشعار حذف أصل من العهدة</title>
          <style>
            body { font-family: Arial, sans-serif; direction: rtl; text-align: right; margin: 0; padding: 20px; font-size: 12px; position: relative; }
            .header { position: relative; width: 100%; height: 60px; margin-bottom: 10px; }
            .logo { position: absolute; top: 0; right: 0; width: 100px; height: auto; max-height: 50px; }
            h1 { text-align: center; font-size: 24px; margin-top: 60px; margin-bottom: 20px; color: #d32f2f; }
            .info { margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid black; padding: 5px; text-align: right; font-size: 10px; }
            th { background-color: #f2f2f2; }
            pre { margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 10px; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <div class="header">
            ${logoBase64 ? `<img src="data:image/png;base64,${logoBase64}" alt="Logo" class="logo" />` : '<div>الشعار غير متوفر</div>'}
          </div>
          <h1>إشعار حذف أصل من العهدة</h1>
          <div class="info">اسم الموظف: ${employeeName}</div>
          <div class="info">تاريخ الاستلام: ${receiptDate}</div>
          <div class="info">تاريخ الحذف: ${new Date().toLocaleDateString('ar-EG')}</div>
          <div class="info">البريد الإلكتروني: ${email}</div>
          <div class="info">الأصل المحذوف:</div>
          <table>
            <thead>
              <tr>
                <th>اسم الاصل</th>
                <th>رقم الاصل</th>
                <th>الرقم التسلسلي</th>
                <th>الشركة المصنعة</th>
                <th>مواصفات اضافية </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${cleanedAssetFields['اسم الاصل']}</td>
                <td>${cleanedAssetFields['assetnum']}</td>
                <td>${cleanedAssetFields['الرقم التسلسلي']}</td>
                <td>${cleanedAssetFields['الشركة المصنعة']}</td>
                <td><pre>${cleanedAssetFields['مواصفات اضافية ']}</pre></td>
              </tr>
            </tbody>
          </table>
        </body>
        </html>
      `;

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

      const transporter = nodemailer.createTransport({
        host: 'mail.rawaes.com',
        port: 465,
        secure: true,
        auth: {
          user: 'HrDoc@rawaes.com',
          pass: process.env.EMAIL_PASSWORD || 'HrDocomar3',
        },
        debug: true,
        logger: true,
      });

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

      const mailOptions = {
        from: 'HrDoc@rawaes.com',
        to: email,
        subject: 'إشعار حذف أصل من العهدة',
        text: 'مرحبًا،\n\nتم حذف أصل من العهدة الخاصة بك. مرفق مع هذا البريد تفاصيل الأصل المحذوف.\n\nشكرًا!',
        attachments: [
          {
            filename: 'asset_removal_notification.pdf',
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);

      return NextResponse.json({ message: 'تم حذف الأصل وإرسال الإشعار بنجاح', record: updatedRecord }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'نوع المحتوى غير مدعوم' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in PATCH request:', error);
    return NextResponse.json(
      { error: 'فشل في معالجة الطلب: ' + (error as Error).message },
      { status: 500 }
    );
  }
}