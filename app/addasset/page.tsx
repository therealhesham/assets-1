

// 'use client';

// import { useState, useEffect } from 'react';
// import dynamic from 'next/dynamic';
// const Select = dynamic(() => import('react-select'), { ssr: false });
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { ClipLoader } from 'react-spinners';
// import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
// import { Tooltip } from 'react-tooltip';

// const companies = [
//   { value: 'dell | ديل', label: 'Dell | ديل' },
//   { value: 'hp | اتش بي', label: 'HP | اتش بي' },
//   { value: 'lenovo | لينوفو', label: 'Lenovo | لينوفو' },
//   { value: 'apple | ابل', label: 'Apple | ابل' },
//   { value: 'asus | ايسوس', label: 'Asus | ايسوس' },
//   { value: 'grandstream | جراندستريم', label: 'Grandstream | جراندستريم' },
//   { value: 'epson | ايبسون', label: 'Epson | ايبسون' },
//   { value: 'benq | بنكيو', label: 'BENQ | بنكيو' },
//   { value: 'hikvision | هايك فيجن', label: 'Hikvision | هايك فيجن' },
//   { value: 'LG | ال جي', label: 'LG | ال جي' },
//   { value: 'acer | ايسر', label: 'Acer | ايسر' },
//   { value: 'canon | كانون', label: 'Canon | كانون' },
//   { value: 'toshiba | توشيبا', label: 'Toshiba | توشيبا' },
//   { value: 'd-link | دي-لينك', label: 'D-Link | دي-لينك' },
//   { value: 'fanvil | فانفيل', label: 'Fanvil | فانفيل' },
//   { value: 'yealink | ييلينك', label: 'Yealink | ييلينك' },
//   { value: 'MICROSOFT | مايكروسوفت', label: 'MICROSOFT | مايكروسوفت' },
//   { value: 'zkteco | زكتيكو', label: 'ZKTeco | زكتيكو' },
//   { value: 'atlas | أطلس', label: 'ATLAS | أطلس' },
//   { value: 'datazone | داتازون', label: 'DATAZONE | داتازون' },
//   { value: 'draytek | درايتك', label: 'DRAYTEK | درايتك' },
//   { value: 'tplink | تي بي لينك', label: 'TPLINK | تي بي لينك' },
//   { value: 'nanobeam | نانوبيم', label: 'NANOBEAM | نانوبيم' },
//   { value: 'creative | كرييتف', label: 'CREATIVE | كرييتف' },
//   { value: 'Dahua | دهوا', label: 'Dahua | دهوا' },
//   { value: 'LOGI | لوجيتك', label: 'LOGI | لوجيتك' },
//   { value: 'SAMSUNG | سامسونج', label: 'SAMSUNG | سامسونج' },
//   { value: 'Western Digital | ويسترن ديجيتل', label: 'Western Digital | ويسترن ديجيتل' },
//   { value: 'Lexar | ليكسر', label: 'Lexar | ليكسر' },
//   { value: 'SanDisk | سان ديسك', label: 'SanDisk | سان ديسك' },
//   { value: 'STC | إس تي سي', label: 'STC | إس تي سي' },
//   { value: 'Zain | زين', label: 'Zain | زين' },
//   { value: 'Mobily | موبايلي', label: 'Mobily | موبايلي' },
//   { value: 'other | شركة أخرى', label: 'Other | شركة أخرى' },
// ];

// const assetConditions = [
//   { value: 'جديد', label: 'جديد' },
//   { value: 'بحاجة صيانة', label: 'بحاجة صيانة' },
//   { value: 'مخزن', label: 'مخزن' },
// ];

// export default function AddAsset() {
//   const [assetNumber, setAssetNumber] = useState('');
//   const [name, setName] = useState('');
//   const [serialNumber, setSerialNumber] = useState('');
//   const [manufacturer, setManufacturer] = useState(null);
//   const [assetCondition, setAssetCondition] = useState(null);
//   const [specFields, setSpecFields] = useState([]);
//   const [specValues, setSpecValues] = useState({});
//   const [checkboxValues, setCheckboxValues] = useState({ charger: false, bag: false });
//   const [loading, setLoading] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(false);
//   const [lastAssetNumber, setLastAssetNumber] = useState(null); // حالة جديدة لتخزين رقم آخر أصل

//   const getAssetNameFromNumber = (number) => {
//     if (!number || number.length < 1) return 'غير محدد';
//     const firstDigit = number.charAt(0);
//     const secondDigit = number.charAt(1);

//     switch (firstDigit) {
//       case '1':
//         return 'جهاز كمبيوتر';
//       case '2':
//         return 'لاب توب';
//       case '3':
//         return 'شاشة كمبيوتر';
//       case '4':
//         if (secondDigit >= '0' && secondDigit <= '4') return 'جوال';
//         if (secondDigit >= '5' && secondDigit <= '9') return 'تابلت';
//         return 'غير محدد';
//       case '5':
//         return 'شريحة اتصال';
//       case '6':
//         return 'تليفون شبكة';
//       case '7':
//         if (secondDigit >= '0' && secondDigit <= '4') return 'كيبورد';
//         if (secondDigit >= '5' && secondDigit <= '9') return 'ماوس';
//         return 'غير محدد';
//       case '8':
//         switch (secondDigit) {
//           case '1':
//             return 'طابعة';
//           case '2':
//             return 'سويتشات';
//           case '3':
//             return 'كيبل نت';
//           case '4':
//             return 'كيبل HDMI';
//           case '5':
//             return 'كاميرات';
//           case '6':
//             return 'جهاز DVR';
//           case '7':
//             return 'اكسس بوينت';
//           case '8':
//             return 'سماعات';
//           case '9':
//             return 'عدة صيانة';
//           default:
//             return 'غير محدد';
//         }
//       case '9':
//         switch (secondDigit) {
//           case '1':
//             return 'جهاز نقل الألياف';
//           case '2':
//             return 'جهاز بصمة';
//           case '3':
//             return 'وحدات تخزين';
//           case '4':
//             return 'أجهزة مكتبية';
//           default:
//             return 'غير محدد';
//         }
//       default:
//         return 'غير محدد';
//     }
//   };

//   const getDefaultSpecifications = (number) => {
//     if (!number || number.length < 1) return [];
//     const firstDigit = number.charAt(0);
//     const secondDigit = number.charAt(1);

//     switch (firstDigit) {
//       case '1':
//         return [
//           { label: 'المعالج | Processor :', key: 'Processor', type: 'text' },
//           { label: 'الرام | RAM :', key: 'Ram', type: 'text' },
//           { label: 'التخزين | Storage:', key: 'Storage', type: 'text' },
//         ];
//       case '2':
//         return [
//           { label: 'المعالج | Processor :', key: 'Processor', type: 'text' },
//           { label: 'الرام | RAM :', key: 'Ram', type: 'text' },
//           { label: 'التخزين | Storage:', key: 'Storage', type: 'text' },
//           { label: 'الشاحن | Charger :', key: 'Charger', type: 'checkbox' },
//           { label: 'الشنطة | Bag :', key: 'Bag', type: 'checkbox' },
//         ];
//       case '3':
//         return [{ label: 'الحجم | Size :', key: 'Size', type: 'text' }];
//       case '4':
//         if (secondDigit >= '0' && secondDigit <= '4') {
//           return [
//             { label: 'الطراز | Model :', key: 'Model', type: 'text' },
//             { label: 'التخزين | Storage:', key: 'Storage', type: 'text' },
//             { label: 'الرام | RAM :', key: 'Ram', type: 'text' },
//             { label: 'الشاحن | Charger :', key: 'Charger', type: 'checkbox' },
//           ];
//         }
//         if (secondDigit >= '5' && secondDigit <= '9') {
//           return [
//             { label: 'الطراز | Model :', key: 'Model', type: 'text' },
//             { label: 'التخزين | Storage:', key: 'Storage', type: 'text' },
//             { label: 'الرام | RAM :', key: 'Ram', type: 'text' },
//             { label: 'الشاحن | Charger :', key: 'Charger', type: 'checkbox' },
//           ];
//         }
//         return [];
//       case '5':
//         return [{ label: 'رقم الشريحة | SIM Number :', key: 'SimNumber', type: 'text' }];
//       case '6':
//         return [{ label: 'الطراز | MODLE :', key: 'MODLE', type: 'text' }];
//       case '7':
//         if (secondDigit >= '0' && secondDigit <= '4') {
//           return [{ label: ' النوع | Type :', key: 'Type', type: 'text' }];
//         }
//         if (secondDigit >= '5' && secondDigit <= '9') {
//           return [{ label: ' النوع | Type :', key: 'Type', type: 'text' }];
//         }
//         return [];
//       case '8':
//         switch (secondDigit) {
//           case '1':
//             return [
//               { label: 'الطراز | Model :', key: 'Model', type: 'text' },
//               { label: 'نوع الحبر | Ink Type :', key: 'InkType', type: 'text' },
//             ];
//           case '2':
//             return [
//               { label: 'عدد المنافذ | Ports :', key: 'Ports', type: 'text' },
//               { label: 'السرعة | Speed :', key: 'Speed', type: 'text' },
//             ];
//           case '3':
//             return [{ label: 'الطول | Length :', key: 'Length', type: 'text' }];
//           case '4':
//             return [{ label: 'الطول | Length :', key: 'Length', type: 'text' }];
//           case '5':
//             return [
//               { label: 'الدقة | Resolution :', key: 'Resolution', type: 'text' },
//               { label: 'الطراز | Model :', key: 'Model', type: 'text' },
//             ];
//           case '6':
//             return [
//               { label: 'عدد القنوات | Channels :', key: 'Channels', type: 'text' },
//               { label: 'التخزين | Storage :', key: 'Storage', type: 'text' },
//             ];
//           case '7':
//             return [{ label: 'السرعة | Speed :', key: 'Speed', type: 'text' }];
//           case '8':
//             return [{ label: 'النوع | Type :', key: 'Type', type: 'text' }];
//           case '9':
//             return [{ label: 'النوع | Type :', key: 'Type', type: 'text' }];
//           default:
//             return [];
//         }
//       case '9':
//         switch (secondDigit) {
//           case '1':
//             return [
//               { label: 'السرعة | Speed :', key: 'Speed', type: 'text' },
//               { label: 'النوع | Type :', key: 'Type', type: 'text' },
//             ];
//           case '2':
//             return [{ label: 'الطراز | Model :', key: 'Model', type: 'text' }];
//           case '3':
//             return [
//               { label: 'السعة | Capacity :', key: 'Capacity', type: 'text' },
//               { label: 'النوع | Type :', key: 'Type', type: 'text' },
//             ];
//           case '4':
//             return [
//               { label: 'النوع | Type :', key: 'Type', type: 'text' },
//               { label: 'اين الاستخدام ؟| Usage :', key: 'Usage', type: 'text' },
//             ];
//           default:
//             return [];
//         }
//       default:
//         return [];
//     }
//   };

//   // دالة لجلب آخر أصل من نفس النوع
//   const fetchLastAsset = async (number) => {
//     if (!number || number.length < 2) {
//       setLastAssetNumber(null);
//       return;
//     }

//     try {
//       // جلب جميع الأصول
//       const response = await fetch('/api/addasset');
//       if (!response.ok) {
//         console.error('فشل في جلب الأصول:', response.statusText);
//         setLastAssetNumber(null);
//         return;
//       }

//       const assets = await response.json();
//       const firstDigit = number.charAt(0);
//       const secondDigit = number.charAt(1);

//       // تصفية الأصول بناءً على نوع الأصل
//       const filteredAssets = assets.filter((asset) => {
//         const assetNum = asset.fields.assetnum.toString().padStart(4, '0');
//         const assetFirstDigit = assetNum.charAt(0);
//         const assetSecondDigit = assetNum.charAt(1);

//         if (firstDigit === '4') {
//           return assetFirstDigit === '4' && (
//             (secondDigit >= '0' && secondDigit <= '4' && assetSecondDigit >= '0' && assetSecondDigit <= '4') ||
//             (secondDigit >= '5' && secondDigit <= '9' && assetSecondDigit >= '5' && assetSecondDigit <= '9')
//           );
//         }
//         if (firstDigit === '7') {
//           return assetFirstDigit === '7' && (
//             (secondDigit >= '0' && secondDigit <= '4' && assetSecondDigit >= '0' && assetSecondDigit <= '4') ||
//             (secondDigit >= '5' && secondDigit <= '9' && assetSecondDigit >= '5' && assetSecondDigit <= '9')
//           );
//         }
//         if (firstDigit === '8' || firstDigit === '9') {
//           return assetFirstDigit === firstDigit && assetSecondDigit === secondDigit;
//         }
//         return assetFirstDigit === firstDigit;
//       });

//       // ترتيب الأصول حسب رقم الأصل (من الأحدث إلى الأقدم)
//       const sortedAssets = filteredAssets.sort((a, b) => b.fields.assetnum - a.fields.assetnum);

//       // اختيار أول أصل (الأحدث)
//       if (sortedAssets.length > 0) {
//         setLastAssetNumber(sortedAssets[0].fields.assetnum.toString().padStart(4, '0'));
//       } else {
//         setLastAssetNumber(null);
//       }
//     } catch (error) {
//       console.error('خطأ أثناء جلب آخر أصل:', error);
//       setLastAssetNumber(null);
//     }
//   };

//   useEffect(() => {
//     if (assetNumber) {
//       const assetName = getAssetNameFromNumber(assetNumber);
//       setName(assetName);
//       const defaultSpecs = getDefaultSpecifications(assetNumber);
//       setSpecFields(defaultSpecs);
//       const newSpecValues = {};
//       const newCheckboxValues = { charger: false, bag: false };
//       defaultSpecs.forEach((field) => {
//         if (field.type === 'text') {
//           newSpecValues[field.key] = specValues[field.key] || '';
//         } else if (field.type === 'checkbox') {
//           newCheckboxValues[field.key.toLowerCase()] = checkboxValues[field.key.toLowerCase()] || false;
//         }
//       });
//       setSpecValues(newSpecValues);
//       setCheckboxValues(newCheckboxValues);

//       // جلب آخر أصل من نفس النوع
//       fetchLastAsset(assetNumber);
//     } else {
//       setName('');
//       setSpecFields([]);
//       setSpecValues({});
//       setCheckboxValues({ charger: false, bag: false });
//       setLastAssetNumber(null);
//     }
//   }, [assetNumber]);

//   const handleSpecChange = (key, value) => {
//     setSpecValues((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const handleCheckboxChange = (key) => {
//     setCheckboxValues((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   const validateForm = () => {
//     if (assetNumber.length !== 4) {
//       setErrorMessage('رقم الأصل يجب أن يكون 4 أرقام بالضبط.');
//       setError(true);
//       return false;
//     }
//     const arabicRegex = /[\u0600-\u06FF]/;
//     if (arabicRegex.test(serialNumber)) {
//       setErrorMessage('الرقم التسلسلي لا يمكن أن يحتوي على حروف عربية.');
//       setError(true);
//       return false;
//     }
//     if (!manufacturer) {
//       setErrorMessage('يرجى اختيار الشركة المصنعة.');
//       setError(true);
//       return false;
//     }
//     if (!assetCondition) {
//       setErrorMessage('يرجى اختيار حالة الأصل.');
//       setError(true);
//       return false;
//     }
//     for (const field of specFields) {
//       if (field.type === 'text' && (!specValues[field.key] || specValues[field.key].trim() === '')) {
//         setErrorMessage('يرجى ملء جميع حقول المواصفات النصية.');
//         setError(true);
//         return false;
//       }
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setIsLoading(true);
//     setErrorMessage('');
//     setSuccess(false);
//     setError(false);

//     if (!validateForm()) {
//       setLoading(false);
//       setIsLoading(false);
//       return;
//     }

//     const assetNumberAsNumber = parseInt(assetNumber, 10);
//     const specifications = specFields
//       .map((field) => {
//         if (field.type === 'text') {
//           return `${field.key}: ${specValues[field.key] || ''}`;
//         } else if (field.type === 'checkbox') {
//           return `${field.key}: ${checkboxValues[field.key.toLowerCase()] ? 'Yes' : 'No'}`;
//         }
//         return '';
//       })
//       .join('\n');

//     const assetData = {
//       assetnum: assetNumberAsNumber,
//       assetName: name,
//       serialNumber: serialNumber,
//       manufacturer: manufacturer ? manufacturer.value : '',
//       assetCondition: assetCondition ? assetCondition.value : '',
//       specifications: specifications,
//     };

//     try {
//       const existingAssetRecords = await fetch(`/api/addasset?query=${assetNumberAsNumber}`).then((res) => res.json());
//       if (existingAssetRecords.length > 0) {
//         setErrorMessage('رقم الأصل مستخدم بالفعل.');
//         setError(true);
//         toast.error('رقم الأصل مستخدم بالفعل.');
//         return;
//       }

//       const existingSerialRecords = await fetch(`/api/addasset?serial=${serialNumber}`).then((res) => res.json());
//       if (existingSerialRecords.length > 0) {
//         setErrorMessage('الرقم التسلسلي مستخدم بالفعل.');
//         setError(true);
//         toast.error('الرقم التسلسلي مستخدم بالفعل.');
//         return;
//       }

//       const res = await fetch('/api/addasset', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(assetData),
//       });

//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(errorText || 'خطأ غير معروف من الخادم');
//       }

//       await res.json();
//       toast.success('تمت إضافة الأصل بنجاح 👏');
//       setAssetNumber('');
//       setSerialNumber('');
//       setManufacturer(null);
//       setAssetCondition(null);
//       setSpecValues({});
//       setCheckboxValues({ charger: false, bag: false });
//       setSuccess(true);
//       setLastAssetNumber(null); // إعادة تعيين بعد الإضافة الناجحة
//     } catch (error) {
//       console.error('خطأ:', error);
//       setErrorMessage(error.message || 'خطأ أثناء إضافة الأصل');
//       setError(true);
//       toast.error(error.message || 'خطأ أثناء إضافة الأصل');
//     } finally {
//       setLoading(false);
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (success || error) {
//       const timer = setTimeout(() => {
//         setSuccess(false);
//         setError(false);
//         setErrorMessage('');
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [success, error]);

//   const handleAssetNumberChange = (e) => {
//     const value = e.target.value;
//     if (value === '' || (value.length <= 4 && /^\d*$/.test(value))) {
//       setAssetNumber(value);
//     }
//   };

//   const handleSerialNumberChange = (e) => {
//     const value = e.target.value;
//     if (/^[a-zA-Z0-9-]*$/.test(value)) {
//       setSerialNumber(value);
//     }
//   };

//   const handleAssetNumberKeyDown = (e) => {
//     const currentValue = e.currentTarget.value;
//     if (
//       currentValue.length >= 4 &&
//       !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
//     ) {
//       e.preventDefault();
//     }
//     if (
//       !/[\d]/.test(e.key) &&
//       !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
//     ) {
//       e.preventDefault();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative">
//       <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
//         <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">إضافة أصل جديد</h2>
//         {errorMessage && (
//           <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center justify-between">
//             <span className="font-medium">{errorMessage}</span>
//           </div>
//         )}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="assetNumber">
//               رقم الأصل{' '}
//               <span
//                 className="inline-block w-4 h-4 text-center bg-gray-300 rounded-full cursor-help"
//                 data-tooltip-id="asset-number-tooltip"
//               >
//                 ?
//               </span>
//             </label>
//             <input
//               type="number"
//               id="assetNumber"
//               name="assetNumber"
//               value={assetNumber}
//               onChange={handleAssetNumberChange}
//               onKeyDown={handleAssetNumberKeyDown}
//               required
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               min="0"
//               max="9999"
//               placeholder="أدخل 4 أرقام فقط"
//             />
//             {lastAssetNumber && (
//               <p className="mt-2 text-sm text-gray-600">
//                 آخر {name} تم إضافته: <span className="font-medium">{lastAssetNumber}</span>
//               </p>
//             )}
//             <Tooltip
//               id="asset-number-tooltip"
//               place="top"
//               style={{
//                 backgroundColor: '#333',
//                 color: '#fff',
//                 direction: 'rtl',
//                 textAlign: 'right',
//                 zIndex: 10000,
//               }}
//             >
//               <div>
//                 أدخل رقمًا مكونًا من 4 أرقام:<br />
//                 1xxx: جهاز كمبيوتر<br />
//                 2xxx: لاب توب<br />
//                 3xxx: شاشة كمبيوتر<br />
//                 40xx-44xx: جوال<br />
//                 45xx-49xx: تابلت<br />
//                 5xxx: شريحة اتصال<br />
//                 6xxx: تليفون شبكة<br />
//                 70xx-74xx: كيبورد<br />
//                 75xx-79xx: ماوس<br />
//                 81xx: طابعة<br />
//                 82xx: سويتشات<br />
//                 83xx: كيبل نت<br />
//                 84xx: كيبل HDMI<br />
//                 85xx: كاميرات<br />
//                 86xx: جهاز DVR<br />
//                 87xx: اكسس بوينت<br />
//                 88xx: سماعات<br />
//                 89xx: عدة صيانة<br />
//                 91xx: جهاز نقل الألياف<br />
//                 92xx: جهاز بصمة<br />
//                 93xx: وحدات تخزين<br />
//                 94xx: أجهزة مكتبية
//               </div>
//             </Tooltip>
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
//               اسم الأصل
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={name}
//               readOnly
//               className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="serialNumber">
//               الرقم التسلسلي
//             </label>
//             <input
//               type="text"
//               id="serialNumber"
//               name="serialNumber"
//               value={serialNumber}
//               onChange={handleSerialNumberChange}
//               required
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               placeholder="أدخل الرقم التسلسلي"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="manufacturer">
//               الشركة المصنعة
//             </label>
//             <Select
//               id="manufacturer"
//               name="manufacturer"
//               options={companies}
//               value={manufacturer}
//               onChange={(selectedOption) => setManufacturer(selectedOption)}
//               placeholder="اختر الشركة المصنعة..."
//               className="w-full"
//               classNamePrefix="react-select"
//               isSearchable={true}
//               isClearable={true}
//               required
//               styles={{
//                 control: (provided) => ({
//                   ...provided,
//                   border: '1px solid #d1d5db',
//                   borderRadius: '0.5rem',
//                   padding: '0.25rem',
//                   '&:hover': { borderColor: '#bfdbfe' },
//                 }),
//                 menu: (provided) => ({
//                   ...provided,
//                   zIndex: 9999,
//                 }),
//               }}
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="assetCondition">
//               حالة الأصل
//             </label>
//             <Select
//               id="assetCondition"
//               name="assetCondition"
//               options={assetConditions}
//               value={assetCondition}
//               onChange={(selectedOption) => setAssetCondition(selectedOption)}
//               placeholder="اختر حالة الأصل..."
//               className="w-full"
//               classNamePrefix="react-select"
//               isSearchable={true}
//               isClearable={true}
//               required
//               styles={{
//                 control: (provided) => ({
//                   ...provided,
//                   border: '1px solid #d1d5db',
//                   borderRadius: '0.5rem',
//                   padding: '0.25rem',
//                   '&:hover': { borderColor: '#bfdbfe' },
//                 }),
//                 menu: (provided) => ({
//                   ...provided,
//                   zIndex: 9999,
//                 }),
//               }}
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">مواصفات الأصل</label>
//             {specFields.length > 0 ? (
//               specFields.map((field) => (
//                 <div key={field.key} className="flex items-center mb-2">
//                   <span className="text-gray-700 font-medium mr-2">{field.label}</span>
//                   {field.type === 'text' ? (
//                     <input
//                       type="text"
//                       value={specValues[field.key] || ''}
//                       onChange={(e) => handleSpecChange(field.key, e.target.value)}
//                       required
//                       className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
//                   ) : (
//                     <input
//                       type="checkbox"
//                       checked={checkboxValues[field.key.toLowerCase()] || false}
//                       onChange={() => handleCheckboxChange(field.key.toLowerCase())}
//                       className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                     />
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500">يرجى إدخال رقم الأصل لتحديد المواصفات</p>
//             )}
//           </div>

//           <div className="mt-6 flex justify-center">
//             <button
//               type="submit"
//               disabled={loading || !assetNumber}
//               className={`w-full bg-indigo-600 text-white p-3 rounded-lg ${
//                 loading || !assetNumber ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//             >
//               {loading ? 'جارٍ الإضافة...' : 'إضافة أصل'}
//             </button>
//           </div>
//         </form>
//       </div>

//       {(isLoading || success || error) && (
//         <div className="fixed inset-0 flex justify-center items-center z-50">
//           <div className="relative flex justify-center items-center w-24 h-24">
//             <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full"></div>
//             {isLoading && <ClipLoader color="#4B5EFC" size={80} />}
//             {success && <FaCheckCircle className="text-green-500 w-16 h-16 animate-bounce" />}
//             {error && <FaTimesCircle className="text-red-500 w-16 h-16 animate-bounce" />}
//           </div>
//         </div>
//       )}
//       <ToastContainer />
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const Select = dynamic(() => import('react-select'), { ssr: false });
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const companies = [
  { value: 'dell | ديل', label: 'Dell | ديل' },
  { value: 'hp | اتش بي', label: 'HP | اتش بي' },
  { value: 'lenovo | لينوفو', label: 'Lenovo | لينوفو' },
  { value: 'apple | ابل', label: 'Apple | ابل' },
  { value: 'asus | ايسوس', label: 'Asus | ايسوس' },
  { value: 'HUAWEI | هواوي', label: 'HUAWEI | هواوي' },
  { value: 'grandstream | جراندستريم', label: 'Grandstream | جراندستريم' },
  { value: 'epson | ايبسون', label: 'Epson | ايبسون' },
  { value: 'benq | بنكيو', label: 'BENQ | بنكيو' },
  { value: 'hikvision | هايك فيجن', label: 'Hikvision | هايك فيجن' },
  { value: 'LG | ال جي', label: 'LG | ال جي' },
  { value: 'acer | ايسر', label: 'Acer | ايسر' },
  { value: 'canon | كانون', label: 'Canon | كانون' },
  { value: 'toshiba | توشيبا', label: 'Toshiba | توشيبا' },
  { value: 'd-link | دي-لينك', label: 'D-Link | دي-لينك' },
  { value: 'fanvil | فانفيل', label: 'Fanvil | فانفيل' },
  { value: 'yealink | ييلينك', label: 'Yealink | ييلينك' },
  { value: 'MICROSOFT | مايكروسوفت', label: 'MICROSOFT | مايكروسوفت' },
  { value: 'zkteco | زكتيكو', label: 'ZKTeco | زكتيكو' },
  { value: 'atlas | أطلس', label: 'ATLAS | أطلس' },
  { value: 'datazone | داتازون', label: 'DATAZONE | داتازون' },
  { value: 'draytek | درايتك', label: 'DRAYTEK | درايتك' },
  { value: 'tplink | تي بي لينك', label: 'TPLINK | تي بي لينك' },
  { value: 'nanobeam | نانوبيم', label: 'NANOBEAM | نانوبيم' },
  { value: 'creative | كرييتف', label: 'CREATIVE | كرييتف' },
  { value: 'Dahua | دهوا', label: 'Dahua | دهوا' },
  { value: 'LOGI | لوجيتك', label: 'LOGI | لوجيتك' },
  { value: 'SAMSUNG | سامسونج', label: 'SAMSUNG | سامسونج' },
  { value: 'Western Digital | ويسترن ديجيتل', label: 'Western Digital | ويسترن ديجيتل' },
  { value: 'Lexar | ليكسر', label: 'Lexar | ليكسر' },
  { value: 'SanDisk | سان ديسك', label: 'SanDisk | سان ديسك' },
  { value: 'STC | إس تي سي', label: 'STC | إس تي سي' },
  { value: 'Zain | زين', label: 'Zain | زين' },
  { value: 'Mobily | موبايلي', label: 'Mobily | موبايلي' },
  { value: 'other | شركة أخرى', label: 'Other | شركة أخرى' },
];


const assetConditions = [
  { value: 'جديد', label: 'جديد' },
  { value: 'بحاجة صيانة', label: 'بحاجة صيانة' },
  { value: 'مخزن', label: 'مخزن' },
];

export default function AddAsset() {
  const [assetNumber, setAssetNumber] = useState('');
  const [name, setName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [manufacturer, setManufacturer] = useState(null);
  const [assetCondition, setAssetCondition] = useState(null);
  const [specFields, setSpecFields] = useState([]);
  const [specValues, setSpecValues] = useState({});
  const [checkboxValues, setCheckboxValues] = useState({ charger: false, bag: false });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [lastAssetNumber, setLastAssetNumber] = useState(null);
  const [hideSerialNumber, setHideSerialNumber] = useState(false); // حالة جديدة لإخفاء حقل الرقم التسلسلي

  const getAssetNameFromNumber = (number) => {
    if (!number || number.length < 1) return 'غير محدد';
    const firstDigit = number.charAt(0);
    const secondDigit = number.charAt(1);

    switch (firstDigit) {
      case '1':
        return 'جهاز كمبيوتر';
      case '2':
        return 'لاب توب';
      case '3':
        return 'شاشة كمبيوتر';
      case '4':
        if (secondDigit >= '0' && secondDigit <= '4') return 'جوال';
        if (secondDigit >= '5' && secondDigit <= '9') return 'تابلت';
        return 'غير محدد';
      case '5':
        return 'شريحة اتصال';
      case '6':
        return 'تليفون شبكة';
      case '7':
        if (secondDigit >= '0' && secondDigit <= '4') return 'كيبورد';
        if (secondDigit >= '5' && secondDigit <= '9') return 'ماوس';
        return 'غير محدد';
      case '8':
        switch (secondDigit) {
          case '1':
            return 'طابعة';
          case '2':
            return 'سويتشات';
          case '3':
            return 'كيبل نت';
          case '4':
            return 'كيبل HDMI';
          case '5':
            return 'كاميرات';
          case '6':
            return 'جهاز DVR';
          case '7':
            return 'اكسس بوينت';
          case '8':
            return 'سماعات';
          case '9':
            return 'عدة صيانة';
          default:
            return 'غير محدد';
        }
      case '9':
        switch (secondDigit) {
          case '1':
            return 'جهاز نقل الألياف';
          case '2':
            return 'جهاز بصمة';
          case '3':
            return 'وحدات تخزين';
          case '4':
            return 'أجهزة مكتبية';
          default:
            return 'غير محدد';
        }
      default:
        return 'غير محدد';
    }
  };

  const getDefaultSpecifications = (number) => {
    if (!number || number.length < 1) return [];
    const firstDigit = number.charAt(0);
    const secondDigit = number.charAt(1);

    switch (firstDigit) {
      case '1':
        return [
          { label: 'المعالج | Processor :', key: 'Processor', type: 'text' },
          { label: 'الرام | RAM :', key: 'Ram', type: 'text' },
          { label: 'التخزين | Storage:', key: 'Storage', type: 'text' },
        ];
      case '2':
        return [
          { label: 'المعالج | Processor :', key: 'Processor', type: 'text' },
          { label: 'الرام | RAM :', key: 'Ram', type: 'text' },
          { label: 'التخزين | Storage:', key: 'Storage', type: 'text' },
          { label: 'الشاحن | Charger :', key: 'Charger', type: 'checkbox' },
          { label: 'الشنطة | Bag :', key: 'Bag', type: 'checkbox' },
        ];
      case '3':
        return [{ label: 'الحجم | Size :', key: 'Size', type: 'text' }];
      case '4':
        if (secondDigit >= '0' && secondDigit <= '4') {
          return [
            { label: 'الطراز | Model :', key: 'Model', type: 'text' },
            { label: 'التخزين | Storage:', key: 'Storage', type: 'text' },
            { label: 'الرام | RAM :', key: 'Ram', type: 'text' },
            { label: 'الشاحن | Charger :', key: 'Charger', type: 'checkbox' },
          ];
        }
        if (secondDigit >= '5' && secondDigit <= '9') {
          return [
            { label: 'الطراز | Model :', key: 'Model', type: 'text' },
            { label: 'التخزين | Storage:', key: 'Storage', type: 'text' },
            { label: 'الرام | RAM :', key: 'Ram', type: 'text' },
            { label: 'الشاحن | Charger :', key: 'Charger', type: 'checkbox' },
          ];
        }
        return [];
      case '5':
        return [{ label: 'رقم الشريحة | SIM Number :', key: 'SimNumber', type: 'text' }];
      case '6':
        return [{ label: 'الطراز | MODLE :', key: 'MODLE', type: 'text' }];
      case '7':
        if (secondDigit >= '0' && secondDigit <= '4') {
          return [{ label: ' النوع | Type :', key: 'Type', type: 'text' }];
        }
        if (secondDigit >= '5' && secondDigit <= '9') {
          return [{ label: ' النوع | Type :', key: 'Type', type: 'text' }];
        }
        return [];
      case '8':
        switch (secondDigit) {
          case '1':
            return [
              { label: 'الطراز | Model :', key: 'Model', type: 'text' },
              { label: 'نوع الحبر | Ink Type :', key: 'InkType', type: 'text' },
            ];
          case '2':
            return [
              { label: 'عدد المنافذ | Ports :', key: 'Ports', type: 'text' },
              { label: 'السرعة | Speed :', key: 'Speed', type: 'text' },
            ];
          case '3':
            return [{ label: 'الطول | Length :', key: 'Length', type: 'text' }];
          case '4':
            return [{ label: 'الطول | Length :', key: 'Length', type: 'text' }];
          case '5':
            return [
              { label: 'الدقة | Resolution :', key: 'Resolution', type: 'text' },
              { label: 'الطراز | Model :', key: 'Model', type: 'text' },
            ];
          case '6':
            return [
              { label: 'عدد القنوات | Channels :', key: 'Channels', type: 'text' },
              { label: 'التخزين | Storage :', key: 'Storage', type: 'text' },
            ];
          case '7':
            return [{ label: 'السرعة | Speed :', key: 'Speed', type: 'text' }];
          case '8':
            return [{ label: 'النوع | Type :', key: 'Type', type: 'text' }];
          case '9':
            return [{ label: 'النوع | Type :', key: 'Type', type: 'text' }];
          default:
            return [];
        }
      case '9':
        switch (secondDigit) {
          case '1':
            return [
              { label: 'السرعة | Speed :', key: 'Speed', type: 'text' },
              { label: 'النوع | Type :', key: 'Type', type: 'text' },
            ];
          case '2':
            return [{ label: 'الطراز | Model :', key: 'Model', type: 'text' }];
          case '3':
            return [
              { label: 'السعة | Capacity :', key: 'Capacity', type: 'text' },
              { label: 'النوع | Type :', key: 'Type', type: 'text' },
            ];
          case '4':
            return [
              { label: 'النوع | Type :', key: 'Type', type: 'text' },
              { label: 'اين الاستخدام ؟| Usage :', key: 'Usage', type: 'text' },
            ];
          default:
            return [];
        }
      default:
        return [];
    }
  };

  const fetchLastAsset = async (number) => {
    if (!number || number.length < 2) {
      setLastAssetNumber(null);
      return;
    }

    try {
      const type = number.slice(0, 2);
      const response = await fetch(`/api/addasset?type=${type}`);
      if (!response.ok) {
        if (response.status === 404) {
          setLastAssetNumber(null);
          return;
        }
        throw new Error('فشل في جلب الأصول');
      }

      const assets = await response.json();
      if (assets.length > 0) {
        setLastAssetNumber(assets[0].fields.assetnum.toString().padStart(4, '0'));
      } else {
        setLastAssetNumber(null);
      }
    } catch (error) {
      console.error('خطأ أثناء جلب آخر أصل:', error);
      setLastAssetNumber(null);
    }
  };

  useEffect(() => {
    if (assetNumber) {
      const assetName = getAssetNameFromNumber(assetNumber);
      setName(assetName);
      const defaultSpecs = getDefaultSpecifications(assetNumber);
      setSpecFields(defaultSpecs);
      const newSpecValues = {};
      const newCheckboxValues = { charger: false, bag: false };
      defaultSpecs.forEach((field) => {
        if (field.type === 'text') {
          newSpecValues[field.key] = specValues[field.key] || '';
        } else if (field.type === 'checkbox') {
          newCheckboxValues[field.key.toLowerCase()] = checkboxValues[field.key.toLowerCase()] || false;
        }
      });
      setSpecValues(newSpecValues);
      setCheckboxValues(newCheckboxValues);

      // التحقق من نوع الأصل لإخفاء حقل الرقم التسلسلي
      const firstTwoDigits = assetNumber.slice(0, 2);
      if (firstTwoDigits === '83' || firstTwoDigits === '84') {
        setHideSerialNumber(true);
        setSerialNumber('NO SN');
      } else {
        setHideSerialNumber(false);
        setSerialNumber('');
      }

      fetchLastAsset(assetNumber);
    } else {
      setName('');
      setSpecFields([]);
      setSpecValues({});
      setCheckboxValues({ charger: false, bag: false });
      setLastAssetNumber(null);
      setHideSerialNumber(false);
      setSerialNumber('');
    }
  }, [assetNumber]);

  const handleSpecChange = (key, value) => {
    setSpecValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCheckboxChange = (key) => {
    setCheckboxValues((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const validateForm = () => {
    if (assetNumber.length !== 4) {
      setErrorMessage('رقم الأصل يجب أن يكون 4 أرقام بالضبط.');
      setError(true);
      return false;
    }

    const firstTwoDigits = assetNumber.slice(0, 2);
    if (!hideSerialNumber) {
      const arabicRegex = /[\u0600-\u06FF]/;
      if (!serialNumber || arabicRegex.test(serialNumber)) {
        setErrorMessage('الرقم التسلسلي مطلوب ولا يمكن أن يحتوي على حروف عربية.');
        setError(true);
        return false;
      }
    }

    if (!manufacturer) {
      setErrorMessage('يرجى اختيار الشركة المصنعة.');
      setError(true);
      return false;
    }
    if (!assetCondition) {
      setErrorMessage('يرجى اختيار حالة الأصل.');
      setError(true);
      return false;
    }
    for (const field of specFields) {
      if (field.type === 'text' && (!specValues[field.key] || specValues[field.key].trim() === '')) {
        setErrorMessage('يرجى ملء جميع حقول المواصفات النصية.');
        setError(true);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsLoading(true);
    setErrorMessage('');
    setSuccess(false);
    setError(false);

    if (!validateForm()) {
      setLoading(false);
      setIsLoading(false);
      return;
    }

    const assetNumberAsNumber = parseInt(assetNumber, 10);
    const specifications = specFields
      .map((field) => {
        if (field.type === 'text') {
          return `${field.key}: ${specValues[field.key] || ''}`;
        } else if (field.type === 'checkbox') {
          return `${field.key}: ${checkboxValues[field.key.toLowerCase()] ? 'Yes' : 'No'}`;
        }
        return '';
      })
      .join('\n');

    const assetData = {
      assetnum: assetNumberAsNumber,
      assetName: name,
      serialNumber: hideSerialNumber ? 'NO SN' : serialNumber,
      manufacturer: manufacturer ? manufacturer.value : '',
      assetCondition: assetCondition ? assetCondition.value : '',
      specifications: specifications,
    };

    try {
      const existingAssetRecords = await fetch(`/api/addasset?query=${assetNumberAsNumber}`).then((res) => res.json());
      if (existingAssetRecords.length > 0) {
        setErrorMessage('رقم الأصل مستخدم بالفعل.');
        setError(true);
        toast.error('رقم الأصل مستخدم بالفعل.');
        return;
      }

      if (!hideSerialNumber) {
        const existingSerialRecords = await fetch(`/api/addasset?serial=${serialNumber}`).then((res) => res.json());
        if (existingSerialRecords.length > 0) {
          setErrorMessage('الرقم التسلسلي مستخدم بالفعل.');
          setError(true);
          toast.error('الرقم التسلسلي مستخدم بالفعل.');
          return;
        }
      }

      const res = await fetch('/api/addasset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'خطأ غير معروف من الخادم');
      }

      await res.json();
      toast.success('تمت إضافة الأصل بنجاح 👏');
      setAssetNumber('');
      setSerialNumber('');
      setManufacturer(null);
      setAssetCondition(null);
      setSpecValues({});
      setCheckboxValues({ charger: false, bag: false });
      setSuccess(true);
      setLastAssetNumber(null);
      setHideSerialNumber(false);
    } catch (error) {
      console.error('خطأ:', error);
      setErrorMessage(error.message || 'خطأ أثناء إضافة الأصل');
      setError(true);
      toast.error(error.message || 'خطأ أثناء إضافة الأصل');
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setError(false);
        setErrorMessage('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleAssetNumberChange = (e) => {
    const value = e.target.value;
    if (value === '' || (value.length <= 4 && /^\d*$/.test(value))) {
      setAssetNumber(value);
    }
  };

  const handleSerialNumberChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9-]*$/.test(value)) {
      setSerialNumber(value);
    }
  };

  const handleAssetNumberKeyDown = (e) => {
    const currentValue = e.currentTarget.value;
    if (
      currentValue.length >= 4 &&
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
    ) {
      e.preventDefault();
    }
    if (
      !/[\d]/.test(e.key) &&
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">إضافة أصل جديد</h2>
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center justify-between">
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="assetNumber">
              رقم الأصل{' '}
              <span
                className="inline-block w-4 h-4 text-center bg-gray-300 rounded-full cursor-help"
                data-tooltip-id="asset-number-tooltip"
              >
                ?
              </span>
            </label>
            <input
              type="number"
              id="assetNumber"
              name="assetNumber"
              value={assetNumber}
              onChange={handleAssetNumberChange}
              onKeyDown={handleAssetNumberKeyDown}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min="0"
              max="9999"
              placeholder="أدخل 4 أرقام فقط"
            />
            {lastAssetNumber && (
              <p className="mt-2 text-sm text-gray-600">
                آخر {name} تم إضافته: <span className="font-medium">{lastAssetNumber}</span>
              </p>
            )}
            <Tooltip
              id="asset-number-tooltip"
              place="top"
              style={{
                backgroundColor: '#333',
                color: '#fff',
                direction: 'rtl',
                textAlign: 'right',
                zIndex: 10000,
              }}
            >
              <div>
                أدخل رقمًا مكونًا من 4 أرقام:<br />
                1xxx: جهاز كمبيوتر<br />
                2xxx: لاب توب<br />
                3xxx: شاشة كمبيوتر<br />
                40xx-44xx: جوال<br />
                45xx-49xx: تابلت<br />
                5xxx: شريحة اتصال<br />
                6xxx: تليفون شبكة<br />
                70xx-74xx: كيبورد<br />
                75xx-79xx: ماوس<br />
                81xx: طابعة<br />
                82xx: سويتشات<br />
                83xx: كيبل نت<br />
                84xx: كيبل HDMI<br />
                85xx: كاميرات<br />
                86xx: جهاز DVR<br />
                87xx: اكسس بوينت<br />
                88xx: سماعات<br />
                89xx: عدة صيانة<br />
                91xx: جهاز نقل الألياف<br />
                92xx: جهاز بصمة<br />
                93xx: وحدات تخزين<br />
                94xx: أجهزة مكتبية
              </div>
            </Tooltip>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
              اسم الأصل
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {!hideSerialNumber && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="serialNumber">
                الرقم التسلسلي
              </label>
              <input
                type="text"
                id="serialNumber"
                name="serialNumber"
                value={serialNumber}
                onChange={handleSerialNumberChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="أدخل الرقم التسلسلي"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="manufacturer">
              الشركة المصنعة
            </label>
            <Select
              id="manufacturer"
              name="manufacturer"
              options={companies}
              value={manufacturer}
              onChange={(selectedOption) => setManufacturer(selectedOption)}
              placeholder="اختر الشركة المصنعة..."
              className="w-full"
              classNamePrefix="react-select"
              isSearchable={true}
              isClearable={true}
              required
              styles={{
                control: (provided) => ({
                  ...provided,
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  padding: '0.25rem',
                  '&:hover': { borderColor: '#bfdbfe' },
                }),
                menu: (provided) => ({
                  ...provided,
                  zIndex: 9999,
                }),
              }}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="assetCondition">
              حالة الأصل
            </label>
            <Select
              id="assetCondition"
              name="assetCondition"
              options={assetConditions}
              value={assetCondition}
              onChange={(selectedOption) => setAssetCondition(selectedOption)}
              placeholder="اختر حالة الأصل..."
              className="w-full"
              classNamePrefix="react-select"
              isSearchable={true}
              isClearable={true}
              required
              styles={{
                control: (provided) => ({
                  ...provided,
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  padding: '0.25rem',
                  '&:hover': { borderColor: '#bfdbfe' },
                }),
                menu: (provided) => ({
                  ...provided,
                  zIndex: 9999,
                }),
              }}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">مواصفات الأصل</label>
            {specFields.length > 0 ? (
              specFields.map((field) => (
                <div key={field.key} className="flex items-center mb-2">
                  <span className="text-gray-700 font-medium mr-2">{field.label}</span>
                  {field.type === 'text' ? (
                    <input
                      type="text"
                      value={specValues[field.key] || ''}
                      onChange={(e) => handleSpecChange(field.key, e.target.value)}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={checkboxValues[field.key.toLowerCase()] || false}
                      onChange={() => handleCheckboxChange(field.key.toLowerCase())}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">يرجى إدخال رقم الأصل لتحديد المواصفات</p>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={loading || !assetNumber}
              className={`w-full bg-indigo-600 text-white p-3 rounded-lg ${
                loading || !assetNumber ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'جارٍ الإضافة...' : 'إضافة أصل'}
            </button>
          </div>
        </form>
      </div>

      {(isLoading || success || error) && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="relative flex justify-center items-center w-24 h-24">
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full"></div>
            {isLoading && <ClipLoader color="#4B5EFC" size={80} />}
            {success && <FaCheckCircle className="text-green-500 w-16 h-16 animate-bounce" />}
            {error && <FaTimesCircle className="text-red-500 w-16 h-16 animate-bounce" />}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
