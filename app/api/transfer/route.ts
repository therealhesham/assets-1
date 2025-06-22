// app/api/transfer/route.ts
import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";
import AWS from "aws-sdk";

// إعداد Airtable
const base = new Airtable({
  apiKey: "pathInbmmQ2GimI5Q.6994f95d5d0f915839960010ca25d49fe1d152b2d2be189a4508947684511e91",
}).base("appwChimKKH5U0rtH");

// إعداد DigitalOcean Spaces
const spacesEndpoint = new AWS.Endpoint("https://sgp1.digitaloceanspaces.com");
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: "DO801T82UVGHTCP7ET2A",
  secretAccessKey: "9onR3UUdlwij+AmG8ogloMO4Hp7+oN6HIVRWjRtkNgM",
});

// دالة لرفع الصورة إلى DigitalOcean Spaces
async function uploadImageToSpaces(base64: string): Promise<string> {
  try {
    console.log("Starting image upload process...");
    const base64Data = base64.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    const fileName = `signatures/signature-${Date.now()}.png`;

    const params = {
      Bucket: "assetspics",
      Key: fileName,
      Body: buffer,
      ContentType: "image/png",
      ACL: "public-read",
    };

    console.log("Uploading image to DigitalOcean Spaces...");
    const { Location } = await s3.upload(params).promise();
    console.log("Image uploaded successfully:", Location);
    return Location;
  } catch (error) {
    console.error("Error uploading image to DigitalOcean Spaces:", error);
    throw new Error("فشل في رفع الصورة إلى DigitalOcean Spaces");
  }
}

// دالة GET لجلب السجلات
export async function GET(req: NextRequest) {
  try {
    console.log("GET request received at /api/transfer");
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const query = searchParams.get("search"); // استخدام search بدلاً من query

    console.log("Query parameters:", { userId, query });

    if (!userId || isNaN(Number(userId))) {
      console.log("Invalid userId parameter:", userId);
      return NextResponse.json(
        { error: "معرف المستخدم (empid) مطلوب ويجب أن يكون رقمًا" },
        { status: 400 }
      );
    }

    let records;
    if (query && !isNaN(Number(query))) {
      console.log("Searching for asset with assetnum:", query);
      records = await base("قائمة الاصول")
        .select({
          filterByFormula: `{assetnum} = ${Number(query)}`,
          maxRecords: 10,
        })
        .all();
    } else {
      console.log("Fetching transfer requests for userId:", userId);
      records = await base("العهد المستلمة")
        .select({
          filterByFormula: `{اسم الموظف} = "${userId}"`,
        })
        .all();
    }

    if (records.length === 0) {
      console.log("No records found for userId or query:", { userId, query });
      return NextResponse.json(
        { message: "لا توجد طلبات أو أصول متاحة" },
        { status: 404 }
      );
    }

    const results = records.map((record) => ({
      id: record.id,
      fields: record.fields,
    }));

    console.log("Returning records:", results);
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء البحث" },
      { status: 500 }
    );
  }
}

// دالة POST لإنشاء سجل جديد
export async function POST(req: NextRequest) {
  try {
    console.log("POST request received at /api/transfer");
    const body = await req.json();
    console.log("Received POST body:", body);

    const { senderId, receiverId, assets, transferDate, signature } = body;

    if (!senderId || !receiverId || !assets || !transferDate) {
      console.log("Missing required fields:", { senderId, receiverId, assets, transferDate });
      return NextResponse.json(
        { error: "جميع الحقول (senderId, receiverId, assets, transferDate) مطلوبة" },
        { status: 400 }
      );
    }

    let signatureAttachment = null;
    if (signature) {
      if (!signature.startsWith("data:image/")) {
        console.error("Invalid signature format:", signature);
        return NextResponse.json(
          { error: "التوقيع يجب أن يكون بصيغة Base64 صالحة" },
          { status: 400 }
        );
      }
      const imageUrl = await uploadImageToSpaces(signature);
      signatureAttachment = [
        {
          url: imageUrl,
          filename: "signature.png",
        },
      ];
    }

    const createdRecords = await base("العهد المستلمة").create([
      {
        fields: {
          "رقم الاصل": assets,
          "اسم الموظف": receiverId,
          "تاريخ الاستلام": transferDate,
          "Notes": "sss",
          "التوقيع": signatureAttachment,
          "Email": "example@email.com", // يمكن استبداله بقيمة ديناميكية
        },
      },
    ]);

    console.log("Custody record created successfully");
    return NextResponse.json(
      { message: "تم تسجيل العهد المستلمة بنجاح", ids: createdRecords.map((r) => r.getId()) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "فشل في تسجيل العهد المستلمة: " + error.message },
      { status: 500 }
    );
  }
}

// دالة PUT لتحديث الحالة
export async function PUT(req: NextRequest) {
  try {
    console.log("PUT request received at /api/transfer");
    const body = await req.json();
    console.log("Received PUT body:", body);

    const { id, status, signature } = body;

    if (!id || !status) {
      console.log("Missing required fields:", { id, status });
      return NextResponse.json(
        { error: "حقول id وstatus مطلوبة" },
        { status: 400 }
      );
    }

    let signatureAttachment = null;
    if (signature) {
      if (!signature.startsWith("data:image/")) {
        console.error("Invalid signature format:", signature);
        return NextResponse.json(
          { error: "التوقيع يجب أن يكون بصيغة Base64 صالحة" },
          { status: 400 }
        );
      }
      const imageUrl = await uploadImageToSpaces(signature);
      signatureAttachment = [
        {
          url: imageUrl,
          filename: "signature.png",
        },
      ];
    }

    const updatedRecord = await base("العهد المستلمة").update(id, {
      "status": status,
      "التوقيع": signatureAttachment,
    });

    console.log("Transfer request updated successfully");
    return NextResponse.json(
      { message: "تم تحديث الطلب بنجاح", id: updatedRecord.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT request:", error);
    return NextResponse.json(
      { error: "فشل في تحديث الطلب: " + error.message },
      { status: 500 }
    );
  }
}