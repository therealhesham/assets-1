import { NextRequest, NextResponse } from 'next/server';
import Airtable, { FieldSet, Records } from 'airtable';
import AWS from 'aws-sdk';

// إعداد Airtable
const base = new Airtable({ apiKey: 'pathInbmmQ2GimI5Q.6994f95d5d0f915839960010ca25d49fe1d152b2d2be189a4508947684511e91' }).base('appwChimKKH5U0rtH');

const spacesEndpoint = new AWS.Endpoint('https://sgp1.digitaloceanspaces.com'); // الـ Endpoint الصحيح لمنطقة sgp1
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: 'DO801T82UVGHTCP7ET2A',
  secretAccessKey: '9onR3UUdlwij+AmG8ogloMO4Hp7+oN6HIVRWjRtkNgM',
});

// تعريف الأنواع
interface AssetFields {
  assetnum: number;
  'اسم الاصل': string;
  'الرقم التسلسلي'?: string;
  'الشركة المصنعة'?: string;
  'حالة الاصل'?: string;
  'مواصفات اضافية'?: string;
  'مستلم الاصل'?: string[];
}

interface TransferRequestFields {
  sender_id: string[];
  receiver_id: string[];
  assets: string[];
  status: string;
  transfer_date: string;
  sender_signature?: string[];
  receiver_signature?: string[];
  sender_name?: string;
}

interface UserFields {
  name: string;
  empid: number;
  email: string;
  password: string;
}

async function uploadSignature(base64: string): Promise<string> {
  try {
    console.log('Starting signature upload process...');
    const buffer = Buffer.from(base64.split(',')[1], 'base64');
    const fileName = `signatures/transfer-${Date.now()}.png`;
    const params = { Bucket: 'assetspics', Key: fileName, Body: buffer, ContentType: 'image/png', ACL: 'public-read' };
    const { Location } = await s3.upload(params).promise();
    console.log('Signature uploaded successfully:', Location);
    return Location;
  } catch (error) {
    console.error('Error uploading signature to S3:', error);
    throw new Error('فشل رفع التوقيع');
  }
}

export async function GET(req: NextRequest) {
  try {
    console.log('GET request received:', req.url);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const userId = searchParams.get('userId');
    console.log('Query params:', { search, userId });

    const assetsPromise = base('قائمة الاصول')
      .select({
        filterByFormula: search ? `{assetnum} = ${Number(search)}` : '',
        maxRecords: 10,
      })
      .all();

    const requestsPromise = base('Transfer Requests')
      .select({
        filterByFormula: userId ? `{receiver_id} = "${userId}"` : '',
      })
      .all();

    const usersPromise = base('users').select().all();

    const [assets, requests, users] = await Promise.all([assetsPromise, requestsPromise, usersPromise]);

    const userMap = users.reduce((map, user) => {
      const userFields = (user.fields as unknown) as UserFields;
      if (userFields && userFields.name) {
        return { ...map, [user.id]: userFields.name };
      }
      return map;
    }, {} as Record<string, string>);

    const responseData = [
      ...assets.map((asset) => ({
        id: asset.id,
        fields: (asset.fields as unknown) as AssetFields,
      })),
      ...requests.map((request) => {
        const fields = (request.fields as unknown) as TransferRequestFields;
        return {
          id: request.id,
          fields: {
            sender_id: fields.sender_id || [],
            receiver_id: fields.receiver_id || [],
            assets: fields.assets || [],
            status: fields.status || 'Pending',
            transfer_date: fields.transfer_date || '',
            sender_signature: fields.sender_signature || [],
            receiver_signature: fields.receiver_signature || [],
            sender_name: userMap[fields.sender_id?.[0] ?? ''] || 'غير معروف',
          },
        };
      }),
    ];

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in GET request:', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('POST request received');
    const body = await req.json();
    console.log('Received POST body:', body);

    const { senderId, receiverId, assets, transferDate, signature } = body;

    if (!senderId || !receiverId || !assets || !transferDate) {
      console.log('Missing required fields:', { senderId, receiverId, assets, transferDate });
      return NextResponse.json({ error: 'حقول مطلوبة مفقودة' }, { status: 400 });
    }

    console.log('Fetching sender and receiver from Airtable...');
    const [sender, receiver] = await Promise.all([
      base('users').find(senderId),
      base('users').find(receiverId),
    ]);
    console.log('Sender and receiver fetched successfully');

    let signatureUrl: string | undefined;
    if (signature) {
      console.log('Processing signature upload...');
      signatureUrl = await uploadSignature(signature);
      console.log('Signature URL:', signatureUrl);
    }

    console.log('Creating transfer request in Airtable...');
    const record = await base('Transfer Requests').create([
      {
        fields: {
          sender_id: [senderId],
          receiver_id: [receiverId],
          assets: assets as string[],
          status: 'Pending',
          transfer_date: transferDate,
          sender_signature: signatureUrl ? [signatureUrl] : undefined,
          email_sent: new Date().toISOString(),
        },
      },
    ]);
    console.log('Transfer request created:', record[0].id);

    const senderFields = (sender.fields as unknown) as UserFields;
    const receiverFields = (receiver.fields as unknown) as UserFields;

    const htmlContent = `
      <h1>طلب تسليم أصول</h1>
      <p>مرحبًا ${receiverFields.name ?? 'المستلم'}،</p>
      <p>لقد تلقيت طلب تسليم من ${senderFields.name ?? 'المرسل'} في ${transferDate}.</p>
      <p>الرجاء التحقق من <a href="http://yourdomain.com/transfer">الصفحة</a>.</p>
    `;

    console.log('Sending email notification...');
    await fetch('/api/SEND-MAIL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeName: senderFields.name ?? 'المرسل',
        receiptDate: transferDate,
        records: assets.map((id: string) => ({ fields: { assetnum: id } })),
        email: receiverFields.email ?? '',
        signature,
      }),
    });
    console.log('Email notification sent');

    return NextResponse.json({ message: 'تم إنشاء طلب النقل', id: record[0].id });
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    console.log('PUT request received');
    const body = await req.json();
    console.log('Received PUT body:', body);

    const { id, status, signature } = body;
    if (!id || !status) {
      console.log('Missing required fields:', { id, status });
      return NextResponse.json({ error: 'حقول مطلوبة مفقودة' }, { status: 400 });
    }

    let signatureUrl: string | undefined;
    if (signature) {
      console.log('Processing signature upload...');
      signatureUrl = await uploadSignature(signature);
      console.log('Signature URL:', signatureUrl);
    }

    console.log('Updating transfer request in Airtable...');
    await base('Transfer Requests').update([
      {
        id,
        fields: {
          status,
          receiver_signature: signatureUrl ? [signatureUrl] : undefined,
        },
      },
    ]);
    console.log('Transfer request updated');

    return NextResponse.json({ message: 'تم تحديث النقل' });
  } catch (error) {
    console.error('Error in PUT request:', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
  }
}