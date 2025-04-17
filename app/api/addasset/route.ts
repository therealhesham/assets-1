

// import { NextRequest, NextResponse } from 'next/server';
// import Airtable from 'airtable';

// const base = new Airtable({ apiKey: 'pathInbmmQ2GimI5Q.6994f95d5d0f915839960010ca25d49fe1d152b2d2be189a4508947684511e91' }).base('appwChimKKH5U0rtH');

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const query = searchParams.get('query');
//     const serial = searchParams.get('serial');
//     const type = searchParams.get('type');

//     // البحث بناءً على الرقم التسلسلي
//     if (serial) {
//       const records = await base('قائمة الاصول')
//         .select({
//           filterByFormula: `{الرقم التسلسلي} = "${serial}"`,
//           maxRecords: 10,
//         })
//         .all();

//       const results = records.map((record) => ({
//         id: record.id,
//         fields: record.fields,
//       }));

//       return new NextResponse(JSON.stringify(results), { status: 200 });
//     }

//     // البحث بناءً على رقم الأصل
//     if (query && !isNaN(Number(query))) {
//       const records = await base('قائمة الاصول')
//         .select({
//           filterByFormula: `{assetnum} = ${query}`,
//           maxRecords: 10,
//         })
//         .all();

//       if (records.length === 0) {
//         return new NextResponse(JSON.stringify({ message: 'لم يتم العثور على عهدة برقم الأصل المدخل' }), { status: 404 });
//       }

//       const results = records.map((record) => ({
//         id: record.id,
//         fields: record.fields,
//       }));

//       return new NextResponse(JSON.stringify(results), { status: 200 });
//     }

//     // البحث بناءً على نوع الأصل (مثل "75" للماوس)
//     if (type && /^\d{1,2}$/.test(type)) {
//       let filterFormula;
//       const firstDigit = type.charAt(0);
//       const secondDigit = type.length > 1 ? type.charAt(1) : null;

//       if (firstDigit === '4') {
//         // جوال (40xx-44xx) أو تابلت (45xx-49xx)
//         if (secondDigit && secondDigit >= '0' && secondDigit <= '4') {
//           filterFormula = `AND({assetnum} >= 4000, {assetnum} <= 4499)`;
//         } else if (secondDigit && secondDigit >= '5' && secondDigit <= '9') {
//           filterFormula = `AND({assetnum} >= 4500, {assetnum} <= 4999)`;
//         } else {
//           filterFormula = `AND({assetnum} >= 4000, {assetnum} <= 4999)`;
//         }
//       } else if (firstDigit === '7') {
//         // كيبورد (70xx-74xx) أو ماوس (75xx-79xx)
//         if (secondDigit && secondDigit >= '0' && secondDigit <= '4') {
//           filterFormula = `AND({assetnum} >= 7000, {assetnum} <= 7499)`;
//         } else if (secondDigit && secondDigit >= '5' && secondDigit <= '9') {
//           filterFormula = `AND({assetnum} >= 7500, {assetnum} <= 7999)`;
//         } else {
//           filterFormula = `AND({assetnum} >= 7000, {assetnum} <= 7999)`;
//         }
//       } else if (firstDigit === '8' || firstDigit === '9') {
//         // أنواع تحتاج إلى أول رقمين (مثل 81 للطابعة)
//         if (secondDigit) {
//           const typePrefix = Number(firstDigit + secondDigit) * 100;
//           filterFormula = `AND({assetnum} >= ${typePrefix}, {assetnum} <= ${typePrefix + 99})`;
//         } else {
//           return new NextResponse(JSON.stringify({ error: 'نوع الأصل يتطلب رقمين (مثل 81 للطابعة)' }), { status: 400 });
//         }
//       } else {
//         // أنواع تعتمد على الرقم الأول فقط (مثل 1xxx للكمبيوتر)
//         const typePrefix = Number(firstDigit) * 1000;
//         filterFormula = `AND({assetnum} >= ${typePrefix}, {assetnum} <= ${typePrefix + 999})`;
//       }

//       const records = await base('قائمة الاصول')
//         .select({
//           filterByFormula: filterFormula,
//           sort: [{ field: 'assetnum', direction: 'desc' }],
//           maxRecords: 1, // إرجاع أحدث أصل فقط
//         })
//         .all();

//       if (records.length === 0) {
//         return new NextResponse(JSON.stringify({ message: 'لم يتم العثور على أصول من هذا النوع' }), { status: 404 });
//       }

//       const results = records.map((record) => ({
//         id: record.id,
//         fields: record.fields,
//       }));

//       return new NextResponse(JSON.stringify(results), { status: 200 });
//     }

//     // جلب جميع الأصول إذا لم يتم تحديد استعلام
//     const records = await base('قائمة الاصول')
//       .select({
//         maxRecords: 100,
//         sort: [{ field: 'assetnum', direction: 'asc' }],
//       })
//       .all();

//     const results = records.map((record) => ({
//       id: record.id,
//       fields: record.fields,
//     }));

//     return new NextResponse(JSON.stringify(results), { status: 200 });
//   } catch (error) {
//     console.error('خطأ في GET:', error);
//     return new NextResponse(JSON.stringify({ error: 'حدث خطأ أثناء البحث: ' + error.message }), { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { assetnum, assetName, serialNumber, manufacturer, specifications, assetCondition } = body;

//     if (!assetnum || !assetName || !serialNumber || !specifications || !assetCondition) {
//       return new NextResponse(
//         JSON.stringify({ error: 'جميع الحقول (رقم الأصل، اسم الأصل، الرقم التسلسلي، المواصفات، حالة الأصل) مطلوبة' }),
//         { status: 400 }
//       );
//     }

//     const existingRecords = await base('قائمة الاصول')
//       .select({
//         filterByFormula: `{assetnum} = ${assetnum}`,
//         maxRecords: 1,
//       })
//       .all();

//     if (existingRecords.length > 0) {
//       return new NextResponse(JSON.stringify({ error: 'رقم الأصل موجود مسبقًا، يرجى اختيار رقم آخر' }), { status: 409 });
//     }

//     const createdRecords = await base('قائمة الاصول').create([
//       {
//         fields: {
//           assetnum: Number(assetnum),
//           'اسم الاصل': assetName,
//           'الرقم التسلسلي': serialNumber,
//           'الشركة المصنعة': manufacturer || '',
//           'مواصفات اضافية ': specifications,
//           'حالة الاصل': assetCondition || '',
//         },
//       },
//     ]);

//     return new NextResponse(JSON.stringify({ message: 'تمت إضافة الأصل بنجاح', id: createdRecords[0].getId() }), { status: 200 });
//   } catch (error) {
//     console.error('خطأ في POST:', error);
//     return new NextResponse(JSON.stringify({ error: 'فشل في إضافة الأصل: ' + error.message }), { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: 'pathInbmmQ2GimI5Q.6994f95d5d0f915839960010ca25d49fe1d152b2d2be189a4508947684511e91' }).base('appwChimKKH5U0rtH');

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const serial = searchParams.get('serial');
    const type = searchParams.get('type');

    if (serial) {
      const records = await base('قائمة الاصول')
        .select({
          filterByFormula: `{الرقم التسلسلي} = "${serial}"`,
          maxRecords: 10,
        })
        .all();

      const results = records.map((record) => ({
        id: record.id,
        fields: record.fields,
      }));

      return new NextResponse(JSON.stringify(results), { status: 200 });
    }

    if (query && !isNaN(Number(query))) {
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
    }

    if (type && /^\d{1,2}$/.test(type)) {
      let filterFormula;
      const firstDigit = type.charAt(0);
      const secondDigit = type.length > 1 ? type.charAt(1) : null;

      if (firstDigit === '4') {
        if (secondDigit && secondDigit >= '0' && secondDigit <= '4') {
          filterFormula = `AND({assetnum} >= 4000, {assetnum} <= 4499)`;
        } else if (secondDigit && secondDigit >= '5' && secondDigit <= '9') {
          filterFormula = `AND({assetnum} >= 4500, {assetnum} <= 4999)`;
        } else {
          filterFormula = `AND({assetnum} >= 4000, {assetnum} <= 4999)`;
        }
      } else if (firstDigit === '7') {
        if (secondDigit && secondDigit >= '0' && secondDigit <= '4') {
          filterFormula = `AND({assetnum} >= 7000, {assetnum} <= 7499)`;
        } else if (secondDigit && secondDigit >= '5' && secondDigit <= '9') {
          filterFormula = `AND({assetnum} >= 7500, {assetnum} <= 7999)`;
        } else {
          filterFormula = `AND({assetnum} >= 7000, {assetnum} <= 7999)`;
        }
      } else if (firstDigit === '8' || firstDigit === '9') {
        if (secondDigit) {
          const typePrefix = Number(firstDigit + secondDigit) * 100;
          filterFormula = `AND({assetnum} >= ${typePrefix}, {assetnum} <= ${typePrefix + 99})`;
        } else {
          return new NextResponse(JSON.stringify({ error: 'نوع الأصل يتطلب رقمين (مثل 81 للطابعة)' }), { status: 400 });
        }
      } else {
        const typePrefix = Number(firstDigit) * 1000;
        filterFormula = `AND({assetnum} >= ${typePrefix}, {assetnum} <= ${typePrefix + 999})`;
      }

      const records = await base('قائمة الاصول')
        .select({
          filterByFormula: filterFormula,
          sort: [{ field: 'assetnum', direction: 'desc' }],
          maxRecords: 1,
        })
        .all();

      if (records.length === 0) {
        return new NextResponse(JSON.stringify({ message: 'لم يتم العثور على أصول من هذا النوع' }), { status: 404 });
      }

      const results = records.map((record) => ({
        id: record.id,
        fields: record.fields,
      }));

      return new NextResponse(JSON.stringify(results), { status: 200 });
    }

    const records = await base('قائمة الاصول')
      .select({
        maxRecords: 100,
        sort: [{ field: 'assetnum', direction: 'asc' }],
      })
      .all();

    const results = records.map((record) => ({
      id: record.id,
      fields: record.fields,
    }));

    return new NextResponse(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error('خطأ في GET:', error);
    return new NextResponse(JSON.stringify({ error: 'حدث خطأ أثناء البحث: ' + error.message }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { assetnum, assetName, serialNumber, manufacturer, specifications, assetCondition } = body;

    if (!assetnum || !assetName || !serialNumber || !specifications || !assetCondition) {
      return new NextResponse(
        JSON.stringify({ error: 'جميع الحقول (رقم الأصل، اسم الأصل، الرقم التسلسلي، المواصفات، حالة الأصل) مطلوبة' }),
        { status: 400 }
      );
    }

    const existingRecords = await base('قائمة الاصول')
      .select({
        filterByFormula: `{assetnum} = ${assetnum}`,
        maxRecords: 1,
      })
      .all();

    if (existingRecords.length > 0) {
      return new NextResponse(JSON.stringify({ error: 'رقم الأصل موجود مسبقًا، يرجى اختيار رقم آخر' }), { status: 409 });
    }

    // تخطي التحقق من تكرار الرقم التسلسلي إذا كان "NO SN" لكيبل نت أو HDMI
    if (serialNumber !== 'NO SN') {
      const existingSerialRecords = await base('قائمة الاصول')
        .select({
          filterByFormula: `{الرقم التسلسلي} = "${serialNumber}"`,
          maxRecords: 1,
        })
        .all();

      if (existingSerialRecords.length > 0) {
        return new NextResponse(JSON.stringify({ error: 'الرقم التسلسلي مستخدم بالفعل' }), { status: 409 });
      }
    }

    const createdRecords = await base('قائمة الاصول').create([
      {
        fields: {
          assetnum: Number(assetnum),
          'اسم الاصل': assetName,
          'الرقم التسلسلي': serialNumber,
          'الشركة المصنعة': manufacturer || '',
          'مواصفات اضافية ': specifications,
          'حالة الاصل': assetCondition || '',
        },
      },
    ]);

    return new NextResponse(JSON.stringify({ message: 'تمت إضافة الأصل بنجاح', id: createdRecords[0].getId() }), { status: 200 });
  } catch (error) {
    console.error('خطأ في POST:', error);
    return new NextResponse(JSON.stringify({ error: 'فشل في إضافة الأصل: ' + error.message }), { status: 500 });
  }
}