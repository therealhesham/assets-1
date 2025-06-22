import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';
import AWS from 'aws-sdk';

// إعداد Airtable
const base = new Airtable({ apiKey: 'pathInbmmQ2GimI5Q.6994f95d5d0f915839960010ca25d49fe1d152b2d2be189a4508947684511e91' }).base('appwChimKKH5U0rtH');

// إعداد DigitalOcean Spaces
const spacesEndpoint = new AWS.Endpoint('https://sgp1.digitaloceanspaces.com'); // الـ Endpoint لمنطقة sgp1
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: 'DO801T82UVGHTCP7ET2A',
  secretAccessKey: '9onR3UUdlwij+AmG8ogloMO4Hp7+oN6HIVRWjRtkNgM',
});

// دالة لرفع الصورة إلى DigitalOcean Spaces
async function uploadImageToSpaces(base64: string): Promise<string> {
  try {
    console.log('Starting image upload process...');
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

// دالة GET لجلب السجلات
export async function GET(req: NextRequest) {
  try {
    console.log('GET request received at /api/transfer');
    if (!req) {
      console.log('No request object, returning default response');
      return new Response(JSON.stringify({ message: 'Hello, world!' }), { status: 200 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const type = searchParams.get('type');
    console.log('Query parameters:', { query, type });

    if (type === 'received') {
      const employeeName = searchParams.get('employeeName');
      console.log('Fetching received records for employee:', employeeName);
      const records = await base('العهد المستلمة')
        .select({
          filterByFormula: employeeName ? `{اسم الموظف} = "${employeeName}"` : '',
          maxRecords: 10,
        })
        .all();

      if (records.length === 0) {
        console.log('No records found for received custody');
        return new NextResponse(JSON.stringify({ message: 'لم يتم العثور على سجلات للعهد المستلمة' }), { status: 404 });
      }

      const results = records.map((record) => ({
        id: record.id,
        fields: record.fields,
      }));

      console.log('Returning received records:', results);
      return new NextResponse(JSON.stringify(results), { status: 200 });
    }

    if (!query || isNaN(Number(query))) {
      console.log('Invalid query parameter:', query);
      return new NextResponse(JSON.stringify({ error: 'يرجى إدخال رقم الأصل الصحيح للبحث' }), { status: 400 });
    }

    console.log('Searching for asset with assetnum:', query);
    const records = await base('قائمة الاصول')
      .select({
        filterByFormula: `{assetnum} = ${query}`,
        maxRecords: 10,
      })
      .all();

    if (records.length === 0) {
      console.log('No records found for assetnum:', query);
      return new NextResponse(JSON.stringify({ message: 'لم يتم العثور على عهدة برقم الأصل المدخل' }), { status: 404 });
    }

    const results = records.map((record) => ({
      id: record.id,
      fields: record.fields,
    }));

    console.log('Returning asset records:', results);
    return new NextResponse(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error('Error in GET request:', error);
    return new NextResponse(JSON.stringify({ error: 'حدث خطأ أثناء البحث' }), { status: 500 });
  }
}

// دالة POST لإنشاء سجل جديد
export async function POST(req: NextRequest) {
  try {
    console.log('POST request received at /api/transfer');
    const body = await req.json();
    console.log('Received POST body:', body);

    const { records, employeeName, receiptDate, signature, email } = body;

    if (!records || records.length === 0 || !employeeName || !receiptDate || !email) {
      console.log('Missing required fields:', { records, employeeName, receiptDate, email });
      return new NextResponse(JSON.stringify({ error: 'جميع الحقول (السجلات، اسم الموظف، تاريخ الاستلام، البريد الإلكتروني) مطلوبة' }), { status: 400 });
    }

    // التحقق من حقل "مستلم الاصل" في جدول "قائمة الاصول"
    for (const record of records) {
      const assetNum = record.fields['assetnum'];
      console.log('Checking assetnum:', assetNum);
      const assetRecords = await base('قائمة الاصول')
        .select({
          filterByFormula: `{assetnum} = ${assetNum}`,
          maxRecords: 1,
        })
        .all();

      if (assetRecords.length === 0) {
        console.log('Asset not found for assetnum:', assetNum);
        return new NextResponse(JSON.stringify({ error: `لم يتم العثور على سجل في قائمة الاصول برقم الأصل ${assetNum}` }), { status: 404 });
      }

      const assetRecord = assetRecords[0];
      const linkedCustody = assetRecord.fields['مستلم الاصل'];

      if (linkedCustody && Array.isArray(linkedCustody) && linkedCustody.length > 0) {
        const custodyRecord = await base('العهد المستلمة').find(linkedCustody[0]);
        const currentCustodian = custodyRecord.fields['اسم الموظف'];
        console.log('Asset already assigned to:', currentCustodian);
        return new NextResponse(
          JSON.stringify({ error: `الأصل ${assetNum} موجود بالفعل في عهدة ${currentCustodian}` }),
          { status: 400 }
        );
      }
    }

    // التحقق من التوقيع ورفعه إذا وجد
    let signatureAttachment = null;
    if (signature) {
      if (!signature.startsWith('data:image/')) {
        console.error('Invalid signature format:', signature);
        return new NextResponse(JSON.stringify({ error: 'التوقيع يجب أن يكون بصيغة Base64 صالحة' }), { status: 400 });
      }

      const imageUrl = await uploadImageToSpaces(signature);
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

    // تحديث حقل "مستلم الاصل" في جدول "قائمة الاصول"
    const custodyId = createdRecords[0].getId();
    await Promise.all(
      linkedRecords.map(async (assetId) => {
        await base('قائمة الاصول').update(assetId, {
          "مستلم الاصل": [custodyId],
        });
      })
    );

    console.log('Custody record created and linked successfully');
    return new NextResponse(JSON.stringify({ message: 'تم تسجيل العهد المستلمة بنجاح', ids: createdRecords.map(r => r.getId()) }), { status: 200 });
  } catch (error) {
    console.error('Error in POST request:', error);
    return new NextResponse(JSON.stringify({ error: 'فشل في تسجيل العهد المستلمة: ' + error.message }), { status: 500 });
  }
}