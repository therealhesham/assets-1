// import { NextRequest, NextResponse } from 'next/server';
// import Airtable from 'airtable';
// import axios from 'axios';

// // إعداد Airtable
// const base = new Airtable({ apiKey: 'pathInbmmQ2GimI5Q.6994f95d5d0f915839960010ca25d49fe1d152b2d2be189a4508947684511e91' }).base('appwChimKKH5U0rtH');

// // دالة لرفع الصورة إلى imgBB
// async function uploadImageToImgBB(base64) {
//   try {
//     const base64Data = base64.split(',')[1]; // إزالة "data:image/png;base64," من السلسلة
//     const formData = new FormData();
//     formData.append('image', base64Data);

//     console.log('Uploading image to imgBB...');
//     const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
//       params: {
//         key: '960012ec48fff9b7d8bf3fe19f460320', // استخدام مفتاح API مباشرة
//       },
//     });

//     console.log('imgBB response:', response.data);
//     return response.data.data.url; // إرجاع رابط الصورة
//   } catch (error) {
//     console.error('Error uploading image to imgBB:', error.response ? error.response.data : error.message);
//     throw new Error('فشل في رفع الصورة إلى imgBB');
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     if (!req) {
//       return new Response(JSON.stringify({ message: 'Hello, world!' }), { status: 200 });
//     }

//     const { searchParams } = new URL(req.url);
//     const query = searchParams.get('query');
//     const type = searchParams.get('type');

//     if (type === 'received') {
//       const employeeName = searchParams.get('employeeName');
//       const records = await base('العهد المستلمة')
//         .select({
//           filterByFormula: employeeName ? `{اسم الموظف} = "${employeeName}"` : '',
//           maxRecords: 10,
//         })
//         .all();

//       if (records.length === 0) {
//         return new NextResponse(JSON.stringify({ message: 'لم يتم العثور على سجلات للعهد المستلمة' }), { status: 404 });
//       }

//       const results = records.map((record) => ({
//         id: record.id,
//         fields: record.fields,
//       }));

//       return new NextResponse(JSON.stringify(results), { status: 200 });
//     }

//     if (!query || isNaN(Number(query))) {
//       return new NextResponse(JSON.stringify({ error: 'يرجى إدخال رقم الأصل الصحيح للبحث' }), { status: 400 });
//     }

//     const records = await base('قائمة الاصول')
//       .select({
//         filterByFormula: `{assetnum} = ${query}`,
//         maxRecords: 10,
//       })
//       .all();

//     if (records.length === 0) {
//       return new NextResponse(JSON.stringify({ message: 'لم يتم العثور على عهدة برقم الأصل المدخل' }), { status: 404 });
//     }

//     const results = records.map((record) => ({
//       id: record.id,
//       fields: record.fields,
//     }));

//     return new NextResponse(JSON.stringify(results), { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return new NextResponse(JSON.stringify({ error: 'حدث خطأ أثناء البحث' }), { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { records, employeeName, receiptDate, signature, email } = body; // إضافة email

//     console.log('Received data in /api/assetform:', { records, employeeName, receiptDate, signature, email });

//     if (!records || records.length === 0 || !employeeName || !receiptDate || !email) { // التحقق من وجود email
//       return new NextResponse(JSON.stringify({ error: 'جميع الحقول (السجلات، اسم الموظف، تاريخ الاستلام، البريد الإلكتروني) مطلوبة' }), { status: 400 });
//     }

//     // التحقق من وجود التوقيع
//     let signatureAttachment = null;
//     if (signature) {
//       if (!signature.startsWith('data:image/')) {
//         console.error('Invalid signature format:', signature);
//         return new NextResponse(JSON.stringify({ error: 'التوقيع يجب أن يكون بصيغة Base64 صالحة' }), { status: 400 });
//       }

//       // رفع الصورة إلى imgBB
//       const imageUrl = await uploadImageToImgBB(signature);

//       // إعداد المرفق لـ Airtable
//       signatureAttachment = [
//         {
//           url: imageUrl,
//           filename: 'signature.png',
//         },
//       ];
//     }

//     // البحث عن السجلات في "قائمة الاصول" واستخراج جميع المعرفات (Record IDs)
//     const linkedRecords = await Promise.all(
//       records.map(async (record) => {
//         const assetNum = record.fields['assetnum'];
//         const assetRecords = await base('قائمة الاصول')
//           .select({
//             filterByFormula: `{assetnum} = ${assetNum}`,
//             maxRecords: 1,
//           })
//           .all();

//         if (assetRecords.length === 0) {
//           throw new Error(`لم يتم العثور على سجل في قائمة الاصول برقم الأصل ${assetNum}`);
//         }

//         return assetRecords[0].id;
//       })
//     );

//     // إنشاء سجل واحد في جدول "العهد المستلمة" مع إضافة حقل Email
//     const createdRecords = await base('العهد المستلمة').create([
//       {
//         fields: {
//           "رقم الاصل": linkedRecords,
//           "اسم الموظف": employeeName,
//           "تاريخ الاستلام": receiptDate,
//           "Notes": "sss",
//           "التوقيع": signatureAttachment, // المرفق (قد يكون null إذا لم يكن هناك توقيع)
//           "Email": email, // إضافة حقل البريد الإلكتروني
//         },
//       },
//     ]);

//     return new NextResponse(JSON.stringify({ message: 'تم تسجيل العهد المستلمة بنجاح', ids: createdRecords.map(r => r.getId()) }), { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return new NextResponse(JSON.stringify({ error: 'فشل في تسجيل العهد المستلمة: ' + error.message }), { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';
import axios from 'axios';

// إعداد Airtable
const base = new Airtable({ apiKey: 'pathInbmmQ2GimI5Q.6994f95d5d0f915839960010ca25d49fe1d152b2d2be189a4508947684511e91' }).base('appwChimKKH5U0rtH');

// دالة لرفع الصورة إلى imgBB
async function uploadImageToImgBB(base64: string) {
  try {
    const base64Data = base64.split(',')[1]; // إزالة "data:image/png;base64,"
    const formData = new FormData();
    formData.append('image', base64Data);

    console.log('Uploading image to imgBB...');
    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      params: {
        key: '960012ec48fff9b7d8bf3fe19f460320',
      },
    });

    console.log('imgBB response:', response.data);
    return response.data.data.url;
  } catch (error) {
    console.error('Error uploading image to imgBB:', error.response ? error.response.data : error.message);
    throw new Error('فشل في رفع الصورة إلى imgBB');
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!req) {
      return new Response(JSON.stringify({ message: 'Hello, world!' }), { status: 200 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const type = searchParams.get('type');

    if (type === 'received') {
      const employeeName = searchParams.get('employeeName');
      const records = await base('العهد المستلمة')
        .select({
          filterByFormula: employeeName ? `{اسم الموظف} = "${employeeName}"` : '',
          maxRecords: 10,
        })
        .all();

      if (records.length === 0) {
        return new NextResponse(JSON.stringify({ message: 'لم يتم العثور على سجلات للعهد المستلمة' }), { status: 404 });
      }

      const results = records.map((record) => ({
        id: record.id,
        fields: record.fields,
      }));

      return new NextResponse(JSON.stringify(results), { status: 200 });
    }

    if (!query || isNaN(Number(query))) {
      return new NextResponse(JSON.stringify({ error: 'يرجى إدخال رقم الأصل الصحيح للبحث' }), { status: 400 });
    }

    const records = await base('قائمة الاصول')
      .select({
        filterByFormula: `{assetnum} = ${query}`,
        maxRecords: 10,
      })
      .all();

    if (records.length === 0) {
      return new NextResponse(JSON.stringify({ message: 'لم يتم العثور على عهدة برقم الأصل المدخل' }), { status: 404 });
    }

    const results = records.map((record) => ({
      id: record.id,
      fields: record.fields,
    }));

    return new NextResponse(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: 'حدث خطأ أثناء البحث' }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { records, employeeName, receiptDate, signature, email } = body;

    console.log('Received data in /api/assetform:', { records, employeeName, receiptDate, signature, email });

    if (!records || records.length === 0 || !employeeName || !receiptDate || !email) {
      return new NextResponse(JSON.stringify({ error: 'جميع الحقول (السجلات، اسم الموظف، تاريخ الاستلام، البريد الإلكتروني) مطلوبة' }), { status: 400 });
    }

    // التحقق من حقل "مستلم الاصل" في جدول "قائمة الاصول"
    for (const record of records) {
      const assetNum = record.fields['assetnum'];
      const assetRecords = await base('قائمة الاصول')
        .select({
          filterByFormula: `{assetnum} = ${assetNum}`,
          maxRecords: 1,
        })
        .all();

      if (assetRecords.length === 0) {
        return new NextResponse(JSON.stringify({ error: `لم يتم العثور على سجل في قائمة الاصول برقم الأصل ${assetNum}` }), { status: 404 });
      }

      const assetRecord = assetRecords[0];
      const linkedCustody = assetRecord.fields['مستلم الاصل']; // حقل مرتبط بجدول "العهد المستلمة"

      if (linkedCustody && Array.isArray(linkedCustody) && linkedCustody.length > 0) {
        // جلب سجل العهدة المرتبطة للحصول على اسم الموظف
        const custodyRecord = await base('العهد المستلمة').find(linkedCustody[0]);
        const currentCustodian = custodyRecord.fields['اسم الموظف'];
        return new NextResponse(
          JSON.stringify({ error: `الأصل ${assetNum} موجود بالفعل في عهدة ${currentCustodian}` }),
          { status: 400 }
        );
      }
    }

    // التحقق من وجود التوقيع
    let signatureAttachment = null;
    if (signature) {
      if (!signature.startsWith('data:image/')) {
        console.error('Invalid signature format:', signature);
        return new NextResponse(JSON.stringify({ error: 'التوقيع يجب أن يكون بصيغة Base64 صالحة' }), { status: 400 });
      }

      const imageUrl = await uploadImageToImgBB(signature);
      signatureAttachment = [
        {
          url: imageUrl,
          filename: 'signature.png',
        },
      ];
    }

    // استخراج معرفات السجلات من "قائمة الاصول"
    const linkedRecords = await Promise.all(
      records.map(async (record) => {
        const assetNum = record.fields['assetnum'];
        const assetRecords = await base('قائمة الاصول')
          .select({
            filterByFormula: `{assetnum} = ${assetNum}`,
            maxRecords: 1,
          })
          .all();

        if (assetRecords.length === 0) {
          throw new Error(`لم يتم العثور على سجل في قائمة الاصول برقم الأصل ${assetNum}`);
        }

        return assetRecords[0].id;
      })
    );

    // إنشاء سجل في جدول "العهد المستلمة"
    const createdRecords = await base('العهد المستلمة').create([
      {
        fields: {
          "رقم الاصل": linkedRecords,
          "اسم الموظف": employeeName,
          "تاريخ الاستلام": receiptDate,
          "Notes": "sss",
          "التوقيع": signatureAttachment,
          "Email": email,
        },
      },
    ]);

    // تحديث حقل "مستلم الاصل" في جدول "قائمة الاصول" لربطه بالعهدة الجديدة
    const custodyId = createdRecords[0].getId();
    await Promise.all(
      linkedRecords.map(async (assetId) => {
        await base('قائمة الاصول').update(assetId, {
          "مستلم الاصل": [custodyId], // ربط الأصل بالعهدة الجديدة
        });
      })
    );

    return new NextResponse(JSON.stringify({ message: 'تم تسجيل العهد المستلمة بنجاح', ids: createdRecords.map(r => r.getId()) }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: 'فشل في تسجيل العهد المستلمة: ' + error.message }), { status: 500 });
  }
}