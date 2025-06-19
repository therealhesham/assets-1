// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { ClipLoader } from 'react-spinners';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { registerLocale } from 'react-datepicker';
// import { ar } from 'date-fns/locale/ar';
// import { ReactSketchCanvas } from 'react-sketch-canvas';
// import { FaCheckCircle } from 'react-icons/fa';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import styled from 'styled-components';

// registerLocale('ar', ar);

// // زر إضافة الأصل
// const Checkbox = ({ onChange, checked }: { onChange: () => void; checked: boolean }) => {
//   const uniqueId = `checkbox-${Math.random()}`;

//   return (
//     <StyledWrapper>
//       <div className="checkbox-container">
//         <div className="checkbox-wrapper">
//           <input
//             className="checkbox"
//             id={uniqueId}
//             type="checkbox"
//             checked={checked}
//             onChange={(e) => {
//               console.log('Checkbox changed:', e.target.checked);
//               onChange();
//             }}
//           />
//           <label className="checkbox-label" htmlFor={uniqueId}>
//             <div className="checkbox-flip">
//               <div className="checkbox-front">
//                 <svg fill="white" height={32} width={32} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M19 13H12V19H11V13H5V12H11V6H12V12H19V13Z" className="icon-path" />
//                 </svg>
//               </div>
//               <div className="checkbox-back">
//                 <svg fill="white" height={32} width={32} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M9 19l-7-7 1.41-1.41L9 16.17l11.29-11.3L22 6l-13 13z" className="icon-path" />
//                 </svg>
//               </div>
//             </div>
//           </label>
//         </div>
//       </div>
//     </StyledWrapper>
//   );
// };

// const StyledWrapper = styled.div`
//   .checkbox-container {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     height: 100%;
//     margin: 0;
//   }

//   .checkbox {
//     display: none;
//   }

//   .checkbox-label {
//     position: relative;
//     display: inline-flex;
//     align-items: center;
//     cursor: pointer;
//   }

//   .checkbox-flip {
//     width: 40px;
//     height: 40px;
//     perspective: 1000px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     position: relative;
//     transition: transform 0.4s ease;
//   }

//   .checkbox-front,
//   .checkbox-back {
//     width: 100%;
//     height: 100%;
//     position: absolute;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     border-radius: 12px;
//     backface-visibility: hidden;
//     transition: transform 0.8s ease;
//   }

//   .checkbox-front {
//     background: linear-gradient(135deg, rgb(35, 199, 43), rgb(13, 129, 42));
//     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//     transform: rotateY(0deg);
//   }

//   .checkbox-back {
//     background: linear-gradient(135deg, #36b54a, #00c1d4);
//     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//     transform: rotateY(180deg);
//   }

//   .checkbox-wrapper:hover .checkbox-flip {
//     transform: scale(1.1);
//     transition: transform 0.4s ease-out;
//   }

//   .checkbox:checked + .checkbox-label .checkbox-front {
//     transform: rotateY(180deg);
//   }

//   .checkbox:checked + .checkbox-label .checkbox-back {
//     transform: rotateY(0deg);
//   }

//   .checkbox:focus + .checkbox-label .checkbox-flip {
//     box-shadow:
//       0 0 15px rgba(54, 181, 73, 0.7),
//       0 0 20px rgba(0, 193, 212, 0.4);
//     transition: box-shadow 0.3s ease;
//   }

//   .icon-path {
//     stroke: white;
//     stroke-width: 2;
//     fill: transparent;
//   }
// `;

// // زر البحث
// const SearchButton = ({ onClick }: { onClick: () => void }) => {
//   return (
//     <StyledSearchButtonWrapper>
//       <button className="button" onClick={onClick}>
//         <span>
//           <svg viewBox="0 0 24 24" height={24} width={24} xmlns="http://www.w3.org/2000/svg">
//             <path d="M9.145 18.29c-5.042 0-9.145-4.102-9.145-9.145s4.103-9.145 9.145-9.145 9.145 4.103 9.145 9.145-4.102 9.145-9.145 9.145zm0-15.167c-3.321 0-6.022 2.702-6.022 6.022s2.702 6.022 6.022 6.022 6.023-2.702 6.023-6.022-2.702-6.022-6.023-6.022zm9.263 12.443c-.817 1.176-1.852 2.188-3.046 2.981l5.452 5.453 3.014-3.013-5.42-5.421z" />
//           </svg>
//         </span>
//       </button>
//     </StyledSearchButtonWrapper>
//   );
// };

// const StyledSearchButtonWrapper = styled.div`
//   .button {
//     position: relative;
//     border: none;
//     background-color: white;
//     color: #212121;
//     padding: 15px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 20px;
//     font-weight: 600;
//     gap: 10px;
//     border-radius: 10px;
//     transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
//     box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
//     cursor: pointer;
//     overflow: hidden;
//   }

//   .button span {
//     position: relative;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     z-index: 1;
//   }

//   .button::before {
//     content: "";
//     position: absolute;
//     background-color: #1e90ff;
//     width: 100%;
//     height: 100%;
//     left: 0%;
//     bottom: 0%;
//     transform: translate(-100%, 100%);
//     border-radius: inherit;
//   }

//   .button svg {
//     fill: rgb(29, 120, 211);
//     transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
//   }

//   .button:hover::before {
//     animation: shakeBack 0.6s forwards;
//   }

//   .button:hover svg {
//     fill: white;
//     scale: 1.3;
//   }

//   .button:active {
//     box-shadow: none;
//   }

//   @keyframes shakeBack {
//     0% {
//       transform: translate(-100%, 100%);
//     }
//     50% {
//       transform: translate(20%, -20%);
//     }
//     100% {
//       transform: translate(0%, 0%);
//     }
//   }
// `;

// // زر الحذف 
// const DeleteButton = ({ onClick }: { onClick: () => void }) => {
//   return (
//     <button
//       className="group relative flex h-10 w-10 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-red-800 bg-red-400 hover:bg-red-600"
//       onClick={onClick}
//     >
//       <svg
//         viewBox="0 0 1.625 1.625"
//         className="absolute -top-7 fill-white delay-100 group-hover:top-6 group-hover:animate-[spin_1.4s] group-hover:duration-1000"
//         height={15}
//         width={15}
//       >
//         <path d="M.471 1.024v-.52a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099h-.39c-.107 0-.195 0-.195-.195" />
//         <path d="M1.219.601h-.163A.1.1 0 0 1 .959.504V.341A.033.033 0 0 0 .926.309h-.26a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099v-.39a.033.033 0 0 0-.032-.033" />
//         <path d="m1.245.465-.15-.15a.02.02 0 0 0-.016-.006.023.023 0 0 0-.023.022v.108c0 .036.029.065.065.065h.107a.023.023 0 0 0 .023-.023.02.02 0 0 0-.007-.016" />
//       </svg>
//       <svg
//         width={16}
//         fill="none"
//         viewBox="0 0 39 7"
//         className="origin-right duration-500 group-hover:rotate-90"
//       >
//         <line strokeWidth={4} stroke="white" y2={5} x2={39} y1={5} />
//         <line strokeWidth={3} stroke="white" y2="1.5" x2="26.0357" y1="1.5" x1={12} />
//       </svg>
//       <svg width={16} fill="none" viewBox="0 0 33 39" className="">
//         <mask fill="white" id="path-1-inside-1_8_19">
//           <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z" />
//         </mask>
//         <path
//           mask="url(#path-1-inside-1_8_19)"
//           fill="white"
//           d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
//         />
//         <path strokeWidth={4} stroke="white" d="M12 6L12 29" />
//         <path strokeWidth={4} stroke="white" d="M21 6V29" />
//       </svg>
//     </button>
//   );
// };

// export default function Assets() {
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [signatureData, setSignatureData] = useState<string | null>(null);
//   const [hasDrawn, setHasDrawn] = useState(false);
//   const rsCanvas = useRef<any>(null);

//   const [employeeName, setEmployeeName] = useState('');
//   const [receiptDate, setReceiptDate] = useState<Date | null>(null);
//   const [email, setEmail] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
//   const [isProcessing, setIsProcessing] = useState<'loading' | 'success' | null>(null);
//   const [showThankYouCard, setShowThankYouCard] = useState(false);
//   const [tempSelected, setTempSelected] = useState<string[]>([]);

//   const componentRef = useRef<HTMLDivElement>(null);

//   const isValidImage = (url: string): Promise<boolean> => {
//     return new Promise((resolve) => {
//       const img = new Image();
//       img.src = url;
//       img.onload = () => resolve(true);
//       img.onerror = () => resolve(false);
//     });
//   };

//   const base64ToBlob = (base64: string): Blob => {
//     if (!base64 || !base64.includes(',')) {
//       throw new Error('Invalid Base64 string: Missing data URI prefix or comma separator');
//     }

//     const byteString = atob(base64.split(',')[1]);
//     const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
//     const ab = new ArrayBuffer(byteString.length);
//     const ia = new Uint8Array(ab);
//     for (let i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//     }
//     return new Blob([ab], { type: mimeString });
//   };

//   const sendDataToServer = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('employeeName', employeeName);
//       formData.append('receiptDate', receiptDate ? receiptDate.toISOString().split('T')[0] : '');
//       formData.append('records', JSON.stringify(selectedRecords));
//       formData.append('email', email);

//       if (signatureData && hasDrawn) {
//         const isValid = await isValidImage(signatureData);
//         if (isValid) {
//           const blob = base64ToBlob(signatureData);
//           formData.append('signature', blob, 'signature.png');
//         } else {
//           console.warn('Invalid signature image, skipping attachment');
//         }
//       }

//       console.log('Sending data to server...');
//       const response = await fetch('/api/SEND-MAIL', {
//         method: 'POST',
//         body: formData,
//       });

//       console.log('Response status:', response.status);
//       const data = await response.json();
//       console.log('Response data:', data);

//       if (!response.ok) {
//         throw new Error(data.error || 'فشل إرسال البريد الإلكتروني');
//       }

//       console.log('تم إرسال البريد الإلكتروني بنجاح:', data);
//       return true;
//     } catch (error) {
//       console.error('خطأ أثناء إرسال البيانات إلى الخادم:', error);
//       toast.error('حدث خطأ أثناء إرسال البريد الإلكتروني: ' + (error as Error).message);
//       return false;
//     }
//   };

//   const handlePrint = () => {
//     const printContent = componentRef.current;
//     if (!printContent) return;

//     const originalContent = document.body.innerHTML;
//     document.body.innerHTML = printContent.innerHTML;
//     window.print();
//     document.body.innerHTML = originalContent;

//     setImageUrl(null);
//     setSignatureData(null);
//     setSelectedRecords([]);
//     setEmployeeName('');
//     setReceiptDate(null);
//     setEmail('');
//     setHasDrawn(false);
//     clearSignature();

//     window.location.reload();
//   };

//   const clearSignature = () => {
//     rsCanvas.current?.resetCanvas();
//     setSignatureData(null);
//     setImageUrl(null);
//     setHasDrawn(false);
//   };

//   const saveSignature = async () => {
//     try {
//       const paths = await rsCanvas.current.exportPaths();
//       if (!paths || paths.length === 0) {
//         toast.warn('يرجى رسم توقيع قبل الحفظ. اللوحة فارغة.');
//         return;
//       }

//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       const data = await rsCanvas.current.exportImage('png');
//       console.log('Exported signature data:', data);

//       const isValid = await isValidImage(data);
//       if (!isValid) {
//         toast.error('فشل تصدير التوقيع كصورة صالحة. يرجى إعادة الرسم والحفظ.');
//         return;
//       }

//       setSignatureData(data);
//       const blob = base64ToBlob(data);
//       const objectUrl = URL.createObjectURL(blob);
//       setImageUrl(objectUrl);
//       console.log('تم حفظ التوقيع:', objectUrl);
//     } catch (e) {
//       console.error('خطأ أثناء حفظ التوقيع:', e);
//       toast.error('حدث خطأ أثناء حفظ التوقيع. يرجى المحاولة مرة أخرى.');
//     }
//   };

//   const handleCanvasChange = async () => {
//     const paths = await rsCanvas.current?.exportPaths();
//     setHasDrawn(paths && paths.length > 0);
//   };

//   const handleAddAsset = (record: any) => {
//     if (!record.fields['assetnum']) {
//       toast.error('الأصل المختار لا يحتوي على رقم الأصل');
//       return;
//     }

//     setSelectedRecords((prev) => [...prev, record]);
//     setSearchResults([]);
//     setSearchQuery('');
//     setTempSelected([]);
//     console.log('Asset added:', record);
//   };

//   const handleCheckboxChange = async (record: any) => {
//     const recordId = record.id;
//     console.log('Handling checkbox change for record:', recordId);

//     if (tempSelected.includes(recordId)) {
//       setTempSelected((prev) => prev.filter((id) => id !== recordId));
//       console.log('Removed from tempSelected:', recordId);
//     } else {
//       setTempSelected((prev) => [...prev, recordId]);
//       console.log('Added to tempSelected:', recordId);

//       await new Promise((resolve) => setTimeout(resolve, 800));
//       handleAddAsset(record);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsProcessing('loading');
//     setShowThankYouCard(false);

//     if (selectedRecords.length === 0) {
//       toast.error('الرجاء إضافة على الأقل عهدة واحدة');
//       setIsProcessing(null);
//       return;
//     }

//     if (!employeeName || !receiptDate || !email) {
//       toast.error('الرجاء إدخال اسم الموظف وتاريخ الاستلام والبريد الإلكتروني');
//       setIsProcessing(null);
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       toast.error('الرجاء إدخال بريد إلكتروني صالح');
//       setIsProcessing(null);
//       return;
//     }

//     const paths = await rsCanvas.current.exportPaths();
//     if (!paths || paths.length === 0) {
//       toast.error('يرجى رسم توقيع قبل التأكيد. اللوحة فارغة.');
//       setIsProcessing(null);
//       return;
//     }

//     if (!signatureData || !hasDrawn) {
//       toast.error('الرجاء رسم وحفظ التوقيع قبل التأكيد');
//       setIsProcessing(null);
//       return;
//     }

//     if (!signatureData.startsWith('data:image/')) {
//       toast.error('صيغة التوقيع غير صالحة. يرجى إعادة رسم وحفظ التوقيع.');
//       setIsProcessing(null);
//       return;
//     }

//     try {
//       console.log('Sending data to /api/assetform:', {
//         records: selectedRecords,
//         employeeName,
//         receiptDate: receiptDate.toISOString().split('T')[0],
//         email,
//         signature: signatureData,
//       });

//       const response = await fetch('/api/assetform', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           records: selectedRecords,
//           employeeName,
//           receiptDate: receiptDate.toISOString().split('T')[0],
//           email,
//           signature: signatureData,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         toast.error(data.error || 'حدث خطأ ما');
//         setIsProcessing(null);
//         return;
//       }

//       setIsProcessing('success');

//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       toast.success('تم تسجيل العهدة بنجاح', {
//         position: 'top-right',
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         onOpen: () => setIsProcessing(null),
//       });

//       const emailSent = await sendDataToServer();

//       if (emailSent) {
//         setShowThankYouCard(true);

//         toast.success('تم إرسال العهدة على البريد الإلكتروني بنجاح', {
//           position: 'top-right',
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });

//         await new Promise((resolve) => setTimeout(resolve, 3000));
//         setShowThankYouCard(false);

//         if (window.confirm('هل تريد طباعة النموذج الآن؟')) {
//           handlePrint();
//         } else {
//           setImageUrl(null);
//           setSignatureData(null);
//           setSelectedRecords([]);
//           setEmployeeName('');
//           setReceiptDate(null);
//           setEmail('');
//           setHasDrawn(false);
//           clearSignature();
//         }
//       }
//     } catch (err) {
//       toast.error('حدث خطأ أثناء التسجيل: ' + (err as Error).message);
//       setIsProcessing(null);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (imageUrl) URL.revokeObjectURL(imageUrl);
//     };
//   }, [imageUrl]);

//   const handleSearch = async () => {
//     if (!searchQuery.trim()) return;
//     setLoading(true);

//     try {
//       const response = await fetch(`/api/assetform?query=${searchQuery}`);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'فشل البحث');
//       }

//       // تصفية النتائج لاستبعاد الأصول الموجودة في selectedRecords بناءً على assetnum
//       const filteredResults = Array.isArray(data)
//         ? data.filter(
//             (item: any) =>
//               !selectedRecords.some(
//                 (selected: any) => selected.fields['assetnum'] === item.fields['assetnum']
//               )
//           )
//         : [];

//       setSearchResults(filteredResults);

//       if (filteredResults.length === 0) {
//         toast.info('لا توجد أصول متاحة مطابقة لهذا البحث أو أن الأصل مختار بالفعل.');
//       }
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRemoveAsset = (id: string) => {
//     setSelectedRecords((prev) => prev.filter((record: any) => record.id !== id));
//   };

//   const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     if (value === '' || (value.length <= 4 && /^\d*$/.test(value))) {
//       setSearchQuery(value);
//     }
//   };

//   const handleSearchQueryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
//     <div className="min-h-screen bg-gray-100">
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={true}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />

//       {(isProcessing || showThankYouCard) && (
//         <div className="fixed inset-0 flex justify-center items-center z-50">
//           {isProcessing ? (
//             <div className="relative flex justify-center items-center w-24 h-24">
//               <div className="absolute inset-0 bg-gray-600 bg-opacity-80 rounded-full"></div>
//               {isProcessing === 'loading' && (
//                 <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin opacity-80"></div>
//               )}
//               {isProcessing === 'success' && (
//                 <FaCheckCircle className="text-green-500 w-16 h-16 animate-bounce" />
//               )}
//             </div>
//           ) : showThankYouCard ? (
//             <div className="email-loading-container">
//               <div className="email-icon">
//                 <div className="loader" />
//                 <FaCheckCircle
//                   className="check-icon"
//                   style={{ color: '#28a745', width: '60px', height: '60px' }}
//                 />
//               </div>
//               <p className="loading-text">جارٍ إرسال البريد الإلكتروني...</p>
//             </div>
//           ) : null}
//         </div>
//       )}

//       <div className="content-container">
//         <div className="form-container">
//           <h2 className="text-2xl font-bold text-center mb-6">نموذج تسليم عهدة</h2>

//           <div className="mb-4">
//             <label className="block text-gray-700 font-medium">البحث عن الأصل</label>
//             <div className="flex justify-between items-center gap-2">
//               <input
//                 type="number"
//                 value={searchQuery}
//                 onChange={handleSearchQueryChange}
//                 onKeyDown={handleSearchQueryKeyDown}
//                 className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-1"
//                 placeholder="ادخل 4 أرقام فقط"
//                 min="0"
//                 max="9999"
//               />
//               <SearchButton onClick={handleSearch} />
//             </div>
//           </div>

//           {loading && <p className="text-blue-500">جارٍ البحث...</p>}
//           {searchResults.length > 0 && (
//             <ul className="mt-4 space-y-2">
//               {searchResults.map((item: any) => (
//                 <li
//                   key={item.id}
//                   className="p-3 bg-gray-200 rounded-lg flex flex-row-reverse justify-between items-center"
//                 >
//                   <Checkbox
//                     checked={tempSelected.includes(item.id)}
//                     onChange={() => handleCheckboxChange(item)}
//                   />
//                   <div className="text-right" style={{ direction: 'rtl', unicodeBidi: 'embed' }}>
//                     <p className="font-bold">{item.fields['اسم الاصل'] || 'غير متوفر'}</p>
//                     <p>الرقم التسلسلي: {item.fields['الرقم التسلسلي'] || 'غير متوفر'}</p>
//                     <p>الشركة المصنعة: {item.fields['الشركة المصنعة'] || 'غير متوفر'}</p>
//                     <p>مواصفات اضافية : {item.fields['مواصفات اضافية '] || 'غير متوفر'}</p>
//                     <p>رقم الأصل: {item.fields['assetnum'] || 'غير متوفر'}</p>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}

//           {selectedRecords.length > 0 && (
//             <div className="mt-6">
//               <h3 className="text-xl font-semibold mb-2">الأصول المختارة</h3>
//               <ul className="space-y-2">
//                 {selectedRecords.map((record: any) => (
//                   <li key={record.id} className="p-3 bg-gray-100 rounded-lg">
//                     <details className="group">
//                       <summary className="flex justify-between items-center cursor-pointer list-none">
//                         <span>
//                           {record.fields['اسم الاصل']} (رقم الأصل: {record.fields['assetnum']})
//                         </span>
//                         <span className="flex space-x-2">
//                           <DeleteButton onClick={() => handleRemoveAsset(record.id)} />
//                         </span>
//                       </summary>
//                       <div
//                         className="mt-2 p-2 bg-white border border-gray-200 rounded text-right"
//                         style={{ direction: 'rtl' }}
//                       >
//                         <p>
//                           <strong>الرقم التسلسلي:</strong>{' '}
//                           {record.fields['الرقم التسلسلي'] || 'غير متوفر'}
//                         </p>
//                         <p>
//                           <strong>الشركة المصنعة:</strong>{' '}
//                           {record.fields['الشركة المصنعة'] || 'غير متوفر'}
//                         </p>
//                         <p>
//                           <strong>مواصفات اضافية :</strong>{' '}
//                           {record.fields['مواصفات اضافية '] || 'غير متوفر'}
//                         </p>
//                         <p>
//                           <strong>رقم الأصل:</strong> {record.fields['assetnum'] || 'غير متوفر'}
//                         </p>
//                       </div>
//                     </details>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label htmlFor="employeeName" className="block text-gray-700 font-medium">
//                 اسم الموظف
//               </label>
//               <input
//                 type="text"
//                 id="employeeName"
//                 value={employeeName}
//                 onChange={(e) => setEmployeeName(e.target.value)}
//                 className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="اسم الموظف"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="receiptDate" className="block text-gray-700 font-medium">
//                 تاريخ الاستلام
//               </label>
//               <DatePicker
//                 selected={receiptDate}
//                 onChange={(date: Date | null) => setReceiptDate(date)}
//                 dateFormat="yyyy-MM-dd"
//                 className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholderText="اختر تاريخ الاستلام"
//                 required
//                 locale="ar"
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="email" className="block text-gray-700 font-medium">
//                 البريد الإلكتروني
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="البريد الإلكتروني"
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-gray-700 font-medium">التوقيع</label>
//               <div>
//                 <ReactSketchCanvas
//                   ref={rsCanvas}
//                   width="400px"
//                   height="200px"
//                   strokeColor="black"
//                   strokeWidth={5}
//                   onChange={handleCanvasChange}
//                 />
//                 {imageUrl && (
//                   <img
//                     src={imageUrl}
//                     alt="Signature"
//                     style={{ marginTop: '10px', maxWidth: '200px' }}
//                     onError={() => {
//                       console.error('فشل تحميل صورة التوقيع');
//                       setImageUrl(null);
//                       setSignatureData(null);
//                       setHasDrawn(false);
//                     }}
//                   />
//                 )}
//               </div>
//               <div className="flex space-x-2 mt-2">
//                 <button
//                   type="button"
//                   onClick={clearSignature}
//                   className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
//                 >
//                   مسح التوقيع
//                 </button>
//                 <button
//                   type="button"
//                   onClick={saveSignature}
//                   className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
//                 >
//                   حفظ التوقيع
//                 </button>
//               </div>
//             </div>

//             <div ref={componentRef} style={{ display: 'none' }}>
//               <div
//                 style={{
//                   padding: '20px',
//                   fontFamily: 'Arial, sans-serif',
//                   direction: 'rtl',
//                   textAlign: 'right',
//                   width: '210mm',
//                   minHeight: '297mm',
//                   backgroundColor: '#fff',
//                   border: '1px solid #ccc',
//                 }}
//               >
//                 <h1 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>
//                   نموذج استلام عهدة
//                 </h1>
//                 <div style={{ marginBottom: '20px' }}>
//                   <p style={{ fontSize: '16px', marginBottom: '5px' }}>
//                     <strong>اسم الموظف:</strong> {employeeName || 'غير متوفر'}
//                   </p>
//                   <p style={{ fontSize: '16px', marginBottom: '5px' }}>
//                     <strong>البريد الإلكتروني:</strong> {email || 'غير متوفر'}
//                   </p>
//                   <p style={{ fontSize: '16px', marginBottom: '5px' }}>
//                     <strong>تاريخ الاستلام:</strong>{' '}
//                     {receiptDate ? receiptDate.toISOString().split('T')[0] : 'غير متوفر'}
//                   </p>
//                 </div>
//                 <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>الأصول المستلمة:</h2>
//                 {selectedRecords.length > 0 ? (
//                   <table
//                     style={{
//                       width: '100%',
//                       borderCollapse: 'collapse',
//                       marginBottom: '20px',
//                       direction: 'rtl',
//                     }}
//                   >
//                     <thead>
//                       <tr>
//                         <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0' }}>
//                           اسم الأصل
//                         </th>
//                         <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0' }}>
//                           رقم الأصل
//                         </th>
//                         <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0' }}>
//                           الرقم التسلسلي
//                         </th>
//                         <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0' }}>
//                           الشركة المصنعة
//                         </th>
//                         <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0' }}>
//                           مواصفات اضافية 
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {selectedRecords.map((record: any) => (
//                         <tr key={record.id}>
//                           <td style={{ border: '1px solid #000', padding: '8px' }}>
//                             {record.fields['اسم الاصل'] || 'غير متوفر'}
//                           </td>
//                           <td style={{ border: '1px solid #000', padding: '8px' }}>
//                             {record.fields['assetnum'] || 'غير متوفر'}
//                           </td>
//                           <td style={{ border: '1px solid #000', padding: '8px' }}>
//                             {record.fields['الرقم التسلسلي'] || 'غير متوفر'}
//                           </td>
//                           <td style={{ border: '1px solid #000', padding: '8px' }}>
//                             {record.fields['الشركة المصنعة'] || 'غير متوفر'}
//                           </td>
//                           <td style={{ border: '1px solid #000', padding: '8px' }}>
//                             {record.fields['مواصفات اضافية '] || 'غير متوفر'}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <p style={{ fontSize: '14px', color: '#888' }}>لا توجد أصول مختارة</p>
//                 )}
//                 <div style={{ marginTop: '30px' }}>
//                   <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>التوقيع:</h2>
//                   {imageUrl && hasDrawn ? (
//                     <img
//                       src={imageUrl}
//                       alt="Signature"
//                       style={{ width: '200px', height: '100px', border: '1px solid #ccc' }}
//                     />
//                   ) : (
//                     <p style={{ fontSize: '14px', color: '#888' }}>لم يتم إضافة توقيع</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-center mt-6">
//               <button
//                 type="submit"
//                 className={`relative bg-blue-500 text-white py-3 px-6 rounded-lg w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   isProcessing ? 'opacity-75 cursor-not-allowed' : ''
//                 }`}
//                 disabled={isProcessing !== null}
//               >
//                 <span className="flex items-center justify-center">
//                   {isProcessing === 'loading' && (
//                     <span className="absolute inset-0 flex items-center justify-center bg-blue-600 rounded-lg">
//                       <ClipLoader color="#ffffff" size={20} />
//                     </span>
//                   )}
//                   <span className={isProcessing === 'loading' ? 'invisible' : 'visible'}>
//                     تأكيد الاستلام
//                   </span>
//                 </span>
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <style jsx>{`
//         .email-loading-container {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           background: rgba(0, 0, 0, 0.5);
//           border-radius: 15px;
//           padding: 20px;
//         }

//         .email-icon {
//           position: relative;
//           width: 180px;
//           height: 150px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .loader {
//           position: absolute;
//           border-style: solid;
//           box-sizing: border-box;
//           border-width: 40px 60px 30px 60px;
//           border-color: #3760C9 #96DDFC #96DDFC #36BBF7;
//           animation: envFloating 1s ease-in infinite alternate, hide-loader 0.5s ease-in-out forwards;
//           animation-delay: 0s, 1s;
//         }

//         .loader:after {
//           content: "";
//           position: absolute;
//           right: 62px;
//           top: -40px;
//           height: 150px;
//           width: 150px;
//           background-image: linear-gradient(#fff 45px, transparent 0),
//                     linear-gradient(#fff 45px, transparent 0),
//                     linear-gradient(#fff 45px, transparent 0);
//           background-repeat: no-repeat;
//           background-size: 30px 4px;
//           background-position: 0px 11px, 8px 35px, 0px 60px;
//           animation: envDropping 0.75s linear infinite;
//         }

//         .check-icon {
//           position: absolute;
//           opacity: 0;
//           animation: show-check 0.5s ease-in-out forwards;
//           animation-delay: 1s;
//         }

//         .loading-text {
//           margin-top: 10px;
//           color: #fff;
//           font-size: 16px;
//           font-weight: 500;
//           animation: fade-out 0.5s ease-in-out forwards;
//           animation-delay: 1s;
//         }

//         @keyframes envFloating {
//           0% {
//             transform: translate(-2px, -5px);
//           }
//           100% {
//             transform: translate(0, 5px);
//           }
//         }

//         @keyframes envDropping {
//           0% {
//             background-position: 100px 11px, 115px 35px, 105px 60px;
//             opacity: 1;
//           }
//           50% {
//             background-position: 0px 11px, 20px 35px, 5px 60px;
//           }
//           60% {
//             background-position: -30px 11px, 0px 35px, -10px 60px;
//           }
//           75%,
//           100% {
//             background-position: -30px 11px, -30px 35px, -30px 60px;
//             opacity: 0;
//           }
//         }

//         @keyframes show-check {
//           0% {
//             opacity: 0;
//             transform: scale(0);
//           }
//           100% {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }

//         @keyframes fade-out {
//           0% {
//             opacity: 1;
//           }
//           100% {
//             opacity: 0;
//           }
//         }

//         @keyframes hide-loader {
//           0% {
//             opacity: 1;
//             transform: scale(1);
//           }
//           100% {
//             opacity: 0;
//             transform: scale(0);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

'use client';

import { useState, useRef, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import { ar } from 'date-fns/locale/ar';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { FaCheckCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { format } from 'date-fns-tz'; // استيراد format من date-fns-tz
import AuthGuard from '../components/AuthGuard';

registerLocale('ar', ar);

// دالة لتنسيق التاريخ بناءً على توقيت السعودية
const formatLocalDate = (date: Date | null): string => {
  if (!date) return '';
  return format(date, 'yyyy-MM-dd', { locale: ar, timeZone: 'Asia/Riyadh' });
};

// زر إضافة الأصل
const Checkbox = ({ onChange, checked }: { onChange: () => void; checked: boolean }) => {
  const uniqueId = `checkbox-${Math.random()}`;

  return (
    <StyledWrapper>
      <div className="checkbox-container">
        <div className="checkbox-wrapper">
          <input
            className="checkbox"
            id={uniqueId}
            type="checkbox"
            checked={checked}
            onChange={(e) => {
              console.log('Checkbox changed:', e.target.checked);
              onChange();
            }}
          />
          <label className="checkbox-label" htmlFor={uniqueId}>
            <div className="checkbox-flip">
              <div className="checkbox-front">
                <svg fill="white" height={32} width={32} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 13H12V19H11V13H5V12H11V6H12V12H19V13Z" className="icon-path" />
                </svg>
              </div>
              <div className="checkbox-back">
                <svg fill="white" height={32} width={32} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 19l-7-7 1.41-1.41L9 16.17l11.29-11.3L22 6l-13 13z" className="icon-path" />
                </svg>
              </div>
            </div>
          </label>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .checkbox-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin: 0;
  }

  .checkbox {
    display: none;
  }

  .checkbox-label {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }

  .checkbox-flip {
    width: 40px;
    height: 40px;
    perspective: 1000px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    transition: transform 0.4s ease;
  }

  .checkbox-front,
  .checkbox-back {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    backface-visibility: hidden;
    transition: transform 0.8s ease;
  }

  .checkbox-front {
    background: linear-gradient(135deg, rgb(35, 199, 43), rgb(13, 129, 42));
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: rotateY(0deg);
  }

  .checkbox-back {
    background: linear-gradient(135deg, #36b54a, #00c1d4);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: rotateY(180deg);
  }

  .checkbox-wrapper:hover .checkbox-flip {
    transform: scale(1.1);
    transition: transform 0.4s ease-out;
  }

  .checkbox:checked + .checkbox-label .checkbox-front {
    transform: rotateY(180deg);
  }

  .checkbox:checked + .checkbox-label .checkbox-back {
    transform: rotateY(0deg);
  }

  .checkbox:focus + .checkbox-label .checkbox-flip {
    box-shadow:
      0 0 15px rgba(54, 181, 73, 0.7),
      0 0 20px rgba(0, 193, 212, 0.4);
    transition: box-shadow 0.3s ease;
  }

  .icon-path {
    stroke: white;
    stroke-width: 2;
    fill: transparent;
  }
`;

// زر البحث
const SearchButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <StyledSearchButtonWrapper>
      <button className="button" onClick={onClick}>
        <span>
          <svg viewBox="0 0 24 24" height={24} width={24} xmlns="http://www.w3.org/2000/svg">
            <path d="M9.145 18.29c-5.042 0-9.145-4.102-9.145-9.145s4.103-9.145 9.145-9.145 9.145 4.103 9.145 9.145-4.102 9.145-9.145 9.145zm0-15.167c-3.321 0-6.022 2.702-6.022 6.022s2.702 6.022 6.022 6.022 6.023-2.702 6.023-6.022-2.702-6.022-6.023-6.022zm9.263 12.443c-.817 1.176-1.852 2.188-3.046 2.981l5.452 5.453 3.014-3.013-5.42-5.421z" />
          </svg>
        </span>
      </button>
    </StyledSearchButtonWrapper>
  );
};

const StyledSearchButtonWrapper = styled.div`
  .button {
    position: relative;
    border: none;
    background-color: white;
    color: #212121;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 600;
    gap: 10px;
    border-radius: 10px;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    overflow: hidden;
  }

  .button span {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .button::before {
    content: "";
    position: absolute;
    background-color: #1e90ff;
    width: 100%;
    height: 100%;
    left: 0%;
    bottom: 0%;
    transform: translate(-100%, 100%);
    border-radius: inherit;
  }

  .button svg {
    fill: rgb(29, 120, 211);
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .button:hover::before {
    animation: shakeBack 0.6s forwards;
  }

  .button:hover svg {
    fill: white;
    scale: 1.3;
  }

  .button:active {
    box-shadow: none;
  }

  @keyframes shakeBack {
    0% {
      transform: translate(-100%, 100%);
    }
    50% {
      transform: translate(20%, -20%);
    }
    100% {
      transform: translate(0%, 0%);
    }
  }
`;

// زر الحذف 
const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="group relative flex h-10 w-10 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-red-800 bg-red-400 hover:bg-red-600"
      onClick={onClick}
    >
      <svg
        viewBox="0 0 1.625 1.625"
        className="absolute -top-7 fill-white delay-100 group-hover:top-6 group-hover:animate-[spin_1.4s] group-hover:duration-1000"
        height={15}
        width={15}
      >
        <path d="M.471 1.024v-.52a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099h-.39c-.107 0-.195 0-.195-.195" />
        <path d="M1.219.601h-.163A.1.1 0 0 1 .959.504V.341A.033.033 0 0 0 .926.309h-.26a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099v-.39a.033.033 0 0 0-.032-.033" />
        <path d="m1.245.465-.15-.15a.02.02 0 0 0-.016-.006.023.023 0 0 0-.023.022v.108c0 .036.029.065.065.065h.107a.023.023 0 0 0 .023-.023.02.02 0 0 0-.007-.016" />
      </svg>
      <svg
        width={16}
        fill="none"
        viewBox="0 0 39 7"
        className="origin-right duration-500 group-hover:rotate-90"
      >
        <line strokeWidth={4} stroke="white" y2={5} x2={39} y1={5} />
        <line strokeWidth={3} stroke="white" y2="1.5" x2="26.0357" y1="1.5" x1={12} />
      </svg>
      <svg width={16} fill="none" viewBox="0 0 33 39" className="">
        <mask fill="white" id="path-1-inside-1_8_19">
          <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z" />
        </mask>
        <path
          mask="url(#path-1-inside-1_8_19)"
          fill="white"
          d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
        />
        <path strokeWidth={4} stroke="white" d="M12 6L12 29" />
        <path strokeWidth={4} stroke="white" d="M21 6V29" />
      </svg>
    </button>
  );
};

export default function Assets() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const rsCanvas = useRef<any>(null);

  const [employeeName, setEmployeeName] = useState('');
  const [receiptDate, setReceiptDate] = useState<Date | null>(null);
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState<'loading' | 'success' | null>(null);
  const [showThankYouCard, setShowThankYouCard] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>([]);

  const componentRef = useRef<HTMLDivElement>(null);

  const isValidImage = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };

  const base64ToBlob = (base64: string): Blob => {
    if (!base64 || !base64.includes(',')) {
      throw new Error('Invalid Base64 string: Missing data URI prefix or comma separator');
    }

    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const sendDataToServer = async () => {
    try {
      const formData = new FormData();
      formData.append('employeeName', employeeName);
      formData.append('receiptDate', formatLocalDate(receiptDate)); // استخدام formatLocalDate
      formData.append('records', JSON.stringify(selectedRecords));
      formData.append('email', email);

      if (signatureData && hasDrawn) {
        const isValid = await isValidImage(signatureData);
        if (isValid) {
          const blob = base64ToBlob(signatureData);
          formData.append('signature', blob, 'signature.png');
        } else {
          console.warn('Invalid signature image, skipping attachment');
        }
      }

      console.log('Sending data to server...');
      const response = await fetch('/api/SEND-MAIL', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'فشل إرسال البريد الإلكتروني');
      }

      console.log('تم إرسال البريد الإلكتروني بنجاح:', data);
      return true;
    } catch (error) {
      console.error('خطأ أثناء إرسال البيانات إلى الخادم:', error);
      toast.error('حدث خطأ أثناء إرسال البريد الإلكتروني: ' + (error as Error).message);
      return false;
    }
  };

  const handlePrint = () => {
    const printContent = componentRef.current;
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;

    setImageUrl(null);
    setSignatureData(null);
    setSelectedRecords([]);
    setEmployeeName('');
    setReceiptDate(null);
    setEmail('');
    setHasDrawn(false);
    clearSignature();

    window.location.reload();
  };

  const clearSignature = () => {
    rsCanvas.current?.resetCanvas();
    setSignatureData(null);
    setImageUrl(null);
    setHasDrawn(false);
  };

  const saveSignature = async () => {
    try {
      const paths = await rsCanvas.current.exportPaths();
      if (!paths || paths.length === 0) {
        toast.warn('يرجى رسم توقيع قبل الحفظ. اللوحة فارغة.');
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data = await rsCanvas.current.exportImage('png');
      console.log('Exported signature data:', data);

      const isValid = await isValidImage(data);
      if (!isValid) {
        toast.error('فشل تصدير التوقيع كصورة صالحة. يرجى إعادة الرسم والحفظ.');
        return;
      }

      setSignatureData(data);
      const blob = base64ToBlob(data);
      const objectUrl = URL.createObjectURL(blob);
      setImageUrl(objectUrl);
      console.log('تم حفظ التوقيع:', objectUrl);
    } catch (e) {
      console.error('خطأ أثناء حفظ التوقيع:', e);
      toast.error('حدث خطأ أثناء حفظ التوقيع. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleCanvasChange = async () => {
    const paths = await rsCanvas.current?.exportPaths();
    setHasDrawn(paths && paths.length > 0);
  };

  const handleAddAsset = (record: any) => {
    if (!record.fields['assetnum']) {
      toast.error('الأصل المختار لا يحتوي على رقم الأصل');
      return;
    }

    setSelectedRecords((prev) => [...prev, record]);
    setSearchResults([]);
    setSearchQuery('');
    setTempSelected([]);
    console.log('Asset added:', record);
  };

  const handleCheckboxChange = async (record: any) => {
    const recordId = record.id;
    console.log('Handling checkbox change for record:', recordId);

    if (tempSelected.includes(recordId)) {
      setTempSelected((prev) => prev.filter((id) => id !== recordId));
      console.log('Removed from tempSelected:', recordId);
    } else {
      setTempSelected((prev) => [...prev, recordId]);
      console.log('Added to tempSelected:', recordId);

      await new Promise((resolve) => setTimeout(resolve, 800));
      handleAddAsset(record);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing('loading');
    setShowThankYouCard(false);
  
    if (selectedRecords.length === 0) {
      toast.error('الرجاء إضافة على الأقل عهدة واحدة');
      setIsProcessing(null);
      return;
    }
  
    if (!employeeName || !receiptDate || !email) {
      toast.error('الرجاء إدخال اسم الموظف وتاريخ الاستلام والبريد الإلكتروني');
      setIsProcessing(null);
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('الرجاء إدخال بريد إلكتروني صالح');
      setIsProcessing(null);
      return;
    }
  
    const paths = await rsCanvas.current.exportPaths();
    if (!paths || paths.length === 0) {
      toast.error('يرجى رسم توقيع قبل التأكيد. اللوحة فارغة.');
      setIsProcessing(null);
      return;
    }
  
    if (!signatureData || !hasDrawn) {
      toast.error('الرجاء رسم وحفظ التوقيع قبل التأكيد');
      setIsProcessing(null);
      return;
    }
  
    if (!signatureData.startsWith('data:image/')) {
      toast.error('صيغة التوقيع غير صالحة. يرجى إعادة رسم وحفظ التوقيع.');
      setIsProcessing(null);
      return;
    }
  
    try {
      console.log('Sending data to /api/assetform:', {
        records: selectedRecords,
        employeeName,
        receiptDate: receiptDate.toISOString().split('T')[0],
        email,
        signature: signatureData,
      });
  
      const response = await fetch('/api/assetform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: selectedRecords,
          employeeName,
          receiptDate: formatLocalDate(receiptDate), // استخدام formatLocalDate
          email,
          signature: signatureData,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        toast.error(data.error || 'حدث خطأ ما');
        setIsProcessing(null);
        return;
      }
  
      setIsProcessing('success');
  
      // تقليل التأخير لعرض علامة الصح لمدة 800 مللي ثانية فقط
      await new Promise((resolve) => setTimeout(resolve, 800));
  
      toast.success('تم تسجيل العهدة بنجاح', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onOpen: () => setIsProcessing(null),
      });
  
      setShowThankYouCard(true);
  
      const emailSent = await sendDataToServer();
  
      if (emailSent) {
        toast.success('تم إرسال العهدة على البريد الإلكتروني بنجاح', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
  
        // تقليل مدة عرض رسالة الإيميل إلى 1000 مللي ثانية
        await new Promise((resolve) => setTimeout(resolve, 1000));
  
        setShowThankYouCard(false);
  
        // إعادة تعيين الحقول مباشرة دون طلب الطباعة
        setImageUrl(null);
        setSignatureData(null);
        setSelectedRecords([]);
        setEmployeeName('');
        setReceiptDate(null);
        setEmail('');
        setHasDrawn(false);
        clearSignature();
      } else {
        setShowThankYouCard(false);
        setIsProcessing(null);
      }
    } catch (err) {
      toast.error('حدث خطأ أثناء التسجيل: ' + (err as Error).message);
      setIsProcessing(null);
      setShowThankYouCard(false);
    }
  };

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/assetform?query=${searchQuery}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل البحث');
      }

      // تصفية النتائج لاستبعاد الأصول الموجودة في selectedRecords بناءً على assetnum
      const filteredResults = Array.isArray(data)
        ? data.filter(
            (item: any) =>
              !selectedRecords.some(
                (selected: any) => selected.fields['assetnum'] === item.fields['assetnum']
              )
          )
        : [];

      setSearchResults(filteredResults);

      if (filteredResults.length === 0) {
        toast.info('لا توجد أصول متاحة مطابقة لهذا البحث أو أن الأصل مختار بالفعل.');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAsset = (id: string) => {
    setSelectedRecords((prev) => prev.filter((record: any) => record.id !== id));
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (value.length <= 4 && /^\d*$/.test(value))) {
      setSearchQuery(value);
    }
  };

  const handleSearchQueryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    <AuthGuard>
    <div className="min-h-screen bg-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {(isProcessing || showThankYouCard) && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          {isProcessing ? (
            <div className="relative flex justify-center items-center w-24 h-24">
              <div className="absolute inset-0 bg-gray-600 bg-opacity-80 rounded-full"></div>
              {isProcessing === 'loading' && (
                <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin opacity-80"></div>
              )}
              {isProcessing === 'success' && (
                <FaCheckCircle className="text-green-500 w-16 h-16 animate-bounce" />
              )}
            </div>
          ) : showThankYouCard ? (
            <div className="email-loading-container">
              <div className="email-icon">
                <div className="loader" />
                <FaCheckCircle
                  className="check-icon"
                  style={{ color: '#28a745', width: '60px', height: '60px' }}
                />
              </div>
              <p className="loading-text">جارٍ إرسال البريد الإلكتروني...</p>
            </div>
          ) : null}
        </div>
      )}

      <div className="content-container">
        <div className="form-container">
          <h2 className="text-2xl font-bold text-center mb-6">نموذج تسليم عهدة</h2>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">البحث عن الأصل</label>
            <div className="flex justify-between items-center gap-2">
              <input
                type="number"
                value={searchQuery}
                onChange={handleSearchQueryChange}
                onKeyDown={handleSearchQueryKeyDown}
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-1"
                placeholder="ادخل 4 أرقام فقط"
                min="0"
                max="9999"
              />
              <SearchButton onClick={handleSearch} />
            </div>
          </div>

          {loading && <p className="text-blue-500">جارٍ البحث...</p>}
          {searchResults.length > 0 && (
            <ul className="mt-4 space-y-2">
              {searchResults.map((item: any) => (
                <li
                  key={item.id}
                  className="p-3 bg-gray-200 rounded-lg flex flex-row-reverse justify-between items-center"
                >
                  <Checkbox
                    checked={tempSelected.includes(item.id)}
                    onChange={() => handleCheckboxChange(item)}
                  />
                  <div className="text-right" style={{ direction: 'rtl', unicodeBidi: 'embed' }}>
                    <p className="font-bold">{item.fields['اسم الاصل'] || 'غير متوفر'}</p>
                    <p>الرقم التسلسلي: {item.fields['الرقم التسلسلي'] || 'غير متوفر'}</p>
                    <p>الشركة المصنعة: {item.fields['الشركة المصنعة'] || 'غير متوفر'}</p>
                    <div>
                      <strong>مواصفات إضافية:</strong>
                      {item.fields['مواصفات اضافية ']
                        ? item.fields['مواصفات اضافية '].split('\n').map((spec: string, index: number) => (
                            <p key={index}>{spec || 'غير متوفر'}</p>
                          ))
                        : <p>غير متوفر</p>}
                    </div>
                    <p>رقم الأصل: {item.fields['assetnum'] || 'غير متوفر'}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {selectedRecords.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">الأصول المختارة</h3>
              <ul className="space-y-2">
                {selectedRecords.map((record: any) => (
                  <li key={record.id} className="p-3 bg-gray-100 rounded-lg">
                    <details className="group">
                      <summary className="flex justify-between items-center cursor-pointer list-none">
                        <span>
                          {record.fields['اسم الاصل']} (رقم الأصل: {record.fields['assetnum']})
                        </span>
                        <span className="flex space-x-2">
                          <DeleteButton onClick={() => handleRemoveAsset(record.id)} />
                        </span>
                      </summary>
                      <div
                        className="mt-2 p-2 bg-white border border-gray-200 rounded text-right"
                        style={{ direction: 'rtl' }}
                      >
                        <p>
                          <strong>الرقم التسلسلي:</strong>{' '}
                          {record.fields['الرقم التسلسلي'] || 'غير متوفر'}
                        </p>
                        <p>
                          <strong>الشركة المصنعة:</strong>{' '}
                          {record.fields['الشركة المصنعة'] || 'غير متوفر'}
                        </p>
                        <div>
                          <strong>مواصفات إضافية:</strong>
                          {record.fields['مواصفات اضافية ']
                            ? record.fields['مواصفات اضافية '].split('\n').map((spec: string, index: number) => (
                                <p key={index}>{spec || 'غير متوفر'}</p>
                              ))
                            : <p>غير متوفر</p>}
                        </div>
                        <p>
                          <strong>رقم الأصل:</strong> {record.fields['assetnum'] || 'غير متوفر'}
                        </p>
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="employeeName" className="block text-gray-700 font-medium">
                اسم الموظف
              </label>
              <input
                type="text"
                id="employeeName"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="اسم الموظف"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="receiptDate" className="block text-gray-700 font-medium">
                تاريخ الاستلام
              </label>
              <DatePicker
                selected={receiptDate}
                onChange={(date: Date | null) => setReceiptDate(date)}
                dateFormat="yyyy-MM-dd"
                className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholderText="اختر تاريخ الاستلام"
                required
                locale="ar"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="البريد الإلكتروني"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium">التوقيع</label>
              <div>
                <ReactSketchCanvas
                  ref={rsCanvas}
                  width="400px"
                  height="200px"
                  strokeColor="black"
                  strokeWidth={5}
                  onChange={handleCanvasChange}
                />
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Signature"
                    style={{ marginTop: '10px', maxWidth: '200px' }}
                    onError={() => {
                      console.error('فشل تحميل صورة التوقيع');
                      setImageUrl(null);
                      setSignatureData(null);
                      setHasDrawn(false);
                    }}
                  />
                )}
              </div>
              <div className="flex space-x-2 mt-2">
                <button
                  type="button"
                  onClick={clearSignature}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  مسح التوقيع
                </button>
                <button
                  type="button"
                  onClick={saveSignature}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  حفظ التوقيع
                </button>
              </div>
            </div>

            <div ref={componentRef} style={{ display: 'none' }}>
              <div
                style={{
                  padding: '20px',
                  fontFamily: 'Arial, sans-serif',
                  direction: 'rtl',
                  textAlign: 'right',
                  width: '210mm',
                  minHeight: '297mm',
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                }}
              >
                <h1 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>
                  نموذج استلام عهدة
                </h1>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '16px', marginBottom: '5px' }}>
                    <strong>اسم الموظف:</strong> {employeeName || 'غير متوفر'}
                  </p>
                  <p style={{ fontSize: '16px', marginBottom: '5px' }}>
                    <strong>البريد الإلكتروني:</strong> {email || 'غير متوفر'}
                  </p>
                  <p style={{ fontSize: '16px', marginBottom: '5px' }}>
  <strong>تاريخ الاستلام:</strong>{' '}
  {receiptDate ? formatLocalDate(receiptDate) : 'غير متوفر'}
</p>
                </div>
                <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>الأصول المستلمة:</h2>
                {selectedRecords.length > 0 ? (
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      marginBottom: '20px',
                      direction: 'rtl',
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0' }}>
                          اسم الأصل
                        </th>
                        <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0' }}>
                          رقم الأصل
                        </th>
                        <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0' }}>
                          الرقم التسلسلي
                        </th>
                        <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0' }}>
                          الشركة المصنعة
                        </th>
                        <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0' }}>
                          مواصفات إضافية
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRecords.map((record: any) => (
                        <tr key={record.id}>
                          <td style={{ border: '1px solid #000', padding: '8px' }}>
                            {record.fields['اسم الاصل'] || 'غير متوفر'}
                          </td>
                          <td style={{ border: '1px solid #000', padding: '8px' }}>
                            {record.fields['assetnum'] || 'غير متوفر'}
                          </td>
                          <td style={{ border: '1px solid #000', padding: '8px' }}>
                            {record.fields['الرقم التسلسلي'] || 'غير متوفر'}
                          </td>
                          <td style={{ border: '1px solid #000', padding: '8px' }}>
                            {record.fields['الشركة المصنعة'] || 'غير متوفر'}
                          </td>
                          <td style={{ border: '1px solid #000', padding: '8px' }}>
                            {record.fields['مواصفات اضافية ']
                              ? record.fields['مواصفات اضافية '].split('\n').map((spec: string, index: number) => (
                                  <p key={index}>{spec || 'غير متوفر'}</p>
                                ))
                              : 'غير متوفر'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ fontSize: '14px', color: '#888' }}>لا توجد أصول مختارة</p>
                )}
                <div style={{ marginTop: '30px' }}>
                  <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>التوقيع:</h2>
                  {imageUrl && hasDrawn ? (
                    <img
                      src={imageUrl}
                      alt="Signature"
                      style={{ width: '200px', height: '100px', border: '1px solid #ccc' }}
                    />
                  ) : (
                    <p style={{ fontSize: '14px', color: '#888' }}>لم يتم إضافة توقيع</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className={`relative bg-blue-500 text-white py-3 px-6 rounded-lg w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isProcessing ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                disabled={isProcessing !== null}
              >
                <span className="flex items-center justify-center">
                  {isProcessing === 'loading' && (
                    <span className="absolute inset-0 flex items-center justify-center bg-blue-600 rounded-lg">
                      <ClipLoader color="#ffffff" size={20} />
                    </span>
                  )}
                  <span className={isProcessing === 'loading' ? 'invisible' : 'visible'}>
                    تأكيد الاستلام
                  </span>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .email-loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 15px;
          padding: 20px;
        }

        .email-icon {
          position: relative;
          width: 180px;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader {
          position: absolute;
          border-style: solid;
          box-sizing: border-box;
          border-width: 40px 60px 30px 60px;
          border-color: #3760C9 #96DDFC #96DDFC #36BBF7;
          animation: envFloating 1s ease-in infinite alternate, hide-loader 0.5s ease-in-out forwards;
          animation-delay: 0s, 1s;
        }

        .loader:after {
          content: "";
          position: absolute;
          right: 62px;
          top: -40px;
          height: 150px;
          width: 150px;
          background-image: linear-gradient(#fff 45px, transparent 0),
                    linear-gradient(#fff 45px, transparent 0),
                    linear-gradient(#fff 45px, transparent 0);
          background-repeat: no-repeat;
          background-size: 30px 4px;
          background-position: 0px 11px, 8px 35px, 0px 60px;
          animation: envDropping 0.75s linear infinite;
        }

        .check-icon {
          position: absolute;
          opacity: 0;
          animation: show-check 0.5s ease-in-out forwards;
          animation-delay: 1s;
        }

        .loading-text {
          margin-top: 10px;
          color: #fff;
          font-size: 16px;
          font-weight: 500;
          animation: fade-out 0.5s ease-in-out forwards;
          animation-delay: 1s;
        }

        @keyframes envFloating {
          0% {
            transform: translate(-2px, -5px);
          }
          100% {
            transform: translate(0, 5px);
          }
        }

        @keyframes envDropping {
          0% {
            background-position: 100px 11px, 115px 35px, 105px 60px;
            opacity: 1;
          }
          50% {
            background-position: 0px 11px, 20px 35px, 5px 60px;
          }
          60% {
            background-position: -30px 11px, 0px 35px, -10px 60px;
          }
          75%,
          100% {
            background-position: -30px 11px, -30px 35px, -30px 60px;
            opacity: 0;
          }
        }

        @keyframes show-check {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-out {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes hide-loader {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0);
          }
        }
      `}</style>
    </div>
    </AuthGuard>
  );
}