'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';

// تعريف الأنواع
interface Asset {
  id: string;
  fields: {
    assetnum: number;
    'اسم الاصل': string;
    'الرقم التسلسلي'?: string;
    'الشركة المصنعة'?: string;
    'حالة الاصل'?: string;
    'مواصفات اضافية'?: string;
    'مستلم الاصل'?: string[];
  };
}

interface TransferRequest {
  id: string;
  fields: {
    sender_id: string[];
    receiver_id: string[];
    assets: string[];
    status: string;
    transfer_date: string;
    sender_signature?: string[];
    receiver_signature?: string[];
    sender_name?: string;
  };
}

export default function TransferPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [receiverId, setReceiverId] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Asset[]>([]);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const rsCanvas = useRef<ReactSketchCanvasRef>(null);
  const [loading, setLoading] = useState(false);
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>([]);

  // جلب userId من localStorage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!user || !userId) {
      router.push('/login');
    } else {
      fetchTransferRequests();
    }
  }, [user, userId, router]);

  const fetchTransferRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/transfer?userId=${userId}`);
      if (!response.ok) throw new Error('فشل جلب الطلبات');
      const data: any[] = await response.json();
      const filteredRequests: TransferRequest[] = data
        .filter((item) => item.id && item.fields)
        .map((item) => ({
          id: item.id,
          fields: {
            sender_id: Array.isArray(item.fields.sender_id) ? item.fields.sender_id : [],
            receiver_id: Array.isArray(item.fields.receiver_id) ? item.fields.receiver_id : [],
            assets: Array.isArray(item.fields.assets) ? item.fields.assets : [],
            status: item.fields.status || 'Pending',
            transfer_date: item.fields.transfer_date || '',
            sender_signature: Array.isArray(item.fields.sender_signature) ? item.fields.sender_signature : [],
            receiver_signature: Array.isArray(item.fields.receiver_signature) ? item.fields.receiver_signature : [],
            sender_name: item.fields.sender_name || 'غير معروف',
          },
        }));
      setTransferRequests(filteredRequests);
    } catch (error) {
      console.error('خطأ في جلب طلبات النقل:', error);
      toast.error('فشل تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/transfer?search=${searchQuery}&userId=${userId}`);
      if (!response.ok) throw new Error('فشل البحث عن الأصول');
      const data: any[] = await response.json();
      const filteredAssets: Asset[] = data
        .filter((item) => item.id && item.fields && item.fields.assetnum)
        .map((item) => ({
          id: item.id,
          fields: {
            assetnum: item.fields.assetnum || 0,
            'اسم الاصل': item.fields['اسم الاصل'] || 'غير معروف',
            'الرقم التسلسلي': item.fields['الرقم التسلسلي'] || '',
            'الشركة المصنعة': item.fields['الشركة المصنعة'] || '',
            'حالة الاصل': item.fields['حالة الاصل'] || '',
            'مواصفات اضافية': item.fields['مواصفات اضافية'] || '',
            'مستلم الاصل': Array.isArray(item.fields['مستلم الاصل']) ? item.fields['مستلم الاصل'] : [],
          },
        }));
      setSearchResults(filteredAssets);
    } catch (error) {
      console.error('خطأ في البحث عن الأصول:', error);
      toast.error('فشل البحث عن الأصول');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAsset = (asset: Asset) => {
    setSelectedAssets((prev) => [...prev, asset]);
    setSearchResults((prev) => prev.filter((a) => a.id !== asset.id));
  };

  const handleRemoveAsset = (assetId: string) => {
    setSelectedAssets((prev) => prev.filter((a) => a.id !== assetId));
  };

  const handleSubmit = async () => {
    if (!receiverId || !selectedAssets.length || !hasDrawn) {
      toast.error('يرجى ملء جميع الحقول وإضافة توقيع');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: userId,
          receiverId,
          assets: selectedAssets.map((a) => a.id),
          transferDate: new Date().toISOString(),
          signature: signatureData,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('تم إرسال طلب التسليم بنجاح');
        setSelectedAssets([]);
        setReceiverId('');
        setSignatureData(null);
        setHasDrawn(false);
        rsCanvas.current?.resetCanvas();
        await fetchTransferRequests();
      } else {
        toast.error(data.error || 'فشل إرسال الطلب');
      }
    } catch (error) {
      console.error('خطأ في إرسال النقل:', error);
      toast.error('حدث خطأ أثناء إرسال الطلب');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    if (!hasDrawn) {
      toast.error('يرجى إضافة توقيع لتأكيد القبول');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/transfer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: requestId, status: 'Accepted', signature: signatureData }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('تم قبول الطلب بنجاح');
        await fetchTransferRequests();
      } else {
        toast.error(data.error || 'فشل قبول الطلب');
      }
    } catch (error) {
      console.error('خطأ في قبول النقل:', error);
      toast.error('حدث خطأ أثناء قبول الطلب');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (requestId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/transfer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: requestId, status: 'Rejected' }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('تم رفض الطلب بنجاح');
        await fetchTransferRequests();
      } else {
        toast.error(data.error || 'فشل رفض الطلب');
      }
    } catch (error) {
      console.error('خطأ في رفض النقل:', error);
      toast.error('حدث خطأ أثناء رفض الطلب');
    } finally {
      setLoading(false);
    }
  };

  const saveSignature = async () => {
    const data = await rsCanvas.current?.exportImage('png');
    setSignatureData(data || null);
    setHasDrawn(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <ToastContainer position="top-right" autoClose={3000} rtl={true} />
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <ClipLoader color="#2563eb" size={50} />
        </div>
      )}
      {user && userId ? (
        <>
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold">تسليم واستلام الأصول</h1>
            <button onClick={logout} className="bg-red-500 text-white p-2 rounded">
              تسجيل الخروج
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">إنشاء طلب تسليم</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                placeholder="معرف الموظف المستلم (empid)"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن الأصل برقم الأصل (assetnum)"
                className="w-full p-2 border rounded"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              {searchResults.length > 0 && (
                <ul className="space-y-2">
                  {searchResults.map((asset) => (
                    <li key={asset.id} className="p-2 border rounded flex justify-between">
                      <span>{asset.fields['اسم الاصل']} (#{asset.fields.assetnum})</span>
                      <button onClick={() => handleAddAsset(asset)} className="bg-blue-500 text-white p-1 rounded">
                        إضافة
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div>
                <h3 className="font-semibold">الأصول المختارة:</h3>
                <ul className="space-y-2">
                  {selectedAssets.map((asset) => (
                    <li key={asset.id} className="p-2 border rounded flex justify-between">
                      {asset.fields['اسم الاصل']} (#{asset.fields.assetnum})
                      <button onClick={() => handleRemoveAsset(asset.id)} className="bg-red-500 text-white p-1 rounded">
                        إزالة
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <ReactSketchCanvas
                ref={rsCanvas}
                width="300px"
                height="150px"
                strokeColor="black"
                strokeWidth={3}
              />
              <button onClick={saveSignature} className="bg-green-500 text-white p-2 rounded mr-2">
                حفظ التوقيع
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !hasDrawn || !selectedAssets.length || !receiverId}
                className="bg-blue-500 text-white p-2 rounded"
              >
                {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
              </button>
            </div>
            <h2 className="text-xl font-semibold mt-6 mb-4">الطلبات الموجهة إليك</h2>
            {transferRequests
              .filter((request) => request.fields.receiver_id.includes(userId))
              .map((request) => (
                <div key={request.id} className="p-2 border rounded mb-2">
                  <p>المرسل: {request.fields.sender_name || 'غير معروف'}</p>
                  <p>تاريخ الطلب: {request.fields.transfer_date}</p>
                  <ul>
                    {request.fields.assets.map((assetId) => {
                      const asset = searchResults.find((a) => a.id === assetId);
                      return (
                        <li key={assetId}>
                          {asset ? `${asset.fields['اسم الاصل']} (#{asset.fields.assetnum})` : 'أصل غير معروف'}
                        </li>
                      );
                    })}
                  </ul>
                  <p>الحالة: {request.fields.status}</p>
                  {request.fields.status === 'Pending' && (
                    <div className="mt-2">
                      <ReactSketchCanvas
                        ref={rsCanvas}
                        width="300px"
                        height="150px"
                        strokeColor="black"
                        strokeWidth={3}
                      />
                      <button onClick={() => handleAccept(request.id)} className="bg-green-500 text-white p-2 rounded mr-2">
                        قبول
                      </button>
                      <button onClick={() => handleReject(request.id)} className="bg-red-500 text-white p-2 rounded">
                        رفض
                      </button>
                    </div>
                  )}
                  {(request.fields.status === 'Accepted' || request.fields.status === 'Rejected') && (
                    <div className="mt-2">
                      <p>التوقيع: {request.fields.receiver_signature?.length ? 'موجود' : 'غير موجود'}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#2563eb" size={50} />
        </div>
      )}
    </div>
  );
}