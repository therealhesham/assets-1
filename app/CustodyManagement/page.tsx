
'use client';

import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { FaCheckCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import html2pdf from 'html2pdf.js';

// واجهات البيانات (Interfaces)
interface Asset {
  id: string;
  fields: {
    'اسم الاصل': string;
    'assetnum': string;
    'الرقم التسلسلي': string;
    'الشركة المصنعة': string;
    'الحالة': string;
    'مواصفات اضافية '?: string;
  };
}

interface Custody {
  id: string;
  fields: {
    'اسم الموظف': string;
    'رقم العهدة': number;
    'رقم الاصل': string[];
    'تاريخ الاستلام'?: string;
    'التوقيع'?: { url: string }[];
    'ملاحظات'?: string;
    'Email'?: string;
  };
  assets?: Asset[];
}

interface EmployeeCustodies {
  employeeName: string;
  custodies: Custody[];
}

interface CardProps {
  employeeName: string;
  custodies: Custody[];
}

// دالة لتحويل رقم الأصل إلى نوع الأصل
const getAssetType = (assetnum: string): string => {
  if (!assetnum || assetnum.length < 2) return 'غير محدد';
  const firstDigit = assetnum[0];
  const secondDigit = assetnum[1];

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

// مكون البطاقة (Card)
const Card: React.FC<CardProps> = ({ employeeName, custodies }) => {
  return (
    <StyledCardWrapper>
      <div className="card">
        <div className="upper-part">
          <div className="upper-part-face">{employeeName}</div>
          <div className="upper-part-back">
            <div className="scroll-container">
              {custodies.map((custody) => (
                <div key={custody.id} className="mb-2">
                  <p>رقم العهدة: {custody.fields['رقم العهدة']}</p>
                  <p>
                    تاريخ الاستلام:{' '}
                    {custody.fields['تاريخ الاستلام']
                      ? new Date(custody.fields['تاريخ الاستلام']).toLocaleDateString('ar-EG')
                      : 'غير محدد'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lower-part">
          <div className="lower-part-face">تفاصيل العهد</div>
          <div className="lower-part-back">اضغط لعرض التفاصيل</div>
        </div>
      </div>
    </StyledCardWrapper>
  );
};

const StyledCardWrapper = styled.div`
  .card {
    width: 190px;
    height: 254px;
    position: relative;
    border-radius: 40px;
    transition: all 0.8s;
    perspective: 600px;
    perspective-origin: center bottom;
    cursor: pointer;
  }

  .upper-part {
    width: 100%;
    height: 65%;
    border-radius: 40px 40px 0 0;
    position: relative;
    transform-style: preserve-3d;
    transition: all 0.9s;
  }

  .upper-part-face,
  .upper-part-back {
    text-align: center;
    background-color: white;
    color: rgb(0, 0, 0);
    border: 3px solid #1e90ff;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 40px 40px 0 0;
    font-weight: bold;
    z-index: 2;
    backface-visibility: hidden;
    transition: all 0.6s;
    box-sizing: border-box;
  }

  .upper-part-back {
    background-color: #1e90ff;
    color: white;
    transform: rotateX(180deg);
    display: block;
    text-align: right;
    padding: 0;
    overflow: hidden;
  }

  .scroll-container {
    width: 100%;
    height: 90%;
    overflow-y: auto;
    padding: 5px;
    box-sizing: border-box;
    margin-top: 20px;
    border-radius: 20px;
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #555;
      border-radius: 10px;
    }
    scrollbar-width: thin;
    scrollbar-color: #888 transparent;
  }

  .lower-part {
    width: 100%;
    height: 35%;
    border-radius: 0 0 40px 40px;
    position: relative;
    transform-style: preserve-3d;
    transform-origin: center top;
    transition: all 0.9s;
  }

  .lower-part-face,
  .lower-part-back {
    background-color: #1e90ff;
    width: 100%;
    height: 100%;
    color: white;
    font-weight: bold;
    position: absolute;
    border-radius: 0 0 40px 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translate(0, -0.8px);
    backface-visibility: hidden;
    z-index: 2;
  }

  .lower-part-back {
    backface-visibility: visible;
    border-radius: 40px;
    color: rgb(11, 12, 12);
    background-color: white;
    transform: rotateX(180deg);
    z-index: 1;
    transition: border-radius 0.6s;
  }

  .card:hover > .upper-part {
    transform: rotateX(-0.5turn);
  }

  .card:hover > .lower-part {
    transform: translateY(88.3px) rotateX(0.5turn);
  }

  .card:hover > .lower-part > .lower-part-back {
    border: 3px solid #005eb8;
    border-radius: 0 0 40px 40px;
  }
`;

// مكون البحث المخصص (SearchInput)
const SearchInput = ({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  return (
    <StyledSearchWrapper>
      <div className="container">
        <input
          type="text"
          name="text"
          className="input"
          value={value}
          onChange={onChange}
          required
          placeholder="اكتب للبحث..."
        />
        <div className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512">
            <title>Search</title>
            <path
              d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
              fill="none"
              stroke="currentColor"
              strokeMiterlimit={10}
              strokeWidth={32}
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeMiterlimit={10}
              strokeWidth={32}
              d="M338.29 338.29L448 448"
            />
          </svg>
        </div>
      </div>
    </StyledSearchWrapper>
  );
};

const StyledSearchWrapper = styled.div`
  .container {
    position: relative;
    --size-button: 40px;
    color: white;
  }

  .input {
    padding-left: 60px;
    padding-left: var(--size-button);
    height: var(--size-button);
    font-size: 15px;
    border: none;
    color: #fff;
    outline: none;
    width: var(--size-button);
    transition: all ease 0.3s;
    background-color: #1e90ff;
    box-shadow: 1.5px 1.5px 3px rgb(0, 0, 0), -1.5px -1.5px 3px rgb(95 94 94 / 25%), inset 0px 0px 0px #0e0e0e, inset 0px -0px 0px #5f5e5e;
    border-radius: 50px;
    cursor: pointer;
  }

  .input:focus,
  .input:not(:invalid) {
    width: 200px;
    cursor: text;
    box-shadow: 0px 0px 0px #0e0e0e, 0px 0px 0px rgb(95 94 94 / 25%), inset 1.5px 1.5px 3px #0e0e0e, inset -1.5px -1.5px 3px #5f5e5e;
  }

  .input:focus + .icon,
  .input:not(:invalid) + .icon {
    pointer-events: all;
    cursor: pointer;
  }

  .container .icon {
    position: absolute;
    width: var(--size-button);
    height: var(--size-button);
    top: 0;
    left: 0;
    padding: 8px;
    pointer-events: none;
  }

  .container .icon svg {
    width: 100%;
    height: 100%;
  }
  .input::placeholder {
    text-align: right;
    padding-right: 10px;
  }
`;

// مكون CustodyManagement
export default function CustodyManagement() {
  const [employeeCustodies, setEmployeeCustodies] = useState<EmployeeCustodies[]>([]);
  const [filteredCustodies, setFilteredCustodies] = useState<EmployeeCustodies[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeCustodies | null>(null);
  const [editingCustody, setEditingCustody] = useState<Custody | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showClearanceModal, setShowClearanceModal] = useState(false);
  const [custodyToClear, setCustodyToClear] = useState<Custody | null>(null);
  const [showEmailAnimation, setShowEmailAnimation] = useState(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [assetToRemove, setAssetToRemove] = useState<string | null>(null);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showAssetDeleteModal, setShowAssetDeleteModal] = useState(false);
const [user,setUser]=useState("")
  const handleCanvasChange = async () => {
    const paths = await canvasRef.current?.exportPaths();
    setHasDrawn(paths && paths.length > 0);
  };

  useEffect(() => {
    fetchCustodies();
  }, []);

  const fetchCustodies = async () => {
    try {
      const res = await fetch('/api/CustodyManagement');
      const responseText = await res.text();
      console.log('Response Text from /api/CustodyManagement:', responseText);

      let data: Custody[];
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error(`فشل في تحليل استجابة الخادم: ${responseText}`);
      }

      if (!res.ok) {
        throw new Error('فشل في استرجاع العهد');
      }

      const custodiesWithAssets = await Promise.all(
        data.map(async (custody) => {
          const assetIds = Array.isArray(custody.fields['رقم الاصل']) ? custody.fields['رقم الاصل'] : [];
          if (assetIds.length === 0) {
            return { ...custody, assets: [] };
          }

          const assetsRes = await fetch('/api/CustodyManagement', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ assetIds }),
          });

          const assetsText = await assetsRes.text();
          let assets: Asset[];
          try {
            assets = JSON.parse(assetsText);
          } catch (parseError) {
            console.error('Failed to parse assets response as JSON:', parseError);
            throw new Error(`فشل في تحليل بيانات الاصول: ${assetsText}`);
          }

          if (!assetsRes.ok) {
            throw new Error('فشل في جلب تفاصيل الاصول');
          }

          return { ...custody, assets };
        })
      );

      const groupedByEmployee = custodiesWithAssets.reduce((acc, custody) => {
        const employeeName = custody.fields['اسم الموظف'] || 'غير محدد';
        const existing = acc.find((item) => item.employeeName === employeeName);

        if (existing) {
          existing.custodies.push(custody);
        } else {
          acc.push({
            employeeName,
            custodies: [custody],
          });
        }
        return acc;
      }, [] as EmployeeCustodies[]);

      setEmployeeCustodies(groupedByEmployee);
      setFilteredCustodies(groupedByEmployee);
    } catch (error: any) {
      console.error('Error fetching custodies:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCustodies(employeeCustodies);
    } else {
      const filtered = employeeCustodies.filter((employee) =>
        employee.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCustodies(filtered);
    }
  }, [searchQuery, employeeCustodies]);

  const handleCardClick = (employee: EmployeeCustodies) => {
    setSelectedEmployee(employee);
    setShowModal(true);
    setSuccessMessage(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
    setEditingCustody(null);
    setSuccessMessage(null);
    setAssetToRemove(null);
  };

  const startEditing = (custody: Custody) => {
    setEditingCustody(custody);
    setSuccessMessage(null);
  };

  const cancelEditing = () => {
    setEditingCustody(null);
    setSuccessMessage(null);
    setAssetToRemove(null);
  };

  const updateCustody = async (custodyId: string, updatedFields: Partial<Custody['fields']>) => {
    try {
      setIsProcessing(true);

      const res = await fetch(`/api/CustodyManagement`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: custodyId, fields: updatedFields }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'فشل في تحديث العهدة');
      }

      setIsProcessing(false);
      setSuccessMessage('تم تحديث العهدة بنجاح!');
      setEditingCustody(null);
      setAssetToRemove(null);
      await fetchCustodies();
      if (selectedEmployee) {
        const updatedCustodies = selectedEmployee.custodies.map((custody) =>
          custody.id === custodyId ? { ...custody, fields: { ...custody.fields, ...updatedFields } } : custody
        );
        setSelectedEmployee({
          ...selectedEmployee,
          custodies: updatedCustodies,
        });
      }
    } catch (error: any) {
      console.error('Error updating custody:', error);
      setIsProcessing(false);
      setError(error.message);
    }
  };

  const startAssetRemoval = (custodyId: string, assetId: string) => {
    if (!editingCustody || !editingCustody.fields['Email']) {
      toast.error('البريد الإلكتروني غير متوفر في سجل العهدة');
      return;
    }

    if (editingCustody.fields['رقم الاصل'].length <= 1) {
      toast.error('لا يمكن حذف الأصل الوحيد في العهدة');
      return;
    }

    setAssetToRemove(assetId);
    setShowAssetDeleteModal(true);
  };

  const confirmAssetRemoval = async () => {
    if (!editingCustody || !assetToRemove) return;

    try {
      setIsProcessing(true);

      const updatedAssetIds = editingCustody.fields['رقم الاصل'].filter((id) => id !== assetToRemove);
      const formData = new FormData();
      formData.append('id', editingCustody.id);
      formData.append('employeeName', editingCustody.fields['اسم الموظف']);
      formData.append('receiptDate', editingCustody.fields['تاريخ الاستلام'] || '');
      formData.append('records', JSON.stringify(updatedAssetIds));
      formData.append('email', editingCustody.fields['Email'] || '');
      formData.append('removedAssetId', assetToRemove);

      const res = await fetch(`/api/CustodyManagement`, {
        method: 'PATCH',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'فشل في حذف الأصل وإرسال الإيميل');
      }

      setIsProcessing(false);
      setShowEmailAnimation(true);

      toast.success('تم حذف الأصل وإرسال الإيميل بنجاح!', {
        icon: <FaCheckCircle className="text-green-500" />,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowEmailAnimation(false);
      setAssetToRemove(null);
      setShowAssetDeleteModal(false);
      await updateCustody(editingCustody.id, { 'رقم الاصل': updatedAssetIds });
    } catch (error: any) {
      console.error('Error removing asset:', error);
      setIsProcessing(false);
      toast.error(error.message);
    }
  };

  const cancelAssetRemoval = () => {
    setShowAssetDeleteModal(false);
    setAssetToRemove(null);
  };

  const startClearance = (custody: Custody) => {
    setCustodyToClear(custody);
    setShowClearanceModal(true);
    setSuccessMessage(null);
  };

  const closeClearanceModal = () => {
    setShowClearanceModal(false);
    setCustodyToClear(null);
    if (canvasRef.current) {
      canvasRef.current.resetCanvas();
      setHasDrawn(false);
    }
    setShowEmailAnimation(false);
    setIsProcessing(false);
  };

  const clearCustody = async () => {
    if (!custodyToClear || !canvasRef.current) return;

    if (!custodyToClear.fields['Email']) {
      toast.error('البريد الإلكتروني غير متوفر في سجل العهدة');
      return;
    }

    try {
      const paths = await canvasRef.current.exportPaths();
      if (!paths || paths.length === 0) {
        toast.error('يرجى رسم توقيع قبل تأكيد إخلاء العهدة. اللوحة فارغة.');
        return;
      }

      const signatureDataUrl = await canvasRef.current.exportImage('png');
      if (!signatureDataUrl || !signatureDataUrl.startsWith('data:image/')) {
        toast.error('صيغة التوقيع غير صالحة. يرجى إعادة الرسم.');
        return;
      }

      setIsProcessing(true);

      const formData = new FormData();
      formData.append('id', custodyToClear.id);
      formData.append('employeeName', custodyToClear.fields['اسم الموظف']);
      formData.append('receiptDate', custodyToClear.fields['تاريخ الاستلام'] || '');
      const assetIds = Array.isArray(custodyToClear.fields['رقم الاصل']) ? custodyToClear.fields['رقم الاصل'] : [];
      formData.append('records', JSON.stringify(assetIds));
      formData.append('email', custodyToClear.fields['Email'] || '');
      formData.append('signature', signatureDataUrl);

      const res = await fetch(`/api/CustodyManagement`, {
        method: 'DELETE',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'فشل في إخلاء العهدة');
      }

      setIsProcessing(false);
      setShowEmailAnimation(true);

      toast.success('تم حذف العهدة بنجاح!', {
        icon: <FaCheckCircle className="text-green-500" />,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowClearanceModal(false);
      setCustodyToClear(null);
      setShowEmailAnimation(false);
      setHasDrawn(false);
      await fetchCustodies();

      if (selectedEmployee) {
        const updatedCustodies = selectedEmployee.custodies.filter(
          (custody) => custody.id !== custodyToClear.id
        );
        setSelectedEmployee({
          ...selectedEmployee,
          custodies: updatedCustodies,
        });
      }
    } catch (error: any) {
      console.error('Error clearing custody:', error);
      setIsProcessing(false);
      toast.error(error.message);
    }
  };

  const downloadCustodyPDF = async (custody: Custody) => {
    try {
      setIsProcessing(true);
  
      const assetIds = Array.isArray(custody.fields['رقم الاصل']) ? custody.fields['رقم الاصل'] : [];
      let assets: Asset[] = custody.assets || [];
  
      if (!assets.length && assetIds.length > 0) {
        const assetsRes = await fetch('/api/CustodyManagement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assetIds }),
        });
        if (!assetsRes.ok) throw new Error('فشل في جلب بيانات الأصول');
        assets = await assetsRes.json();
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
  
      let logoBase64 = '';
      try {
        const logoRes = await fetch('/logo.png');
        if (!logoRes.ok) throw new Error('فشل في جلب الشعار');
        const logoBlob = await logoRes.blob();
        logoBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
          reader.readAsDataURL(logoBlob);
        });
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
  
      const employeeName = custody.fields['اسم الموظف'] || 'غير متوفر';
      const receiptDate = custody.fields['تاريخ الاستلام'] || 'غير متوفر';
      const email = custody.fields['Email'] || 'غير متوفر';
      const signatureDataUrl = custody.fields['التوقيع']?.[0]?.url
        ? await fetch(custody.fields['التوقيع'][0].url)
            .then((res) => res.blob())
            .then((blob) =>
              new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                reader.readAsDataURL(blob);
              })
            )
        : null;
  
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>نموذج استلام عهدة</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              direction: rtl;
              text-align: right;
              margin: 20px;
              padding: 0;
              font-size: 12px;
              line-height: 1.5;
              color: #333;
            }
            .header {
              position: relative;
              width: 100%;
              height: 60px;
              margin-bottom: 20px;
            }
            .logo {
              position: absolute;
              top: 0;
              right: 0;
              width: 100px;
              height: auto;
              max-height: 50px;
            }
            h1 {
              text-align: center;
              font-size: 24px;
              margin: 60px 0 20px 0;
              color: #1976d2;
              font-weight: bold;
            }
            .info {
              margin-bottom: 10px;
              font-size: 14px;
              font-weight: 500;
            }
            .info strong {
              font-weight: bold;
              color: #000;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              font-size: 10px;
              table-layout: fixed;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: right;
              word-wrap: break-word;
              overflow-wrap: break-word;
              white-space: normal;
              vertical-align: middle;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
              color: #000;
            }
            td {
              background-color: #fff;
            }
            th:nth-child(1), td:nth-child(1) { width: 20%; }
            th:nth-child(2), td:nth-child(2) { width: 20%; }
            th:nth-child(3), td:nth-child(3) { width: 20%; }
            th:nth-child(4), td:nth-child(4) { width: 20%; }
            th:nth-child(5), td:nth-child(5) { width: 20%; }
            .signature {
              margin-top: 30px;
              font-size: 14px;
            }
            .signature img {
              width: 120px;
              height: 60px;
              margin-top: 5px;
            }
            @media print {
              table { page-break-inside: auto; }
              tr { page-break-inside: avoid; page-break-after: auto; }
              thead { display: table-header-group; }
              tbody { display: table-row-group; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            ${logoBase64 ? `<img src="data:image/png;base64,${logoBase64}" alt="Logo" class="logo" />` : '<div>الشعار غير متوفر</div>'}
          </div>
          <h1>نموذج استلام عهدة</h1>
          <div class="info"><strong>اسم الموظف:</strong> ${employeeName}</div>
          <div class="info"><strong>تاريخ الاستلام:</strong> ${receiptDate}</div>
          <div class="info"><strong>البريد الإلكتروني:</strong> ${email}</div>
          <div class="info"><strong>الأصول المستلمة:</strong></div>
          ${
            cleanedRecords.length > 0
              ? `
                <table>
                  <thead>
                    <tr>
                      <th>اسم الأصل</th>
                      <th>رقم الأصل</th>
                      <th>الرقم التسلسلي</th>
                      <th>الشركة المصنعة</th>
                      <th>مواصفات إضافية</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${cleanedRecords
                      .map((record) => {
                        const specs = record.fields['مواصفات اضافية '] || 'غير متوفر';
                        const specsLines = specs.split('\n').join('<br>');
                        return `
                          <tr>
                            <td>${record.fields['اسم الاصل']}</td>
                            <td>${record.fields['assetnum']}</td>
                            <td>${record.fields['الرقم التسلسلي']}</td>
                            <td>${record.fields['الشركة المصنعة']}</td>
                            <td>${specsLines}</td>
                          </tr>
                        `;
                      })
                      .join('')}
                  </tbody>
                </table>
              `
              : '<div>لا توجد أصول مستلمة</div>'
          }
          <div class="signature">
            <div><strong>التوقيع:</strong></div>
            ${
              signatureDataUrl
                ? `<img src="data:image/png;base64,${signatureDataUrl}" alt="Signature" />`
                : '<div>لم يتم إضافة توقيع</div>'
            }
          </div>
        </body>
        </html>
      `;
  
      const opt = {
        margin: [20, 20, 20, 20],
        filename: `custody_receipt_${custody.fields['رقم العهدة']}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: true,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          putOnlyUsedFonts: true,
        },
      };
  
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf().set(opt).from(htmlContent).toPdf().get('pdf').then((pdf: any) => {
        pdf.save();
      });
      setIsProcessing(false);
      toast.success('تم تحميل نموذج استلام العهدة بنجاح!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsProcessing(false);
      toast.error('فشل في تحميل ملف PDF: ' + (error as Error).message);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">جارٍ تحميل العهد...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">خطأ: {error}</div>;
  }

  return (
    <div className="container mx-auto bg-gray-50 min-h-screen p-8 antialiased">
      
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">إدارة العهد المستلمة</h2>

        <div className="mb-6 flex justify-start">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredCustodies.length === 0 ? (
          <div className="text-center text-gray-500">لا توجد عهد تطابق البحث.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCustodies.map((employee) => (
              <div key={employee.employeeName} onClick={() => handleCardClick(employee)}>
                <Card employeeName={employee.employeeName} custodies={employee.custodies} />
              </div>
            ))}
          </div>
        )}

        {showModal && selectedEmployee && (
          <div className="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover">
            <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm z-0"></div>
            <div
              className="w-full max-w-2xl p-5 relative mx-auto my-auto rounded-xl shadow-lg"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div>
                <div className="text-center p-5 flex-auto justify-center">
                  <h2 className="text-xl font-bold py-4">
                    تفاصيل العهد للموظف: {selectedEmployee.employeeName}
                  </h2>
                </div>
                {successMessage && (
                  <div className="text-center text-green-500 mb-4">{successMessage}</div>
                )}
                <div className="p-3 max-h-96 overflow-y-auto">
                  {selectedEmployee.custodies.map((custody) => (
                    <div key={custody.id} className="mb-6 border-b pb-4">
                      {editingCustody && editingCustody.id === custody.id ? (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            تعديل العهدة: {custody.fields['رقم العهدة']}
                          </h3>
                          <div className="mb-2">
                            <label className="block text-gray-600">الملاحظات:</label>
                            <textarea
                              value={editingCustody.fields['ملاحظات'] || ''}
                              onChange={(e) =>
                                setEditingCustody({
                                  ...editingCustody,
                                  fields: {
                                    ...editingCustody.fields,
                                    'ملاحظات': e.target.value,
                                  },
                                })
                              }
                              className="border rounded p-2 w-full"
                            />
                          </div>
                          <div className="mb-2">
                            <label className="block text-gray-600">الأصول المرتبطة:</label>
                            {editingCustody.assets && editingCustody.assets.length > 0 ? (
                              <ul className="list-disc mr-5">
                                {editingCustody.assets.map((asset) => (
                                  <li key={asset.id} className="text-gray-600 flex justify-between items-center">
                                    <span>
                                      {getAssetType(asset.fields['assetnum']) !== 'غير محدد'
                                        ? `${getAssetType(asset.fields['assetnum'])}: ${asset.fields['assetnum']}`
                                        : `رقم الأصل: ${asset.fields['assetnum']}`}
                                    </span>
                                    <button
                                      onClick={() => startAssetRemoval(custody.id, asset.id)}
                                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    >
                                      حذف الأصل
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500">لا توجد أصول مرتبطة.</p>
                            )}
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                updateCustody(custody.id, {
                                  'تاريخ الاستلام': editingCustody.fields['تاريخ الاستلام'],
                                  'ملاحظات': editingCustody.fields['ملاحظات'],
                                })
                              }
                              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={isProcessing || assetToRemove !== null}
                            >
                              حفظ
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                              إلغاء
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            رقم العهدة: {custody.fields['رقم العهدة']}
                          </h3>
                          <p className="text-gray-600">
                            <strong>تاريخ الاستلام:</strong>{' '}
                            {custody.fields['تاريخ الاستلام']
                              ? new Date(custody.fields['تاريخ الاستلام']).toLocaleDateString('ar-EG')
                              : 'غير محدد'}
                          </p>
                          <p className="text-gray-600">
                            <strong>الأصول المرتبطة:</strong>
                          </p>
                          {custody.assets && custody.assets.length > 0 ? (
                            <ul className="list-disc mr-5">
                              {custody.assets.map((asset) => (
                                <li key={asset.id} className="text-gray-600">
                                  {getAssetType(asset.fields['assetnum']) !== 'غير محدد'
                                    ? `${getAssetType(asset.fields['assetnum'])}: ${asset.fields['assetnum']}`
                                    : `رقم الأصل: ${asset.fields['assetnum']}`}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">لا توجد أصول مرتبطة.</p>
                          )}
                          <p className="text-gray-600">
                            <strong>الملاحظات:</strong>{' '}
                            {custody.fields['ملاحظات'] || 'لا توجد ملاحظات'}
                          </p>
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={() => startEditing(custody)}
                              className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => startClearance(custody)}
                              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                            >
                              إخلاء العهدة
                            </button>
                            <button
                              onClick={() => downloadCustodyPDF(custody)}
                              className={`bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={isProcessing}
                            >
                              تحميل كـ PDF
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-3 mt-2 text-center">
                  <button
                    onClick={closeModal}
                    className="bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAssetDeleteModal && editingCustody && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-80">
            <div className="w-full max-w-lg p-5 bg-white rounded-xl shadow-lg">
              <div className="text-center p-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 text-red-500 mx-auto"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <h2 className="text-xl font-bold py-4">هل أنت متأكد؟</h2>
                <p className="text-sm text-gray-500 px-8">
                  هل تريد حقًا حذف هذا الأصل من العهدة؟ سيتم إرسال إشعار بالبريد الإلكتروني إلى {editingCustody.fields['Email']}.
                </p>
              </div>
              <div className="p-3 text-center space-x-4">
                <button
                  onClick={cancelAssetRemoval}
                  className="bg-white px-5 py-2 text-sm font-medium border text-gray-600 rounded-full hover:bg-gray-100"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmAssetRemoval}
                  className={`bg-red-500 px-5 py-2 text-sm font-medium text-white rounded-full hover:bg-red-600 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isProcessing}
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        )}

        {showClearanceModal && custodyToClear && (
          <div className="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover">
            <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm z-0"></div>
            <div
              className="w-full max-w-md p-5 relative mx-auto my-auto rounded-xl shadow-lg"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div>
                <div className="text-center p-5 flex-auto justify-center">
                  <h2 className="text-xl font-bold py-4">إخلاء العهدة</h2>
                  <p className="text-gray-600 mb-4">
                    سيتم إرسال إشعار الإخلاء إلى: {custodyToClear.fields['Email']}
                  </p>
                </div>
                <div className="p-3">
                  <label className="block text-gray-600 mb-2">التوقيع:</label>
                  <ReactSketchCanvas
                    ref={canvasRef}
                    strokeWidth={4}
                    strokeColor="black"
                    canvasColor="white"
                    onChange={handleCanvasChange}
                    style={{ border: '1px solid #ccc', borderRadius: '4px', width: '100%', height: '150px' }}
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => canvasRef.current?.resetCanvas()}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      مسح التوقيع
                    </button>
                    <button
                      onClick={clearCustody}
                      className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isProcessing}
                    >
                      تأكيد الإخلاء
                    </button>
                    <button
                      onClick={closeClearanceModal}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="relative flex justify-center items-center w-24 h-24">
              <div className="absolute inset-0 bg-gray-600 bg-opacity-80 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin opacity-80"></div>
            </div>
          </div>
        )}

        {showEmailAnimation && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
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
          </div>
        )}
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
          border-color: #3760c9 #96ddfc #96ddfc #36bbf7;
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
          0% { transform: translate(-2px, -5px); }
          100% { transform: translate(0, 5px); }
        }

        @keyframes envDropping {
          0% { background-position: 100px 11px, 115px 35px, 105px 60px; opacity: 1; }
          50% { background-position: 0px 11px, 20px 35px, 5px 60px; }
          60% { background-position: -30px 11px, 0px 35px, -10px 60px; }
          75%, 100% { background-position: -30px 11px, -30px 35px, -30px 60px; opacity: 0; }
        }

        @keyframes show-check {
          0% { opacity: 0; transform: scale(0); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes fade-out {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes hide-loader {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0); }
        }
      `}</style>
    </div>
  );
}