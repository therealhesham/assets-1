

'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
const Select = dynamic(() => import('react-select'), { ssr: false });
import { ClipLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { FaDesktop, FaLaptop, FaPrint, FaNetworkWired, FaTv, FaServer, FaBox } from 'react-icons/fa';
import { FaCheck, FaTimes } from 'react-icons/fa';
import AuthGuard from './components/AuthGuard';

export default function AssetAdmin() {
  const router = useRouter();

  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState(null);
  const [editedAssetNumber, setEditedAssetNumber] = useState('');
  const [editedName, setEditedName] = useState('');
  const [editedSerialNumber, setEditedSerialNumber] = useState('');
  const [editedManufacturer, setEditedManufacturer] = useState(null);
  const [editedAssetCondition, setEditedAssetCondition] = useState(null);
  const [editedSpecifications, setEditedSpecifications] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editErrorMessage, setEditErrorMessage] = useState('');
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const rsCanvas = useRef<any>(null);

  const [selectedDeviceType, setSelectedDeviceType] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedManufacturerFilter, setSelectedManufacturerFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const companies = [
    { value: 'dell | ديل', label: 'Dell | ديل' },
    { value: 'hp | اتش بي', label: 'HP | اتش بي' },
    { value: 'lenovo | لينوفو', label: 'Lenovo | لينوفو' },
    { value: 'apple | ابل', label: 'Apple | ابل' },
    { value: 'asus | ايسوس', label: 'Asus | ايسوس' },
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
    { value: 'Lexar |  ليكسر', label: 'Lexar |  ليكسر' },
    { value: 'SanDisk | سان ديسك', label: 'SanDisk | سان ديسك' },
    { value: 'STC | إس تي سي', label: 'STC | إس تي سي' },
    { value: 'Zain | زين', label: 'Zain | زين' },
    { value: 'Mobily | موبايلي', label: 'Mobily | موبايلي' },
    { value: 'other | شركة أخرى', label: 'Other | شركة أخرى' },
  ];

  const assetConditionsForFilter = [
    { value: 'جديد', label: 'جديد' },
    { value: 'مستخدم', label: 'مستخدم' },
    { value: 'بحاجة صيانة', label: 'بحاجة صيانة' },
    { value: 'مخزن', label: 'مخزن' },
  ];

  const assetConditionsForEdit = [
    { value: 'جديد', label: 'جديد' },
    { value: 'بحاجة صيانة', label: 'بحاجة صيانة' },
    { value: 'مخزن', label: 'مخزن' },
  ];

  const deviceTypes = [
    { value: 'جهاز كمبيوتر', label: 'جهاز كمبيوتر' },
    { value: 'لاب توب', label: 'لاب توب' },
    { value: 'شاشة كمبيوتر', label: 'شاشة كمبيوتر' },
    { value: 'جوال', label: 'جوال' },
    { value: 'تابلت', label: 'تابلت' },
    { value: 'شريحة اتصال', label: 'شريحة اتصال' },
    { value: 'تليفون شبكة', label: 'تليفون شبكة' },
    { value: 'كيبورد', label: 'كيبورد' },
    { value: 'ماوس', label: 'ماوس' },
    { value: 'طابعة', label: 'طابعة' },
    { value: 'سويتشات', label: 'سويتشات' },
    { value: 'كيبل نت', label: 'كيبل نت' },
    { value: 'كيبل HDMI', label: 'كيبل HDMI' },
    { value: 'كاميرات', label: 'كاميرات' },
    { value: 'جهاز DVR', label: 'جهاز DVR' },
    { value: 'اكسس بوينت', label: 'اكسس بوينت' },
    { value: 'سماعات', label: 'سماعات' },
    { value: 'عدة صيانة', label: 'عدة صيانة' },
    { value: 'جهاز نقل الألياف', label: 'جهاز نقل الألياف' },
    { value: 'جهاز بصمة', label: 'جهاز بصمة' },
    { value: 'وحدات تخزين', label: 'وحدات تخزين' },
    { value: 'أجهزة مكتبية', label: 'أجهزة مكتبية' },
  ];

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    let filtered = [...assets];

    if (searchQuery) {
      filtered = filtered.filter((asset) =>
        String(asset.fields['assetnum'] || '').includes(searchQuery) ||
        String(asset.fields['الرقم التسلسلي'] || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDeviceType) {
      filtered = filtered.filter((asset) =>
        asset.fields['اسم الاصل']?.includes(selectedDeviceType.value)
      );
    }
    if (selectedCondition) {
      filtered = filtered.filter((asset) => {
        const status = getStatusStyles(asset.fields['حالة الاصل'], asset.fields['مستلم الاصل']).status;
        return status === selectedCondition.value;
      });
    }
    if (selectedManufacturerFilter) {
      filtered = filtered.filter((asset) =>
        asset.fields['الشركة المصنعة']?.toLowerCase().includes(selectedManufacturerFilter.value.toLowerCase())
      );
    }
    setFilteredAssets(filtered);
  }, [assets, selectedDeviceType, selectedCondition, selectedManufacturerFilter, searchQuery]);

  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/assetadministration');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'فشل في استرجاع الأصول');
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setAssets(data);
        setFilteredAssets(data);
      } else {
        setAssets([]);
        setFilteredAssets([]);
        console.warn('البيانات المسترجعة ليست مصفوفة:', data);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getAssetIcon = (assetName) => {
    if (!assetName) return null;
    const name = assetName.toLowerCase();
    if (name.includes('جهاز كمبيوتر')) return <img src="/cpu-desktop-computer-svgrepo-com.svg" alt="PC Case" className="w-6 h-6" />;
    if (name.includes('لاب توب')) return <FaLaptop className="text-gray-600" />;
    if (name.includes('شاشة كمبيوتر')) return <FaTv className="text-gray-600" />;
    if (name.includes('طابعة')) return <FaPrint className="text-gray-600" />;
    if (name.includes('سويتشات') || name.includes('اكسس بوينت')) return <FaNetworkWired className="text-gray-600" />;
    return null;
  };

  const formatSpecifications = (specifications) => {
    if (!specifications) return 'غير محدد';
    const specLines = specifications.split('\n');
    return specLines.map((line, index) => {
      if (line.includes('Yes')) {
        const [label] = line.split(':');
        return (
          <div key={index} className="flex items-center justify-center flex-row-reverse">
            <span className="mr-2">: {label.trim()}</span>
            <FaCheck className="text-green-500" />
          </div>
        );
      } else if (line.includes('No')) {
        const [label] = line.split(':');
        return (
          <div key={index} className="flex items-center justify-center flex-row-reverse">
            <span className="mr-2">: {label.trim()}</span>
            <FaTimes className="text-red-500" />
          </div>
        );
      }
      return <div key={index}>{line.trim()}</div>;
    });
  };

  const handleDeleteClick = (id) => {
    const asset = filteredAssets.find((a) => a.id === id);
    if (asset) {
      const { status } = getStatusStyles(asset.fields['حالة الاصل'], asset.fields['مستلم الاصل']);
      if (status === 'مستخدم') {
        toast.error('لا يمكن حذف الأصل لأنه بحالة "مستخدم".');
        return;
      }
      setAssetToDelete(id);
      setShowModal(true);
    }
  };

  const confirmDelete = async () => {
    if (assetToDelete) {
      try {
        const res = await fetch(`/api/assetadministration?id=${assetToDelete}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'فشل في حذف الأصل');
        }
        const data = await res.json();
        setAssets(assets.filter((asset) => asset.id !== assetToDelete));
        setFilteredAssets(filteredAssets.filter((asset) => asset.id !== assetToDelete));
        toast.success(data.message || 'تم حذف الأصل بنجاح');
      } catch (error) {
        console.error('Error deleting asset:', error);
        toast.error('حدث خطأ أثناء الحذف: ' + error.message);
      } finally {
        setShowModal(false);
        setAssetToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setAssetToDelete(null);
  };

  const handleEditClick = (asset) => {
    setAssetToEdit(asset);
    setEditedAssetNumber(asset.fields.assetnum.toString());
    setEditedName(asset.fields['اسم الاصل'] || '');
    setEditedSerialNumber(asset.fields['الرقم التسلسلي'] || '');
    const manufacturerValue = asset.fields['الشركة المصنعة']?.trim();
    const selectedManufacturer = manufacturerValue
      ? { value: manufacturerValue, label: manufacturerValue }
      : null;
    setEditedManufacturer(selectedManufacturer);
    const conditionValue = asset.fields['حالة الاصل']?.trim();
    setEditedAssetCondition(
      assetConditionsForEdit.find((condition) => condition.value === conditionValue) || null
    );
    setEditedSpecifications(asset.fields['مواصفات اضافية '] || '');
    setEditErrorMessage('');
    setSignatureData(null);
    setHasDrawn(false);
    clearSignature();
    setShowEditModal(true);
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setAssetToEdit(null);
    setEditedAssetNumber('');
    setEditedName('');
    setEditedSerialNumber('');
    setEditedManufacturer(null);
    setEditedAssetCondition(null);
    setEditedSpecifications('');
    setEditErrorMessage('');
    setIsEditing(false);
    setSignatureData(null);
    setHasDrawn(false);
  };

  const handleAssetNumberChange = (e) => {
    const value = e.target.value;
    if (value === '' || (value.length <= 4 && /^\d*$/.test(value))) {
      setEditedAssetNumber(value);
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

  const handleSerialNumberChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9-]*$/.test(value)) {
      setEditedSerialNumber(value);
    }
  };

  const clearSignature = () => {
    rsCanvas.current?.resetCanvas();
    setSignatureData(null);
    setHasDrawn(false);
  };

  const saveSignature = async () => {
    try {
      const paths = await rsCanvas.current.exportPaths();
      if (!paths || paths.length === 0) {
        toast.warn('يرجى رسم توقيع قبل الحفظ. اللوحة فارغة.');
        return;
      }

      const data = await rsCanvas.current.exportImage('png');
      setSignatureData(data);
      setHasDrawn(true);
      toast.success('تم حفظ التوقيع بنجاح');
    } catch (e) {
      console.error('خطأ أثناء حفظ التوقيع:', e);
      toast.error('حدث خطأ أثناء حفظ التوقيع');
    }
  };

  const handleCanvasChange = async () => {
    const paths = await rsCanvas.current.exportPaths();
    setHasDrawn(paths && paths.length > 0);
  };

  const validateEditForm = async () => {
    if (editedAssetNumber.length !== 4) {
      setEditErrorMessage('رقم الأصل يجب أن يكون 4 أرقام بالضبط.');
      return false;
    }

    const arabicRegex = /[\u0600-\u06FF]/;
    if (arabicRegex.test(editedSerialNumber)) {
      setEditErrorMessage('الرقم التسلسلي لا يمكن أن يحتوي على حروف عربية.');
      return false;
    }

    if (!editedManufacturer) {
      setEditErrorMessage('يرجى اختيار الشركة المصنعة.');
      return false;
    }

    if (!editedAssetCondition) {
      setEditErrorMessage('يرجى اختيار حالة الأصل.');
      return false;
    }

    if (!editedSpecifications || editedSpecifications.trim() === '') {
      setEditErrorMessage('يرجى ملء حقل المواصفات الإضافية.');
      return false;
    }

    const status = getStatusStyles(assetToEdit.fields['حالة الاصل'], assetToEdit.fields['مستلم الاصل']).status;

    if (status === 'مستخدم' && editedAssetNumber !== assetToEdit.fields.assetnum.toString()) {
      setEditErrorMessage('لا يمكن تغيير رقم الأصل لأصل في حالة "مستخدم".');
      toast.error('لا يمكن تغيير رقم الأصل لأصل في حالة "مستخدم".');
      return false;
    }

    const assetNumberAsNumber = parseInt(editedAssetNumber, 10);
    let existingAssetRecords = [];
    try {
      const response = await fetch(`/api/addasset?query=${assetNumberAsNumber}`);
      if (!response.ok) {
        console.warn(`فشل طلب API للتحقق من رقم الأصل: حالة ${response.status} - ${response.statusText}`);
      } else {
        existingAssetRecords = await response.json();
        if (!Array.isArray(existingAssetRecords)) {
          console.warn('استجابة API غير متوقعة ليست مصفوفة:', existingAssetRecords);
          existingAssetRecords = [];
        }
      }
    } catch (error) {
      console.error('خطأ في جلب بيانات رقم الأصل:', error);
      toast.warn('تعذر التحقق من رقم الأصل بسبب مشكلة في الاتصال. سيتم المتابعة بدون التحقق من التكرار.');
    }

    if (Array.isArray(existingAssetRecords) && existingAssetRecords.some((record) => record.id !== assetToEdit.id)) {
      setEditErrorMessage('رقم الأصل مستخدم بالفعل.');
      toast.error('رقم الأصل مستخدم بالفعل.');
      return false;
    }

    let existingSerialRecords = [];
    try {
      const response = await fetch(`/api/addasset?serial=${editedSerialNumber}`);
      if (!response.ok) {
        console.warn(`فشل طلب API للتحقق من الرقم التسلسلي: حالة ${response.status} - ${response.statusText}`);
      } else {
        existingSerialRecords = await response.json();
        if (!Array.isArray(existingSerialRecords)) {
          console.warn('استجابة API غير متوقعة ليست مصفوفة:', existingSerialRecords);
          existingSerialRecords = [];
        }
      }
    } catch (error) {
      console.error('خطأ في جلب بيانات الرقم التسلسلي:', error);
      toast.warn('تعذر التحقق من الرقم التسلسلي بسبب مشكلة في الاتصال. سيتم المتابعة بدون التحقق من التكرار.');
    }

    if (Array.isArray(existingSerialRecords) && existingSerialRecords.some((record) => record.id !== assetToEdit.id)) {
      setEditErrorMessage('الرقم التسلسلي مستخدم بالفعل.');
      toast.error('الرقم التسلسلي مستخدم بالفعل.');
      return false;
    }

    if (status === 'مستخدم') {
      const originalCondition = assetToEdit.fields['حالة الاصل']?.trim();
      const newCondition = editedAssetCondition?.value;
      if (newCondition !== originalCondition) {
        setEditErrorMessage('لا يمكن تعديل حالة الأصل لأنه في حالة "مستخدم".');
        toast.error('لا يمكن تعديل حالة الأصل لأنه في حالة "مستخدم".');
        return false;
      }

      const paths = await rsCanvas.current.exportPaths();
      if (!signatureData || !paths || paths.length === 0) {
        setEditErrorMessage('يرجى رسم توقيع وحفظه قبل تقديم التعديلات. اللوحة فارغة أو لم يتم حفظ توقيع.');
        toast.error('يرجى رسم توقيع وحفظه.');
        return false;
      }
    }

    return true;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!assetToEdit) return;

    setIsEditing(true);
    setEditErrorMessage('');

    const isValid = await validateEditForm();
    if (!isValid) {
      setIsEditing(false);
      return;
    }

    const updatedAssetData = {
      id: assetToEdit.id,
      assetnum: parseInt(editedAssetNumber, 10),
      assetName: editedName,
      serialNumber: editedSerialNumber,
      manufacturer: editedManufacturer ? editedManufacturer.value : '',
      assetCondition: editedAssetCondition ? editedAssetCondition.value : '',
      specifications: editedSpecifications,
      signature: signatureData || '',
    };

    try {
      const res = await fetch('/api/assetadministration', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAssetData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'فشل في تعديل الأصل');
      }

      const data = await res.json();
      toast.success(data.message || 'تم تعديل الأصل بنجاح');

      setAssets(
        assets.map((asset) =>
          asset.id === assetToEdit.id
            ? {
                ...asset,
                fields: {
                  ...asset.fields,
                  assetnum: updatedAssetData.assetnum,
                  'اسم الاصل': updatedAssetData.assetName,
                  'الرقم التسلسلي': updatedAssetData.serialNumber,
                  'الشركة المصنعة': updatedAssetData.manufacturer,
                  'حالة الاصل': updatedAssetData.assetCondition,
                  'مواصفات اضافية ': updatedAssetData.specifications,
                },
              }
            : asset
        )
      );

      setFilteredAssets(
        filteredAssets.map((asset) =>
          asset.id === assetToEdit.id
            ? {
                ...asset,
                fields: {
                  ...asset.fields,
                  assetnum: updatedAssetData.assetnum,
                  'اسم الاصل': updatedAssetData.assetName,
                  'الرقم التسلسلي': updatedAssetData.serialNumber,
                  'الشركة المصنعة': updatedAssetData.manufacturer,
                  'حالة الاصل': updatedAssetData.assetCondition,
                  'مواصفات اضافية ': updatedAssetData.specifications,
                },
              }
            : asset
        )
      );

      cancelEdit();
    } catch (error) {
      console.error('Error updating asset:', error);
      setEditErrorMessage('حدث خطأ أثناء التعديل: ' + error.message);
      toast.error('حدث خطأ أثناء التعديل: ' + error.message);
    } finally {
      setIsEditing(false);
    }
  };

  const getStatusStyles = (assetCondition, receiver) => {
    const conditionValue = typeof assetCondition === 'string' ? assetCondition.trim() : '';
    const receiverValue = typeof receiver === 'string' ? receiver.trim() : '';
    let status;

    if (receiverValue && receiverValue !== 'المخزن' && receiverValue !== 'جهة الصيانة') {
      status = 'مستخدم';
    } else {
      status = conditionValue || 'غير محدد';
    }

    switch (status) {
      case 'جديد':
        return { status, bgColor: 'bg-green-600', textColor: 'text-green-100' };
      case 'مستخدم':
        return { status, bgColor: 'bg-yellow-600', textColor: 'text-yellow-100' };
      case 'بحاجة صيانة':
        return { status, bgColor: 'bg-red-600', textColor: 'text-red-100' };
      case 'مخزن':
        return { status, bgColor: 'bg-blue-600', textColor: 'text-blue-100' };
      default:
        return { status: 'غير محدد', bgColor: 'bg-gray-600', textColor: 'text-gray-100' };
    }
  };

  const getBorderColorByAssetNum = (assetNum) => {
    if (!assetNum) return 'border-gray-600';

    const numStr = String(assetNum).padStart(4, '0');
    const firstDigit = numStr.charAt(0);
    const firstTwoDigits = numStr.slice(0, 2);

    switch (firstTwoDigits) {
      case '40':
      case '41':
      case '42':
      case '43':
      case '44':
        return 'border-blue-500';
      case '45':
      case '46':
      case '47':
      case '48':
      case '49':
        return 'border-cyan-500';
      case '70':
      case '71':
      case '72':
      case '73':
      case '74':
        return 'border-pink-500';
      case '75':
      case '76':
      case '77':
      case '78':
      case '79':
        return 'border-rose-500';
      case '81':
        return 'border-teal-500';
      case '82':
        return 'border-emerald-500';
      case '83':
        return 'border-lime-500';
      case '84':
        return 'border-amber-500';
      case '85':
        return 'border-violet-500';
      case '86':
        return 'border-fuchsia-500';
      case '87':
        return 'border-sky-500';
      case '88':
        return 'border-orange-500';
      case '89':
        return 'border-yellow-500';
      case '91':
        return 'border-indigo-500';
      case '92':
        return 'border-purple-500';
      case '93':
        return 'border-green-500';
      case '94':
        return 'border-red-500';
      default:
        switch (firstDigit) {
          case '1':
            return 'border-green-600';
          case '2':
            return 'border-yellow-600';
          case '3':
            return 'border-red-600';
          case '5':
            return 'border-purple-600';
          case '6':
            return 'border-orange-600';
          default:
            return 'border-gray-600';
        }
    }
  };

  return (
    
    <>
    <AuthGuard>
      <div className="container mx-auto bg-gray-50 min-h-screen p-4 sm:p-8 antialiased">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">إدارة الأصول</h2>
            <button
              onClick={() => router.push('/addasset')}
              className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 w-full sm:w-auto"
            >
              إضافة أصل
            </button>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">البحث</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث برقم الأصل أو الرقم التسلسلي..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">نوع الجهاز</label>
              <Select
                options={deviceTypes}
                value={selectedDeviceType}
                onChange={setSelectedDeviceType}
                placeholder="اختر نوع الجهاز..."
                isClearable
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">حالة الجهاز</label>
              <Select
                options={assetConditionsForFilter}
                value={selectedCondition}
                onChange={setSelectedCondition}
                placeholder="اختر حالة الجهاز..."
                isClearable
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">الشركة المصنعة</label>
              <Select
                options={companies}
                value={selectedManufacturerFilter}
                onChange={setSelectedManufacturerFilter}
                placeholder="اختر الشركة المصنعة..."
                isClearable
                className="w-full"
              />
            </div>
          </div>

          {!loading && !error && (
            <div className="mb-4 text-gray-700 text-sm">
              عثر على <span className="font-semibold">{filteredAssets.length}</span> من النتائج
            </div>
          )}

          {loading ? (
            <div className="text-center text-gray-500">جارٍ تحميل الأصول...</div>
          ) : error ? (
            <div className="text-center text-red-500">خطأ: {error}</div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center text-gray-500">لا توجد أصول تطابق الفلاتر المحددة.</div>
          ) : (
            <div>
              {filteredAssets.map((asset) => {
                const { status, bgColor, textColor } = getStatusStyles(
                  asset.fields['حالة الاصل'],
                  asset.fields['مستلم الاصل']
                );
                const borderColor = getBorderColorByAssetNum(asset.fields.assetnum);
                const assetIcon = getAssetIcon(asset.fields['اسم الاصل']);
                return (
                  <div
                    key={asset.id}
                    className={`bg-gray-100 mx-auto border-gray-500 border rounded-sm text-gray-700 mb-2 asset-card ${
                      showEditModal || showModal ? 'blur-sm' : ''
                    }`}
                  >
                    <div className={`flex flex-col sm:flex-row p-3 ${borderColor} border-r-8`}>
                      <div className="space-y-1 pr-3 border-r-2 sm:border-r-2 mb-2 sm:mb-0">
                        <div className="text-sm font-semibold">
                          <span className="text-xs font-normal text-gray-500">رقم الأصل #</span>{' '}
                          {asset.fields.assetnum || 'غير محدد'}
                        </div>
                        <div className="text-base font-normal">
                          {asset.fields['اسم الاصل'] || 'غير محدد'}
                          {assetIcon && <div className="mt-1 flex justify-center">{assetIcon}</div>}
                        </div>
                      </div>
                      <div className="flex-1 space-y-1 pr-3 border-r-2 sm:border-r-2 mb-2 sm:mb-0">
                        <div className="text-sm font-normal">
                          <span className="text-xs font-normal text-gray-500">الرقم التسلسلي :</span>{' '}
                          {asset.fields['الرقم التسلسلي'] || 'غير محدد'}
                        </div>
                        <div className="text-sm font-normal">
                          <span className="text-xs font-normal text-gray-500">الشركة المصنعة :</span>{' '}
                          {asset.fields['الشركة المصنعة'] || 'غير محدد'}
                        </div>
                        <div className="text-sm font-normal">
                          <span className="text-xs font-normal text-gray-500">مستلم الأصل :</span>{' '}
                          {asset.fields['مستلم الاصل'] || 'غير محدد'}
                        </div>
                        <div className="text-sm font-normal">
                          <span className="text-xs font-normal text-gray-500">حالة الأصل :</span>{' '}
                          {status}
                        </div>
                      </div>
                      <div className="pr-3 border-r-2 sm:border-r-2 mb-2 sm:mb-0">
                        <div className="my-3 border-gray-200 border-2 bg-gray-300 p-2 w-full sm:w-48 spec-container">
                          <div className="uppercase text-xs font-medium text-center">
                            مواصفات إضافية
                          </div>
                          <div className="text-center text-sm font-semibold text-gray-800">
                            {formatSpecifications(asset.fields['مواصفات اضافية '])}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className={`my-3 ${bgColor} p-3 w-16 sm:w-20 text-center`}>
                          <div className={`uppercase text-xs font-semibold ${textColor}`}>
                            {status}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                          <button
                            onClick={() => handleEditClick(asset)}
                            className="text-gray-100 rounded-sm bg-blue-500 p-2 hover:bg-blue-600"
                            aria-label="تعديل الأصل"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 sm:h-6 sm:w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(asset.id)}
                            className="text-gray-100 rounded-sm bg-red-500 p-2 hover:bg-red-600"
                            aria-label="حذف الأصل"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 sm:h-6 sm:w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-80">
              <div className="w-full max-w-md p-4 bg-white rounded-xl shadow-lg modal">
                <div className="text-center p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h2 className="text-lg sm:text-xl font-bold py-3">هل أنت متأكد؟</h2>
                  <p className="text-sm text-gray-500 px-6">
                    هل تريد حقًا حذف هذا الأصل؟ هذه العملية لا يمكن التراجع عنها.
                  </p>
                </div>
                <div className="p-3 text-center space-x-3">
                  <button
                    onClick={cancelDelete}
                    className="bg-white px-4 py-2 text-sm font-medium border text-gray-600 rounded-full hover:bg-gray-100"
                    aria-label="إلغاء الحذف"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-red-500 px-4 py-2 text-sm font-medium text-white rounded-full hover:bg-red-600"
                    aria-label="تأكيد الحذف"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          )}

          {showEditModal && (
            <div className="fixed inset-0 pt-16 sm:pt-0 flex justify-center items-start sm:items-center z-50 bg-black bg-opacity-50 overflow-y-auto">
              <div className="w-full sm:max-w-lg mx-2 my-4 sm:my-4 p-4 sm:p-6 bg-white rounded-xl shadow-lg edit-modal max-h-[90vh] min-h-[50vh] overflow-y-auto">
                <div className="text-center p-3 sm:p-4">
                  <h2 className="text-lg sm:text-2xl font-bold py-2 sm:py-3">تعديل الأصل</h2>
                  {editErrorMessage && (
                    <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-red-100 text-red-700 rounded-lg text-xs sm:text-sm">
                      {editErrorMessage}
                    </div>
                  )}
                </div>
                <form onSubmit={handleEditSubmit}>
                  <div className="p-2 sm:p-4">
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">رقم الأصل</label>
                        <input
                          type="text"
                          value={editedAssetNumber}
                          onChange={handleAssetNumberChange}
                          onKeyDown={handleAssetNumberKeyDown}
                          required
                          disabled={
                            assetToEdit &&
                            getStatusStyles(assetToEdit.fields['حالة الاصل'], assetToEdit.fields['مستلم الاصل']).status === 'مستخدم'
                          }
                          className={`w-full p-2 sm:p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base ${
                            assetToEdit &&
                            getStatusStyles(assetToEdit.fields['حالة الاصل'], assetToEdit.fields['مستلم الاصل']).status === 'مستخدم'
                              ? 'bg-gray-200 cursor-not-allowed'
                              : ''
                          }`}
                          placeholder="أدخل 4 أرقام فقط"
                        />
                        {assetToEdit &&
                          getStatusStyles(assetToEdit.fields['حالة الاصل'], assetToEdit.fields['مستلم الاصل']).status === 'مستخدم' && (
                            <p className="text-xs text-gray-500 mt-1">لا يمكن تعديل رقم الأصل لأنه مستخدم.</p>
                          )}
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">اسم الأصل</label>
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          required
                          className="w-full p-2 sm:p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">الرقم التسلسلي</label>
                        <input
                          type="text"
                          value={editedSerialNumber}
                          onChange={handleSerialNumberChange}
                          required
                          className="w-full p-2 sm:p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                          placeholder="أدخل الرقم التسلسلي"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">الشركة المصنعة</label>
                        <Select
                          options={companies}
                          value={editedManufacturer}
                          onChange={setEditedManufacturer}
                          placeholder="اختر الشركة المصنعة..."
                          className="w-full text-sm sm:text-base"
                          isSearchable
                          isClearable
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">حالة الأصل</label>
                        <Select
                          options={assetConditionsForEdit}
                          value={editedAssetCondition}
                          onChange={setEditedAssetCondition}
                          placeholder="اختر حالة الأصل..."
                          className="w-full text-sm sm:text-base"
                          isSearchable
                          isClearable
                          isDisabled={
                            assetToEdit &&
                            getStatusStyles(assetToEdit.fields['حالة الاصل'], assetToEdit.fields['مستلم الاصل']).status === 'مستخدم'
                          }
                        />
                        {assetToEdit &&
                          getStatusStyles(assetToEdit.fields['حالة الاصل'], assetToEdit.fields['مستلم الاصل']).status === 'مستخدم' && (
                            <p className="text-xs text-gray-500 mt-1">لا يمكن تعديل حالة الأصل لأنه مستخدم.</p>
                          )}
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">المواصفات الإضافية</label>
                        <textarea
                          value={editedSpecifications}
                          onChange={(e) => setEditedSpecifications(e.target.value)}
                          required
                          className="w-full p-2 sm:p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                          rows={3}
                        />
                      </div>
                    </div>
                    {assetToEdit &&
                      getStatusStyles(assetToEdit.fields['حالة الاصل'], assetToEdit.fields['مستلم الاصل']).status === 'مستخدم' && (
                        <div className="mt-3 sm:mt-4">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">توقيع مستلم الأصل</label>
                          <div className="w-full">
                            <ReactSketchCanvas
                              ref={rsCanvas}
                              width="100%"
                              height="120px sm:150px"
                              strokeColor="black"
                              strokeWidth={5}
                              onChange={handleCanvasChange}
                              className="border border-gray-300 rounded-lg signature-canvas"
                            />
                          </div>
                          {signatureData && (
                            <img src={signatureData} alt="Signature" className="mt-2 max-w-full h-auto" />
                          )}
                          <div className="flex space-x-2 mt-2">
                            <button
                              type="button"
                              onClick={clearSignature}
                              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-xs sm:text-sm"
                            >
                              مسح التوقيع
                            </button>
                            <button
                              type="button"
                              onClick={saveSignature}
                              className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 text-xs sm:text-sm"
                            >
                              حفظ التوقيع
                            </button>
                          </div>
                        </div>
                      )}
                  </div>
                  <div className="p-3 sm:p-4 text-center space-x-2 sm:space-x-3">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-white px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium border text-gray-600 rounded-full hover:bg-gray-100"
                      disabled={isEditing}
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className={`bg-blue-500 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white rounded-full hover:bg-blue-600 ${
                        isEditing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={isEditing}
                    >
                      {isEditing ? (
                        <div className="flex items-center justify-center">
                          <ClipLoader color="#ffffff" size={16} />
                          <span className="ml-1">جارٍ التعديل...</span>
                        </div>
                      ) : (
                        'حفظ التعديلات'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        <ToastContainer position="top-right" autoClose={3000} rtl={true} />
      </div>

      {/* Mobile-specific styles */}
      <style jsx>{`
        @media (max-width: 640px) {
          .container {
            padding: 1rem;
          }
          .asset-card {
            margin-bottom: 0.75rem;
            padding: 0.75rem;
          }
          .asset-card .text-base {
            font-size: 0.875rem;
          }
          .asset-card .text-sm {
            font-size: 0.75rem;
          }
          .asset-card .text-xs {
            font-size: 0.625rem;
          }
          .asset-card button {
            padding: 0.5rem;
            min-width: 2.5rem;
            min-height: 2.5rem;
          }
          .asset-card .spec-container {
            width: 10rem;
          }
          .modal {
            width: 95%;
            max-width: 95%;
            margin: 0.5rem;
            padding: 0.75rem;
          }
          .modal h2 {
            font-size: 1.125rem;
          }
          .modal p {
            font-size: 0.75rem;
          }
          .modal button {
            padding: 0.5rem 1rem;
            font-size: 0.75rem;
          }
          .edit-modal {
            width: 95%;
            max-width: 95%;
            margin: 0.5rem;
            padding: 0.5rem;
            margin-top: 2rem; /* Reduced margin for better visibility */
            max-height: 85vh; /* Slightly reduced to ensure scrollability */
            min-height: 60vh; /* Ensure minimum height */
          }
          .edit-modal input,
          .edit-modal textarea {
            padding: 0.5rem;
            font-size: 0.75rem;
          }
          .edit-modal label {
            font-size: 0.75rem;
          }
          .edit-modal .text-lg {
            font-size: 1rem;
          }
          .edit-modal button {
            padding: 0.5rem 1rem;
            font-size: 0.75rem;
            min-width: 2rem;
            min-height: 2rem;
          }
          .signature-canvas {
            height: 100px; /* Reduced height for mobile */
          }
          .Toastify__toast {
            font-size: 0.75rem;
            padding: 0.5rem;
          }
        }
      `}</style>
    </AuthGuard>
    </>

  );
}
