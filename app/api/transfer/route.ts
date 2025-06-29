// // app/api/transfer/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import Airtable from "airtable";
// import AWS from "aws-sdk";

// // إعداد Airtable
// const base = new Airtable({
//   apiKey: "pathInbmmQ2GimI5Q.6994f95d5d0f915839960010ca25d49fe1d152b2d2be189a4508947684511e91",
// }).base("appwChimKKH5U0rtH");

// // إعداد DigitalOcean Spaces
// const spacesEndpoint = new AWS.Endpoint("https://sgp1.digitaloceanspaces.com");
// const s3 = new AWS.S3({
//   endpoint: spacesEndpoint,
//   accessKeyId: "DO801T82UVGHTCP7ET2A",
//   secretAccessKey: "9onR3UUdlwij+AmG8ogloMO4Hp7+oN6HIVRWjRtkNgM",
// });

// // دالة لرفع الصورة إلى DigitalOcean Spaces
// async function uploadImageToSpaces(base64: string): Promise<string> {
//   try {
//     console.log("Starting image upload process...");
//     const base64Data = base64.split(",")[1];
//     const buffer = Buffer.from(base64Data, "base64");
//     const fileName = `signatures/signature-${Date.now()}.png`;

//     const params = {
//       Bucket: "assetspics",
//       Key: fileName,
//       Body: buffer,
//       ContentType: "image/png",
//       ACL: "public-read",
//     };

//     console.log("Uploading image to DigitalOcean Spaces...");
//     const { Location } = await s3.upload(params).promise();
//     console.log("Image uploaded successfully:", Location);
//     return Location;
//   } catch (error) {
//     console.error("Error uploading image to DigitalOcean Spaces:", error);
//     throw new Error("فشل في رفع الصورة إلى DigitalOcean Spaces");
//   }
// }

// // دالة GET لجلب السجلات
// export async function GET(req: NextRequest) {
//     try {
//       console.log("GET request received at /api/transfer");
//       const { searchParams } = new URL(req.url);
//       const query = searchParams.get("search");
//       const type = searchParams.get("type");
  
//       if (type === "requests") {
//         const records = await base("Transfer Requests")
//           .select({
//             fields: ["id", "sender_id", "receiver_id", "assets", "status", "transfer_date"], // إضافة حقل id
//             maxRecords: 1000,
//           })
//           .all();
  
//         const results = await Promise.all(
//           records.map(async (record) => {
//             // جلب تفاصيل المرسل
//             const senderIds = record.fields.sender_id as string[];
//             const senderRecords = senderIds?.length
//               ? await base("Users")
//                   .select({
//                     filterByFormula: `RECORD_ID() = '${senderIds[0]}'`,
//                     maxRecords: 1,
//                   })
//                   .all()
//               : [];
//             const sender = senderRecords.length
//               ? { id: senderRecords[0].id, empid: senderRecords[0].fields.empid, name: senderRecords[0].fields.name || "غير معروف" }
//               : null;
  
//             // جلب تفاصيل المستقبل
//             const receiverIds = record.fields.receiver_id as string[];
//             const receiverRecords = receiverIds?.length
//               ? await base("Users")
//                   .select({
//                     filterByFormula: `RECORD_ID() = '${receiverIds[0]}'`,
//                     maxRecords: 1,
//                   })
//                   .all()
//               : [];
//             const receiver = receiverRecords.length
//               ? { id: receiverRecords[0].id, empid: receiverRecords[0].fields.empid, name: receiverRecords[0].fields.name || "غير معروف" }
//               : null;
  
//             // جلب تفاصيل الأصول
//             const assetIds = record.fields.assets as string[];
//             const assetRecords = assetIds?.length
//               ? await base("قائمة الاصول")
//                   .select({
//                     filterByFormula: `OR(${assetIds.map((id) => `RECORD_ID() = '${id}'`).join(",")})`,
//                     maxRecords: assetIds.length,
//                   })
//                   .all()
//               : [];
//             const assets = assetRecords.map((asset) => ({
//               id: asset.id,
//               assetnum: asset.fields.assetnum,
//               name: asset.fields["اسم الاصل"] || "غير معروف",
//               serial: asset.fields["الرقم التسلسلي"] || "غير متوفر",
//             }));
  
//             return {
//               id: record.id, // معرف السجل (record ID)
//               fields: {
//                 id: record.fields.id || "غير متوفر", // حقل id المخصص
//                 sender,
//                 receiver,
//                 assets,
//                 status: record.fields.status || "غير معروف",
//                 transfer_date: record.fields.transfer_date || "غير متوفر",
//               },
//             };
//           })
//         );
  
//         return NextResponse.json(results, { status: 200 });
//       }
  
//       let filterByFormula = "";
//       if (query && !isNaN(Number(query))) {
//         console.log("Searching for asset with assetnum:", query);
//         filterByFormula = `{assetnum} = ${Number(query)}`;
//       }
  
//       const records = await base("قائمة الاصول")
//         .select({
//           filterByFormula,
//           maxRecords: query ? 10 : 1000,
//           fields: ["assetnum", "اسم الاصل", "الرقم التسلسلي"],
//         })
//         .all();
  
//       if (records.length === 0 && query) {
//         return NextResponse.json(
//           { message: "لا توجد أصول متطابقة مع رقم الأصل المطلوب" },
//           { status: 404 }
//         );
//       }
  
//       const results = records.map((record) => {
//         if (!record.fields.assetnum) {
//           throw new Error("حقل assetnum مفقود في سجل الأصل");
//         }
//         return {
//           id: record.id,
//           fields: {
//             assetnum: record.fields.assetnum,
//             "اسم الاصل": record.fields["اسم الاصل"] || "غير معروف",
//             "الرقم التسلسلي": record.fields["الرقم التسلسلي"] || "غير متوفر",
//           },
//         };
//       });
  
//       return NextResponse.json(results, { status: 200 });
//     } catch (error: any) {
//       console.error("Error in GET request:", error);
//       return NextResponse.json(
//         { error: "حدث خطأ أثناء البحث: " + error.message },
//         { status: 500 }
//       );
//     }
//   }
  

// // دالة POST لإنشاء سجل جديد
// export async function POST(req: NextRequest) {
//     try {
//       console.log("POST request received at /api/transfer");
//       const body = await req.json();
//       console.log("Received POST body:", body);
  
//       const { sender_id, receiver_id, assetnums, signature } = body;
  
//       if (!Array.isArray(assetnums) || assetnums.length === 0) {
//         return NextResponse.json(
//           { error: "يجب تحديد أصل واحد على الأقل" },
//           { status: 400 }
//         );
//       }
  
//       if (!signature) {
//         return NextResponse.json(
//           { error: "التوقيع مطلوب" },
//           { status: 400 }
//         );
//       }
  
//       // 1. رفع التوقيع إلى DigitalOcean Spaces
//       const signatureUrl = await uploadImageToSpaces(signature);
//       const filename = `signature-${Date.now()}.png`;
  
//       // 2. البحث عن سجل المرسل في جدول Users باستخدام empid
//       const senderRecords = await base("Users")
//         .select({
//           filterByFormula: `{empid} = '${sender_id}'`,
//           maxRecords: 1,
//         })
//         .all();
  
//       if (senderRecords.length === 0) {
//         return NextResponse.json(
//           { error: "لم يتم العثور على الموظف المرسل" },
//           { status: 404 }
//         );
//       }
//       const validSenderId = senderRecords[0].id;
  
//       // 3. البحث عن سجل المستقبل في جدول Users باستخدام empid
//       const receiverRecords = await base("Users")
//         .select({
//           filterByFormula: `{empid} = '${receiver_id}'`,
//           maxRecords: 1,
//         })
//         .all();
  
//       if (receiverRecords.length === 0) {
//         return NextResponse.json(
//           { error: "لم يتم العثور على الموظف المستقبل" },
//           { status: 404 }
//         );
//       }
//       const validReceiverId = receiverRecords[0].id;
  
//       // 4. البحث عن الأصول باستخدام assetnums
//       const validAssetIds: string[] = [];
//       for (const assetnum of assetnums) {
//         const assetRecords = await base("قائمة الاصول")
//           .select({
//             filterByFormula: `{assetnum} = ${Number(assetnum)}`,
//             maxRecords: 1,
//           })
//           .all();
  
//         if (assetRecords.length === 0) {
//           return NextResponse.json(
//             { error: `لم يتم العثور على الأصل برقم ${assetnum}` },
//             { status: 404 }
//           );
//         }
//         validAssetIds.push(assetRecords[0].id);
//       }
  
//       // 5. إنشاء سجل النقل باستخدام IDs الصالحة
//       const createdRecord = await base("Transfer Requests").create([
//         {
//           fields: {
//             sender_id: [validSenderId],
//             receiver_id: [validReceiverId],
//             assets: validAssetIds,
//             status: "Pending",
//             transfer_date: new Date().toISOString(),
//             sender_signature: [
//               {
//                 url: signatureUrl,
//                 filename,
//               } as any, // تجاوز فحص TypeScript
//             ],
//           },
//         },
//       ]);
  
//       return NextResponse.json(
//         {
//           message: "تم إنشاء طلب النقل بنجاح",
//           record_id: createdRecord[0].getId(),
//         },
//         { status: 201 }
//       );
//     } catch (error: any) {
//       console.error("Error in POST request:", error);
//       return NextResponse.json(
//         { error: "فشل في إنشاء طلب النقل: " + error.message },
//         { status: 500 }
//       );
//     }
//   }


// // دالة PUT لتحديث الحالة
// export async function PUT(req: NextRequest) {
//   try {
//     console.log("PUT request received at /api/transfer");
//     const body = await req.json();
//     console.log("Received PUT body:", body);

//     const { id, status, signature } = body;

//     if (!id || !status) {
//       console.log("Missing required fields:", { id, status });
//       return NextResponse.json(
//         { error: "حقول id وstatus مطلوبة" },
//         { status: 400 }
//       );
//     }

//     let signatureAttachment = null;
//     if (signature) {
//       if (!signature.startsWith("data:image/")) {
//         console.error("Invalid signature format:", signature);
//         return NextResponse.json(
//           { error: "التوقيع يجب أن يكون بصيغة Base64 صالحة" },
//           { status: 400 }
//         );
//       }
//       const imageUrl = await uploadImageToSpaces(signature);
//       signatureAttachment = [
//         {
//           url: imageUrl,
//           filename: "signature.png",
//         },
//       ];
//     }

//     const updatedRecord = await base("العهد المستلمة").update(id, {
//       "status": status,
//       "التوقيع": signatureAttachment,
//     });

//     console.log("Transfer request updated successfully");
//     return NextResponse.json(
//       { message: "تم تحديث الطلب بنجاح", id: updatedRecord.id },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error in PUT request:", error);
//     return NextResponse.json(
//       { error: "فشل في تحديث الطلب: " + error.message },
//       { status: 500 }
//     );
//   }
// }

// export async function PATCH(req: NextRequest) {
//     try {
//       console.log("PATCH request received at /api/transfer");
//       const body = await req.json();
//       console.log("Received PATCH body:", body);
  
//       const { requestId, status, receiverSignature, reasonRejection } = body;
  
//       if (!requestId || !status || !["Accepted", "Rejected"].includes(status)) {
//         return NextResponse.json(
//           { error: "معرف الطلب والحالة مطلوبان، ويجب أن تكون الحالة 'Accepted' أو 'Rejected'" },
//           { status: 400 }
//         );
//       }
  
//       if (!receiverSignature) {
//         return NextResponse.json(
//           { error: "توقيع المستلم مطلوب" },
//           { status: 400 }
//         );
//       }
  
//       if (status === "Rejected" && !reasonRejection) {
//         return NextResponse.json(
//           { error: "سبب الرفض مطلوب عند رفض الطلب" },
//           { status: 400 }
//         );
//       }
  
//       // رفع توقيع المستلم إلى DigitalOcean Spaces
//       const signatureUrl = await uploadImageToSpaces(receiverSignature);
//       const filename = `signature-${Date.now()}.png`;
  
//       // تحديث سجل الطلب في جدول Transfer Requests
//       const updatedRecord = await base("Transfer Requests").update([
//         {
//           id: requestId,
//           fields: {
//             status,
//             receiver_signature: [
//               {
//                 url: signatureUrl,
//                 filename,
//               } as any, // تجاوز فحص TypeScript
//             ],
//             ReasonRejection: status === "Rejected" ? reasonRejection : undefined,
//           },
//         },
//       ]);
  
//       return NextResponse.json(
//         {
//           message: `تم تحديث حالة الطلب إلى ${status} بنجاح`,
//           record_id: updatedRecord[0].id,
//         },
//         { status: 200 }
//       );
//     } catch (error: any) {
//       console.error("Error in PATCH request:", error);
//       return NextResponse.json(
//         { error: "فشل في تحديث حالة الطلب: " + error.message },
//         { status: 500 }
//       );
//     }
//   }
import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";
import AWS from "aws-sdk";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer";
import path from "path";
import { promises as fs } from "fs";

// إعداد Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY || "pathInbmmQ2GimI5Q.6994f95d5d0f915839960010ca25d49fe1d152b2d2be189a4508947684511e91",
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
    const query = searchParams.get("search");
    const type = searchParams.get("type");

    if (type === "requests") {
      const records = await base("Transfer Requests")
        .select({
          fields: ["id", "sender_id", "receiver_id", "assets", "status", "transfer_date"],
          maxRecords: 1000,
        })
        .all();

      const results = await Promise.all(
        records.map(async (record) => {
          const senderIds = record.fields.sender_id as string[];
          const senderRecords = senderIds?.length
            ? await base("Users")
                .select({
                  filterByFormula: `RECORD_ID() = '${senderIds[0]}'`,
                  maxRecords: 1,
                })
                .all()
            : [];
          const sender = senderRecords.length
            ? {
                id: senderRecords[0].id,
                empid: senderRecords[0].fields.empid,
                name: senderRecords[0].fields.name || "غير معروف",
              }
            : null;

          const receiverIds = record.fields.receiver_id as string[];
          const receiverRecords = receiverIds?.length
            ? await base("Users")
                .select({
                  filterByFormula: `RECORD_ID() = '${receiverIds[0]}'`,
                  maxRecords: 1,
                })
                .all()
            : [];
          const receiver = receiverRecords.length
            ? {
                id: receiverRecords[0].id,
                empid: receiverRecords[0].fields.empid,
                name: receiverRecords[0].fields.name || "غير معروف",
              }
            : null;

          const assetIds = record.fields.assets as string[];
          const assetRecords = assetIds?.length
            ? await base("قائمة الاصول")
                .select({
                  filterByFormula: `OR(${assetIds
                    .map((id) => `RECORD_ID() = '${id}'`)
                    .join(",")})`,
                  maxRecords: assetIds.length,
                })
                .all()
            : [];
          const assets = assetRecords.map((asset) => ({
            id: asset.id,
            assetnum: asset.fields.assetnum,
            name: asset.fields["اسم الاصل"] || "غير معروف",
            serial: asset.fields["الرقم التسلسلي"] || "غير متوفر",
          }));

          return {
            id: record.id,
            fields: {
              id: record.fields.id || "غير متوفر",
              sender,
              receiver,
              assets,
              status: record.fields.status || "غير معروف",
              transfer_date: record.fields.transfer_date || "غير متوفر",
            },
          };
        })
      );

      return NextResponse.json(results, { status: 200 });
    }

    let filterByFormula = "";
    if (query && !isNaN(Number(query))) {
      console.log("Searching for asset with assetnum:", query);
      filterByFormula = `{assetnum} = ${Number(query)}`;
    }

    const records = await base("قائمة الاصول")
      .select({
        filterByFormula,
        maxRecords: query ? 10 : 1000,
        fields: ["assetnum", "اسم الاصل", "الرقم التسلسلي"],
      })
      .all();

    if (records.length === 0 && query) {
      return NextResponse.json(
        { message: "لا توجد أصول متطابقة مع رقم الأصل المطلوب" },
        { status: 404 }
      );
    }

    const results = records.map((record) => {
      if (!record.fields.assetnum) {
        throw new Error("حقل assetnum مفقود في سجل الأصل");
      }
      return {
        id: record.id,
        fields: {
          assetnum: record.fields.assetnum,
          "اسم الاصل": record.fields["اسم الاصل"] || "غير معروف",
          "الرقم التسلسلي": record.fields["الرقم التسلسلي"] || "غير متوفر",
        },
      };
    });

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء البحث: " + error.message },
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

    const { sender_id, receiver_id, assetnums, signature } = body;

    if (!Array.isArray(assetnums) || assetnums.length === 0) {
      return NextResponse.json(
        { error: "يجب تحديد أصل واحد على الأقل" },
        { status: 400 }
      );
    }

    if (!signature) {
      return NextResponse.json({ error: "التوقيع مطلوب" }, { status: 400 });
    }

    // 1. رفع التوقيع إلى DigitalOcean Spaces
    const signatureUrl = await uploadImageToSpaces(signature);
    const filename = `signature-${Date.now()}.png`;

    // 2. البحث عن سجل المرسل في جدول Users
    const senderRecords = await base("Users")
      .select({
        filterByFormula: `{empid} = '${sender_id}'`,
        maxRecords: 1,
        fields: ["empid", "name", "email"],
      })
      .all();

    if (senderRecords.length === 0) {
      return NextResponse.json(
        { error: "لم يتم العثور على الموظف المرسل" },
        { status: 400 }
      );
    }
    const validSenderId = senderRecords[0].id;
    const senderEmail = String(senderRecords[0].fields.email || "");
    const senderName = String(senderRecords[0].fields.name || "غير معروف");

    // 3. البحث عن سجل المستقبل في جدول Users
    const receiverRecords = await base("Users")
      .select({
        filterByFormula: `{empid} = '${receiver_id}'`,
        maxRecords: 1,
        fields: ["empid", "name", "email"],
      })
      .all();

    if (receiverRecords.length === 0) {
      return NextResponse.json(
        { error: "لم يتم العثور على الموظف المستقبل" },
        { status: 400 }
      );
    }
    const validReceiverId = receiverRecords[0].id;
    const receiverEmail = String(receiverRecords[0].fields.email || "");
    const receiverName = String(receiverRecords[0].fields.name || "غير معروف");

    // 4. البحث عن الأصول باستخدام assetnums
    const validAssetIds: string[] = [];
    const assets = [];
    for (const assetnum of assetnums) {
      const assetRecords = await base("قائمة الاصول")
        .select({
          filterByFormula: `{assetnum} = ${Number(assetnum)}`,
          maxRecords: 1,
          fields: ["assetnum", "اسم الاصل", "الرقم التسلسلي"],
        })
        .all();

      if (assetRecords.length === 0) {
        return NextResponse.json(
          { error: `لم يتم العثور على الأصل برقم ${assetnum}` },
          { status: 400 }
        );
      }
      validAssetIds.push(assetRecords[0].id);
      assets.push({
        id: assetRecords[0].id,
        fields: {
          assetnum: assetRecords[0].fields.assetnum || "غير متوفر",
          "اسم الاصل": assetRecords[0].fields["اسم الاصل"] || "غير معروف",
          "الرقم التسلسلي": assetRecords[0].fields["الرقم التسلسلي"] || "غير متوفر",
        },
      });
    }

    // 5. إنشاء سجل النقل
    const createdRecord = await base("Transfer Requests").create([
      {
        fields: {
          sender_id: [validSenderId],
          receiver_id: [validReceiverId],
          assets: validAssetIds,
          status: "Pending",
          transfer_date: new Date().toISOString(),
          sender_signature: [
            {
              url: signatureUrl,
              filename,
            } as any, // تجاوز فحص TypeScript
          ],
        },
      },
    ]);

    const recordId = createdRecord[0].getId();

    // 6. إنشاء محتوى HTML للإيميل
    const cleanedAssets = assets.map((asset) => ({
      fields: {
        "اسم الاصل": String(asset.fields["اسم الاصل"] || "غير متوفر"),
        assetnum: String(asset.fields.assetnum || "غير متوفر"),
        "الرقم التسلسلي": String(asset.fields["الرقم التسلسلي"] || "غير متوفر"),
      },
    }));

    let logoBase64 = "";
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    try {
      const logoBuffer = await fs.readFile(logoPath);
      logoBase64 = logoBuffer.toString("base64");
    } catch (error) {
      console.error("Error reading logo file:", error);
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>اشعار استلام وتسليم</title>
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
          ${logoBase64 ? `<img src="data:image/png;base64,${logoBase64}" alt="Logo" class="logo" />` : "<div>الشعار غير متوفر</div>"}
        </div>
        <h1>اشعار استلام وتسليم</h1>
        <div class="info">المرسل: ${senderName} (${sender_id})</div>
        <div class="info">المستقبل: ${receiverName} (${receiver_id})</div>
        <div class="info">تاريخ النقل: ${new Date().toLocaleDateString("ar-EG")}</div>
        <div class="info">الأصول المنقولة:</div>
        ${
          cleanedAssets.length > 0
            ? `
              <table>
                <thead>
                  <tr>
                    <th>اسم الأصل</th>
                    <th>رقم الأصل</th>
                    <th>الرقم التسلسلي</th>
                  </tr>
                </thead>
                <tbody>
                  ${cleanedAssets
                    .map(
                      (asset) => `
                        <tr>
                          <td>${asset.fields["اسم الاصل"]}</td>
                          <td>${asset.fields.assetnum}</td>
                          <td>${asset.fields["الرقم التسلسلي"]}</td>
                        </tr>
                      `
                    )
                    .join("")}
                </tbody>
              </table>
            `
            : "<div>لا توجد أصول مرتبطة</div>"
        }
        <div class="signature">
          <div>توقيع المرسل:</div>
          <img src="${signatureUrl}" alt="Signature" />
        </div>
      </body>
      </html>
    `;

    // 7. إنشاء PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });
    await browser.close();

    // 8. إعداد البريد الإلكتروني
    const transporter = nodemailer.createTransport({
      host: "mail.rawaes.com",
      port: 465,
      secure: true,
      auth: {
        user: "HrDoc@rawaes.com",
        pass: process.env.EMAIL_PASSWORD || "a-f09JRnpZOk",
      },
      debug: true,
      logger: true,
    });

    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error("SMTP verification failed:", error);
          reject(error);
        } else {
          console.log("SMTP connection verified successfully:", success);
          resolve(success);
        }
      });
    });

    const mailOptions = {
      from: "HrDoc@rawaes.com",
      to: `${senderEmail},${receiverEmail},hrdoc@rawaes.com`,
      subject: "اشعار استلام وتسليم",
      text: "مرحبًا،\n\nمرفق مع هذا البريد اشعار استلام وتسليم.\n\nشكرًا!",
      attachments: [
        {
          filename: "transfer_request.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    // 9. إرسال الإيميل
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    return NextResponse.json(
      {
        message: "تم إنشاء طلب النقل وإرسال الإيميل بنجاح",
        record_id: recordId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "فشل في إنشاء طلب النقل: " + error.message },
      { status: 500 }
    );
  }
}

// دالة PATCH لتحديث الحالة
export async function PATCH(req: NextRequest) {
  try {
    console.log("PATCH request received at /api/transfer");
    const body = await req.json();
    console.log("Received PATCH body:", body);

    const { requestId, status, receiverSignature, reasonRejection } = body;

    // التحقق من صحة البيانات المدخلة
    console.log("Validating input data...");
    if (!requestId || !status || !["Accepted", "Rejected"].includes(status)) {
      console.log("Validation failed: Invalid requestId or status");
      return NextResponse.json(
        {
          error: "معرف الطلب والحالة مطلوبان، ويجب أن تكون الحالة 'Accepted' أو 'Rejected'",
        },
        { status: 400 }
      );
    }

    if (!receiverSignature) {
      console.log("Validation failed: Receiver signature is missing");
      return NextResponse.json({ error: "توقيع المستلم مطلوب" }, { status: 400 });
    }

    if (status === "Rejected" && !reasonRejection) {
      console.log("Validation failed: Reason for rejection is missing");
      return NextResponse.json(
        { error: "سبب الرفض مطلوب عند رفض الطلب" },
        { status: 400 }
      );
    }
    console.log("Input validation passed");

    // رفع توقيع المستلم إلى DigitalOcean Spaces
    console.log("Uploading receiver signature...");
    let signatureUrl;
    try {
      signatureUrl = await uploadImageToSpaces(receiverSignature);
      console.log("Receiver signature uploaded successfully:", signatureUrl);
    } catch (uploadError) {
      console.error("Error uploading receiver signature:", uploadError);
      return NextResponse.json(
        { error: "فشل في رفع توقيع المستلم" },
        { status: 500 }
      );
    }

    // جلب سجل الطلب من Airtable
    console.log("Fetching transfer record from Airtable...");
    let transferRecord;
    try {
      transferRecord = await base("Transfer Requests").find(requestId);
      console.log("Transfer record fetched successfully:", transferRecord);
    } catch (airtableError) {
      console.error("Error fetching transfer record:", airtableError);
      return NextResponse.json(
        { error: "فشل في جلب سجل الطلب من Airtable" },
        { status: 500 }
      );
    }

    if (!transferRecord) {
      console.log("Transfer record not found for requestId:", requestId);
      return NextResponse.json(
        { error: "لم يتم العثور على طلب النقل" },
        { status: 404 }
      );
    }

    const receiverIds = transferRecord.fields.receiver_id as string[];
    const senderIds = transferRecord.fields.sender_id as string[];
    const assetIds = transferRecord.fields.assets as string[];

    if (!receiverIds?.length || !senderIds?.length) {
      console.log("Sender or receiver IDs missing in transfer record");
      return NextResponse.json(
        { error: "لم يتم العثور على المرسل أو المستقبل في سجل الطلب" },
        { status: 400 }
      );
    }

    // جلب بيانات المرسل من Airtable
    console.log("Fetching sender records...");
    let senderRecords;
    try {
      senderRecords = await base("Users")
        .select({
          filterByFormula: `RECORD_ID() = '${senderIds[0]}'`,
          maxRecords: 1,
          fields: ["empid", "name", "email"],
        })
        .all();
      console.log("Sender records fetched:", senderRecords);
    } catch (airtableError) {
      console.error("Error fetching sender record:", airtableError);
      return NextResponse.json(
        { error: "فشل في جلب بيانات المرسل من Airtable" },
        { status: 500 }
      );
    }

    const senderName = senderRecords.length
      ? String(senderRecords[0].fields.name || "غير معروف")
      : "غير معروف";
    const senderEmail = senderRecords.length
      ? String(senderRecords[0].fields.email || "")
      : "";

    // جلب بيانات المستقبل من Airtable
    console.log("Fetching receiver records...");
    let receiverRecords;
    try {
      receiverRecords = await base("Users")
        .select({
          filterByFormula: `RECORD_ID() = '${receiverIds[0]}'`,
          maxRecords: 1,
          fields: ["empid", "name", "email"],
        })
        .all();
      console.log("Receiver records fetched:", receiverRecords);
    } catch (airtableError) {
      console.error("Error fetching receiver record:", airtableError);
      return NextResponse.json(
        { error: "فشل في جلب بيانات المستقبل من Airtable" },
        { status: 500 }
      );
    }

    if (!receiverRecords.length || !receiverRecords[0].fields.email) {
      console.warn("No email found for receiver");
      return NextResponse.json(
        { error: "البريد الإلكتروني للمستقبل غير متوفر" },
        { status: 400 }
      );
    }
    const receiverEmail = String(receiverRecords[0].fields.email);
    const receiverName = String(receiverRecords[0].fields.name || "غير معروف");

    // جلب تفاصيل الأصول من Airtable
    console.log("Fetching asset records...");
    let assetRecords;
    try {
      assetRecords = assetIds?.length
        ? await base("قائمة الاصول")
            .select({
              filterByFormula: `OR(${assetIds
                .map((id) => `RECORD_ID() = '${id}'`)
                .join(",")})`,
              maxRecords: assetIds.length,
              fields: ["assetnum", "اسم الاصل", "الرقم التسلسلي"],
            })
            .all()
        : [];
      console.log("Asset records fetched:", assetRecords);
    } catch (airtableError) {
      console.error("Error fetching asset records:", airtableError);
      return NextResponse.json(
        { error: "فشل في جلب بيانات الأصول من Airtable" },
        { status: 500 }
      );
    }

    const assets = assetRecords.map((asset) => ({
      id: asset.id,
      fields: {
        assetnum: asset.fields.assetnum || "غير متوفر",
        "اسم الاصل": asset.fields["اسم الاصل"] || "غير معروف",
        "الرقم التسلسلي": asset.fields["الرقم التسلسلي"] || "غير متوفر",
      },
    }));

    // تحديث سجل الطلب في Airtable
    console.log("Updating transfer record in Airtable...");
    let updatedRecord;
    try {
      updatedRecord = await base("Transfer Requests").update([
        {
          id: requestId,
          fields: {
            status,
            receiver_signature: [
              {
                url: signatureUrl,
                filename: `signature-${Date.now()}.png`,
              } as any,
            ],
            ReasonRejection: status === "Rejected" ? reasonRejection : undefined,
          },
        },
      ]);
      console.log("Transfer record updated successfully:", updatedRecord);
    } catch (updateError) {
      console.error("Error updating transfer record:", updateError);
      return NextResponse.json(
        { error: "فشل في تحديث سجل الطلب في Airtable" },
        { status: 500 }
      );
    }

    // إنشاء محتوى HTML للإيميل
    console.log("Preparing email HTML content...");
    const cleanedAssets = assets.map((asset) => ({
      fields: {
        "اسم الاصل": String(asset.fields["اسم الاصل"] || "غير متوفر"),
        assetnum: String(asset.fields.assetnum || "غير متوفر"),
        "الرقم التسلسلي": String(asset.fields["الرقم التسلسلي"] || "غير متوفر"),
      },
    }));

    let logoBase64 = "";
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    try {
      const logoBuffer = await fs.readFile(logoPath);
      logoBase64 = logoBuffer.toString("base64");
      console.log("Logo file read successfully");
    } catch (error) {
      console.error("Error reading logo file:", error);
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تحديث حالة طلب نقل</title>
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
        </style>
      </head>
      <body>
        <div class="header">
          ${logoBase64 ? `<img src="data:image/png;base64,${logoBase64}" alt="Logo" class="logo" />` : "<div>الشعار غير متوفر</div>"}
        </div>
        <h1>تحديث حالة طلب نقل</h1>
        <div class="info">رقم الطلب: ${transferRecord.fields.id}</div>
        <div class="info">المرسل: ${senderName}</div>
        <div class="info">المستقبل: ${receiverName}</div>
        <div class="info">الحالة: ${status === "Accepted" ? "مقبول" : "مرفوض"}</div>
        ${status === "Rejected" ? `<div class="info">سبب الرفض: ${reasonRejection}</div>` : ""}
        <div class="info">الأصول المنقولة:</div>
        ${
          cleanedAssets.length > 0
            ? `
              <table>
                <thead>
                  <tr>
                    <th>اسم الأصل</th>
                    <th>رقم الأصل</th>
                    <th>الرقم التسلسلي</th>
                  </tr>
                </thead>
                <tbody>
                  ${cleanedAssets
                    .map(
                      (asset) => `
                        <tr>
                          <td>${asset.fields["اسم الاصل"]}</td>
                          <td>${asset.fields.assetnum}</td>
                          <td>${asset.fields["الرقم التسلسلي"]}</td>
                        </tr>
                      `
                    )
                    .join("")}
                </tbody>
              </table>
            `
            : "<div>لا توجد أصول مرتبطة</div>"
        }
        <div class="signature">
          <div>توقيع المستلم:</div>
          <img src="${signatureUrl}" alt="Receiver Signature" />
        </div>
      </body>
      </html>
    `;

    // إنشاء PDF باستخدام Puppeteer
    console.log("Generating PDF...");
    let pdfBuffer;
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });
      pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
      });
      await browser.close();
      console.log("PDF generated successfully, size:", pdfBuffer.length);
    } catch (pdfError) {
      console.error("Error generating PDF:", pdfError);
      return NextResponse.json(
        { error: "فشل في إنشاء ملف PDF" },
        { status: 500 }
      );
    }

    // إعداد البريد الإلكتروني باستخدام Nodemailer
    console.log("Setting up email transporter...");
    console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "Defined" : "Undefined");
    const transporter = nodemailer.createTransport({
      host: "mail.rawaes.com",
      port: 465,
      secure: true,
      auth: {
        user: "HrDoc@rawaes.com",
        pass: process.env.EMAIL_PASSWORD || "a-f09JRnpZOk",
      },
      debug: true,
      logger: true,
    });

    // التحقق من اتصال SMTP
    console.log("Verifying SMTP connection...");
    try {
      await new Promise((resolve, reject) => {
        transporter.verify((error, success) => {
          if (error) {
            console.error("SMTP verification failed:", error);
            reject(error);
          } else {
            console.log("SMTP connection verified successfully:", success);
            resolve(success);
          }
        });
      });
    } catch (verifyError) {
      console.error("SMTP verification error:", verifyError);
      return NextResponse.json(
        { error: "فشل في التحقق من اتصال SMTP" },
        { status: 500 }
      );
    }

    const mailOptions = {
      from: "HrDoc@rawaes.com",
      to: `${receiverEmail},hrdoc@rawaes.com`,
      subject: `تحديث حالة طلب استلام وتسليم (${status === "Accepted" ? "مقبول" : "مرفوض"})`,
      text: `مرحبًا،\n\nتم تحديث حالة طلب الاستلام والتسليم رقم ${transferRecord.fields.id || requestId} إلى "${
        status === "Accepted" ? "مقبول" : "مرفوض"
      }". مرفق مع هذا البريد تفاصيل الطلب.\n\nشكرًا!`,
      attachments: [
        {
          filename: "transfer_status_update.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };
    console.log("Email options prepared:", mailOptions);

    // إرسال البريد الإلكتروني
    console.log("Attempting to send email...");
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.messageId, "Response:", info.response);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      return NextResponse.json(
        { error: "تم تحديث الحالة لكن فشل إرسال الإيميل" },
        { status: 500 }
      );
    }

    console.log("PATCH operation completed successfully");
    return NextResponse.json(
      {
        message: `تم تحديث حالة الطلب إلى ${status} وإرسال الإيميل بنجاح`,
        record_id: updatedRecord[0].id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in PATCH request:", error);
    return NextResponse.json(
      { error: "فشل في تحديث حالة الطلب: " + error.message },
      { status: 500 }
    );
  }
}

// دالة مساعدة لتحويل Base64 إلى Blob
function base64ToBlob(base64: string): Blob {
  const byteString = atob(base64.split(",")[1]);
  const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}