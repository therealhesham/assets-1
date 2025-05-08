// import { NextRequest, NextResponse } from 'next/server';
// import Airtable from 'airtable';
// import nodemailer from 'nodemailer';
// import puppeteer from 'puppeteer';

// interface SelectOptions {
//   maxRecords: number;
//   filterByFormula?: string;
//   sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
//   fields?: string[];
// }

// const base = new Airtable({ apiKey: 'pathInbmmQ2GimI5Q.6994f95d5d0f915839960010ca25d49fe1d152b2d2be189a4508947684511e91' }).base('appwChimKKH5U0rtH');

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const query = searchParams.get('query');

//     const selectOptions: SelectOptions = {
//       maxRecords: 100,
//       sort: [{ field: 'assetnum', direction: 'asc' }],
//       fields: ['assetnum', 'اسم الاصل', 'الرقم التسلسلي', 'الشركة المصنعة', 'حالة الاصل', 'مواصفات اضافية ', 'مستلم الاصل'],
//     };

//     if (query) {
//       const parsedQuery = parseInt(query, 10);
//       if (!isNaN(parsedQuery)) {
//         selectOptions.filterByFormula = `{assetnum} = ${parsedQuery}`;
//       } else {
//         throw new Error('رقم الأصل يجب أن يكون رقمًا صحيحًا');
//       }
//     }

//     const records = await base('قائمة الاصول')
//       .select(selectOptions)
//       .all();

//     const results = await Promise.all(
//       records.map(async (record) => {
//         let receiverName: string = '';

//         const receiverId = record.fields['مستلم الاصل'];
//         if (receiverId && Array.isArray(receiverId) && receiverId.length > 0) {
//           const linkedRecord = await base('العهد المستلمة').find(receiverId[0]);
//           const rawReceiverName = linkedRecord.fields['اسم الموظف'];
//           receiverName = typeof rawReceiverName === 'string'
//             ? rawReceiverName
//             : rawReceiverName !== undefined && rawReceiverName !== null
//               ? String(rawReceiverName)
//               : '';
//         }

//         return {
//           id: record.id,
//           fields: {
//             assetnum: record.fields.assetnum || 0,
//             'اسم الاصل': record.fields['اسم الاصل'] || 'غير محدد',
//             'الرقم التسلسلي': record.fields['الرقم التسلسلي'] || 'غير محدد',
//             'الشركة المصنعة': record.fields['الشركة المصنعة'] || 'غير محدد',
//             'حالة الاصل': record.fields['حالة الاصل'] || 'غير محدد',
//             'مواصفات اضافية ': record.fields['مواصفات اضافية '] || 'غير محدد',
//             'مستلم الاصل': receiverName,
//           },
//         };
//       })
//     );

//     return new NextResponse(JSON.stringify(results), { status: 200 });
//   } catch (error) {
//     console.error('خطأ في استرجاع الأصول:', error);
//     return new NextResponse(JSON.stringify({ error: 'حدث خطأ أثناء استرجاع الأصول: ' + error.message }), { status: 500 });
//   }
// }

// export async function DELETE(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get('id');

//     if (!id) {
//       return new NextResponse(JSON.stringify({ error: 'يجب توفير معرف الأصل' }), { status: 400 });
//     }

//     await base('قائمة الاصول').destroy([id]);
//     return new NextResponse(JSON.stringify({ message: 'تم حذف الأصل بنجاح' }), { status: 200 });
//   } catch (error) {
//     console.error('خطأ في حذف الأصل:', error);
//     return new NextResponse(JSON.stringify({ error: 'حدث خطأ أثناء الحذف: ' + error.message }), { status: 500 });
//   }
// }

// export async function PUT(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { id, assetnum, assetName, serialNumber, manufacturer, assetCondition, specifications, signature } = body;

//     // التحقق من وجود المعرف ورقم الأصل فقط
//     if (!id || assetnum === undefined) {
//       return new NextResponse(
//         JSON.stringify({ error: 'المعرف ورقم الأصل مطلوبان' }),
//         { status: 400 }
//       );
//     }

//     // تسجيل البيانات المستلمة
//     console.log('البيانات المستلمة لتحديث الأصل:', body);

//     // جلب السجل الحالي للتحقق من الحالة
//     const assetRecords = await base('قائمة الاصول').find(id);
//     const currentFields = assetRecords.fields;
//     const receiverId = currentFields['مستلم الاصل'];

//     let isUsed = false;
//     let receiverEmail = '';
//     let receiverName = '';
//     if (receiverId && Array.isArray(receiverId) && receiverId.length > 0) {
//       const linkedRecord = await base('العهد المستلمة').find(receiverId[0]);
//       const rawReceiverName = linkedRecord.fields['اسم الموظف'];
//       const rawReceiverEmail = linkedRecord.fields['Email'];

//       receiverName = typeof rawReceiverName === 'string'
//         ? rawReceiverName
//         : rawReceiverName !== undefined && rawReceiverName !== null
//           ? String(rawReceiverName)
//           : '';

//       receiverEmail = typeof rawReceiverEmail === 'string'
//         ? rawReceiverEmail
//         : rawReceiverEmail !== undefined && rawReceiverEmail !== null
//           ? String(rawReceiverEmail)
//           : '';

//       if (receiverName && receiverEmail && receiverName !== 'المخزن' && receiverName !== 'جهة الصيانة') {
//         isUsed = true;
//       }
//     }

//     // التحقق من التوقيع للأصول المستخدمة
//     if (isUsed && !signature) {
//       return new NextResponse(
//         JSON.stringify({ error: 'توقيع مستلم الأصل مطلوب لتعديل الأصل المستخدم' }),
//         { status: 400 }
//       );
//     }

//     // إعداد الحقول للتحديث (بدون إضافة التوقيع)
//     const fields: { [key: string]: any } = {
//       assetnum: Number(assetnum), // التأكد من أن assetnum رقم
//     };

//     // إضافة الحقول الأخرى إذا كانت موجودة
//     if (assetName !== undefined) fields['اسم الاصل'] = assetName;
//     if (serialNumber !== undefined) fields['الرقم التسلسلي'] = serialNumber;
//     if (manufacturer !== undefined) fields['الشركة المصنعة'] = manufacturer;
//     if (assetCondition !== undefined) fields['حالة الاصل'] = assetCondition;
//     if (specifications !== undefined) fields['مواصفات اضافية '] = specifications;

//     // تسجيل الحقول التي سيتم تحديثها
//     console.log('الحقول التي سيتم تحديثها في Airtable:', fields);

//     // تحديث السجل في Airtable
//     const updatedRecords = await base('قائمة الاصول').update([
//       {
//         id,
//         fields,
//       },
//     ]);

//     // إرسال بريد إلكتروني إذا كان الأصل مستخدمًا
//     if (isUsed && receiverEmail) {
//       const htmlContent = `
//         <!DOCTYPE html>
//         <html lang="ar">
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>إشعار تعديل أصل</title>
//           <style>
//             body { font-family: Arial, sans-serif; direction: rtl; text-align: right; margin: 0; padding: 20px; font-size: 12px; }
//             h1 { text-align: center; font-size: 24px; margin-bottom: 20px; color: #d32f2f; }
//             .info { margin-bottom: 10px; }
//             table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
//             th, td { border: 1px solid black; padding: 5px; text-align: right; font-size: 10px; }
//             th { background-color: #f2f2f2; }
//             .signature img { width: 100px; height: 50px; }
//           </style>
//         </head>
//         <body>
//           <h1>إشعار تعديل أصل</h1>
//           <div class="info">اسم الموظف: ${receiverName}</div>
//           <div class="info">تاريخ التعديل: ${new Date().toLocaleDateString('ar-EG')}</div>
//           <div class="info">البريد الإلكتروني: ${receiverEmail}</div>
//           <div class="info">تفاصيل الأصل قبل التعديل:</div>
//           <table>
//             <thead>
//               <tr>
//                 <th>اسم الأصل</th>
//                 <th>رقم الأصل</th>
//                 <th>الرقم التسلسلي</th>
//                 <th>الشركة المصنعة</th>
//                 <th>حالة الأصل</th>
//                 <th>المواصفات الإضافية</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>${currentFields['اسم الاصل'] || 'غير متوفر'}</td>
//                 <td>${currentFields.assetnum || 'غير متوفر'}</td>
//                 <td>${currentFields['الرقم التسلسلي'] || 'غير متوفر'}</td>
//                 <td>${currentFields['الشركة المصنعة'] || 'غير متوفر'}</td>
//                 <td>${currentFields['حالة الاصل'] || 'غير متوفر'}</td>
//                 <td>${currentFields['مواصفات اضافية '] || 'غير متوفر'}</td>
//               </tr>
//             </tbody>
//           </table>
//           <div class="info">تفاصيل الأصل بعد التعديل:</div>
//           <table>
//             <thead>
//               <tr>
//                 <th>اسم الأصل</th>
//                 <th>رقم الأصل</th>
//                 <th>الرقم التسلسلي</th>
//                 <th>الشركة المصنعة</th>
//                 <th>حالة الأصل</th>
//                 <th>المواصفات الإضافية</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>${assetName || 'غير متوفر'}</td>
//                 <td>${assetnum}</td>
//                 <td>${serialNumber || 'غير متوفر'}</td>
//                 <td>${manufacturer || 'غير متوفر'}</td>
//                 <td>${assetCondition || 'غير متوفر'}</td>
//                 <td>${specifications || 'غير متوفر'}</td>
//               </tr>
//             </tbody>
//           </table>
//           <div class="signature">
//             <div>توقيع الموظف:</div>
//             <img src="${signature || ''}" alt="Signature" />
//           </div>
//         </body>
//         </html>
//       `;

//       const browser = await puppeteer.launch({
//         headless: true,
//         args: ['--no-sandbox', '--disable-setuid-sandbox'],
//       });
//       const page = await browser.newPage();
//       await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
//       const pdfBuffer = await page.pdf({
//         format: 'A4',
//         printBackground: true,
//         margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
//       });
//       await browser.close();

//       const transporter = nodemailer.createTransport({
//         host: 'mail.rawaes.com',
//         port: 465,
//         secure: true,
//         auth: {
//           user: 'hrdoc@rawaes.com',
//           pass: process.env.EMAIL_PASSWORD || 'a-f09JRnpZOk',
//         },
//         debug: true,
//         logger: true,
//       });

//       await new Promise((resolve, reject) => {
//         transporter.verify((error, success) => {
//           if (error) {
//             console.error('SMTP verification failed:', error);
//             reject(error);
//           } else {
//             console.log('SMTP connection verified successfully:', success);
//             resolve(success);
//           }
//         });
//       });

//       const mailOptions = {
//         from: 'hrdoc@rawaes.com',
//         to: `${receiverEmail}, hrdoc@rawaes.com`,
//         subject: 'إشعار تعديل أصل',
//         text: 'مرحبًا،\n\nتم تعديل أصل في العهدة الخاصة بك. مرفق مع هذا البريد تفاصيل التعديل.\n\nشكرًا!',
//         attachments: [
//           {
//             filename: 'asset_modification_notification.pdf',
//             content: pdfBuffer,
//             contentType: 'application/pdf',
//           },
//         ],
//       };

//       const info = await transporter.sendMail(mailOptions);
//       console.log('Email sent successfully:', info.messageId);
//     }

//     // تسجيل السجل المحدث
//     console.log('السجل المحدث في Airtable:', updatedRecords[0].fields);

//     return new NextResponse(
//       JSON.stringify({ message: 'تم تعديل الأصل بنجاح', id: updatedRecords[0].getId() }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('خطأ في تعديل الأصل:', error);
//     return new NextResponse(
//       JSON.stringify({ error: 'فشل في تعديل الأصل: ' + error.message }),
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import AWS from 'aws-sdk';

// إعداد Airtable
const base = new Airtable({ apiKey: 'pathInbmmQ2GimI5Q.6994f95d5d0f915839960010ca25d49fe1d152b2d2be189a4508947684511e91' }).base('appwChimKKH5U0rtH');

// إعداد DigitalOcean Spaces
const spacesEndpoint = new AWS.Endpoint('https://sgp1.digitaloceanspaces.com');
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: 'DO801T82UVGHTCP7ET2A',
  secretAccessKey: '9onR3UUdlwij+AmG8ogloMO4Hp7+oN6HIVRWjRtkNgM',
});

// دالة لرفع الصورة إلى DigitalOcean Spaces
async function uploadImageToSpaces(base64: string): Promise<string> {
  try {
    const base64Data = base64.split(',')[1]; // إزالة "data:image/png;base64,"
    const buffer = Buffer.from(base64Data, 'base64');
    const fileName = `signatures/signature-${Date.now()}.png`; // اسم الملف مع طابع زمني

    const params = {
      Bucket: 'assetspics', // اسم الباسكت
      Key: fileName,
      Body: buffer,
      ContentType: 'image/png',
      ACL: 'public-read', // جعل الصورة متاحة للعامة
    };

    console.log('Uploading image to DigitalOcean Spaces...');
    const { Location } = await s3.upload(params).promise();
    console.log('Image uploaded successfully:', Location);
    return Location; // رابط الصورة
  } catch (error) {
    console.error('Error uploading image to DigitalOcean Spaces:', error);
    throw new Error('فشل في رفع الصورة إلى DigitalOcean Spaces');
  }
}

interface SelectOptions {
  maxRecords: number;
  filterByFormula?: string;
  sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
  fields?: string[];
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    const selectOptions: SelectOptions = {
      maxRecords: 100,
      sort: [{ field: 'assetnum', direction: 'asc' }],
      fields: ['assetnum', 'اسم الاصل', 'الرقم التسلسلي', 'الشركة المصنعة', 'حالة الاصل', 'مواصفات اضافية ', 'مستلم الاصل'],
    };

    if (query) {
      const parsedQuery = parseInt(query, 10);
      if (!isNaN(parsedQuery)) {
        selectOptions.filterByFormula = `{assetnum} = ${parsedQuery}`;
      } else {
        throw new Error('رقم الأصل يجب أن يكون رقمًا صحيحًا');
      }
    }

    const records = await base('قائمة الاصول')
      .select(selectOptions)
      .all();

    const results = await Promise.all(
      records.map(async (record) => {
        let receiverName: string = '';

        const receiverId = record.fields['مستلم الاصل'];
        if (receiverId && Array.isArray(receiverId) && receiverId.length > 0) {
          const linkedRecord = await base('العهد المستلمة').find(receiverId[0]);
          const rawReceiverName = linkedRecord.fields['اسم الموظف'];
          receiverName = typeof rawReceiverName === 'string'
            ? rawReceiverName
            : rawReceiverName !== undefined && rawReceiverName !== null
              ? String(rawReceiverName)
              : '';
        }

        return {
          id: record.id,
          fields: {
            assetnum: record.fields.assetnum || 0,
            'اسم الاصل': record.fields['اسم الاصل'] || 'غير محدد',
            'الرقم التسلسلي': record.fields['الرقم التسلسلي'] || 'غير محدد',
            'الشركة المصنعة': record.fields['الشركة المصنعة'] || 'غير محدد',
            'حالة الاصل': record.fields['حالة الاصل'] || 'غير محدد',
            'مواصفات اضافية ': record.fields['مواصفات اضافية '] || 'غير محدد',
            'مستلم الاصل': receiverName,
          },
        };
      })
    );

    return new NextResponse(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error('خطأ في استرجاع الأصول:', error);
    return new NextResponse(JSON.stringify({ error: 'حدث خطأ أثناء استرجاع الأصول: ' + error.message }), { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse(JSON.stringify({ error: 'يجب توفير معرف الأصل' }), { status: 400 });
    }

    await base('قائمة الاصول').destroy([id]);
    return new NextResponse(JSON.stringify({ message: 'تم حذف الأصل بنجاح' }), { status: 200 });
  } catch (error) {
    console.error('خطأ في حذف الأصل:', error);
    return new NextResponse(JSON.stringify({ error: 'حدث خطأ أثناء الحذف: ' + error.message }), { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, assetnum, assetName, serialNumber, manufacturer, assetCondition, specifications, signature } = body;

    // التحقق من وجود المعرف ورقم الأصل فقط
    if (!id || assetnum === undefined) {
      return new NextResponse(
        JSON.stringify({ error: 'المعرف ورقم الأصل مطلوبان' }),
        { status: 400 }
      );
    }

    // تسجيل البيانات المستلمة
    console.log('البيانات المستلمة لتحديث الأصل:', body);

    // جلب السجل الحالي للتحقق من الحالة
    const assetRecords = await base('قائمة الاصول').find(id);
    const currentFields = assetRecords.fields;
    const receiverId = currentFields['مستلم الاصل'];

    let isUsed = false;
    let receiverEmail = '';
    let receiverName = '';
    if (receiverId && Array.isArray(receiverId) && receiverId.length > 0) {
      const linkedRecord = await base('العهد المستلمة').find(receiverId[0]);
      const rawReceiverName = linkedRecord.fields['اسم الموظف'];
      const rawReceiverEmail = linkedRecord.fields['Email'];

      receiverName = typeof rawReceiverName === 'string'
        ? rawReceiverName
        : rawReceiverName !== undefined && rawReceiverName !== null
          ? String(rawReceiverName)
          : '';

      receiverEmail = typeof rawReceiverEmail === 'string'
        ? rawReceiverEmail
        : rawReceiverEmail !== undefined && rawReceiverEmail !== null
          ? String(rawReceiverEmail)
          : '';

      if (receiverName && receiverEmail && receiverName !== 'المخزن' && receiverName !== 'جهة الصيانة') {
        isUsed = true;
      }
    }

    // التحقق من التوقيع للأصول المستخدمة
    if (isUsed && !signature) {
      return new NextResponse(
        JSON.stringify({ error: 'توقيع مستلم الأصل مطلوب لتعديل الأصل المستخدم' }),
        { status: 400 }
      );
    }

    // إعداد الحقول للتحديث (بدون إضافة التوقيع)
    const fields: { [key: string]: any } = {
      assetnum: Number(assetnum), // التأكد من أن assetnum رقم
    };

    // إضافة الحقول الأخرى إذا كانت موجودة
    if (assetName !== undefined) fields['اسم الاصل'] = assetName;
    if (serialNumber !== undefined) fields['الرقم التسلسلي'] = serialNumber;
    if (manufacturer !== undefined) fields['الشركة المصنعة'] = manufacturer;
    if (assetCondition !== undefined) fields['حالة الاصل'] = assetCondition;
    if (specifications !== undefined) fields['مواصفات اضافية '] = specifications;

    // تسجيل الحقول التي سيتم تحديثها
    console.log('الحقول التي سيتم تحديثها في Airtable:', fields);

    // تحديث السجل في Airtable
    const updatedRecords = await base('قائمة الاصول').update([
      {
        id,
        fields,
      },
    ]);

    // إرسال بريد إلكتروني إذا كان الأصل مستخدمًا
    if (isUsed && receiverEmail) {
      let signatureUrl = signature;
      if (signature && signature.startsWith('data:image/')) {
        signatureUrl = await uploadImageToSpaces(signature); // رفع التوقيع إلى DigitalOcean Spaces
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>إشعار تعديل أصل</title>
          <style>
            body { font-family: Arial, sans-serif; direction: rtl; text-align: right; margin: 0; padding: 20px; font-size: 12px; }
            h1 { text-align: center; font-size: 24px; margin-bottom: 20px; color: #d32f2f; }
            .info { margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid black; padding: 5px; text-align: right; font-size: 10px; }
            th { background-color: #f2f2f2; }
            .signature img { width: 100px; height: 50px; }
          </style>
        </head>
        <body>
          <h1>إشعار تعديل أصل</h1>
          <div class="info">اسم الموظف: ${receiverName}</div>
          <div class="info">تاريخ التعديل: ${new Date().toLocaleDateString('ar-EG')}</div>
          <div class="info">البريد الإلكتروني: ${receiverEmail}</div>
          <div class="info">تفاصيل الأصل قبل التعديل:</div>
          <table>
            <thead>
              <tr>
                <th>اسم الأصل</th>
                <th>رقم الأصل</th>
                <th>الرقم التسلسلي</th>
                <th>الشركة المصنعة</th>
                <th>حالة الأصل</th>
                <th>المواصفات الإضافية</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${currentFields['اسم الاصل'] || 'غير متوفر'}</td>
                <td>${currentFields.assetnum || 'غير متوفر'}</td>
                <td>${currentFields['الرقم التسلسلي'] || 'غير متوفر'}</td>
                <td>${currentFields['الشركة المصنعة'] || 'غير متوفر'}</td>
                <td>${currentFields['حالة الاصل'] || 'غير متوفر'}</td>
                <td>${currentFields['مواصفات اضافية '] || 'غير متوفر'}</td>
              </tr>
            </tbody>
          </table>
          <div class="info">تفاصيل الأصل بعد التعديل:</div>
          <table>
            <thead>
              <tr>
                <th>اسم الأصل</th>
                <th>رقم الأصل</th>
                <th>الرقم التسلسلي</th>
                <th>الشركة المصنعة</th>
                <th>حالة الأصل</th>
                <th>المواصفات الإضافية</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${assetName || 'غير متوفر'}</td>
                <td>${assetnum}</td>
                <td>${serialNumber || 'غير متوفر'}</td>
                <td>${manufacturer || 'غير متوفر'}</td>
                <td>${assetCondition || 'غير متوفر'}</td>
                <td>${specifications || 'غير متوفر'}</td>
              </tr>
            </tbody>
          </table>
          <div class="signature">
            <div>توقيع الموظف:</div>
            <img src="${signatureUrl || ''}" alt="Signature" />
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
          user: 'hrdoc@rawaes.com',
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
        from: 'hrdoc@rawaes.com',
        to: `${receiverEmail}, hrdoc@rawaes.com`,
        subject: 'إشعار تعديل أصل',
        text: 'مرحبًا،\n\nتم تعديل أصل في العهدة الخاصة بك. مرفق مع هذا البريد تفاصيل التعديل.\n\nشكرًا!',
        attachments: [
          {
            filename: 'asset_modification_notification.pdf',
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
    }

    // تسجيل السجل المحدث
    console.log('السجل المحدث في Airtable:', updatedRecords[0].fields);

    return new NextResponse(
      JSON.stringify({ message: 'تم تعديل الأصل بنجاح', id: updatedRecords[0].getId() }),
      { status: 200 }
    );
  } catch (error) {
    console.error('خطأ في تعديل الأصل:', error);
    return new NextResponse(
      JSON.stringify({ error: 'فشل في تعديل الأصل: ' + error.message }),
      { status: 500 }
    );
  }
}