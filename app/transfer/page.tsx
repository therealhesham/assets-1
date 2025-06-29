

"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import Select from "react-select";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import AuthGuard from "../components/AuthGuard";
import { format } from "date-fns-tz";
import { ar } from "date-fns/locale/ar";
import { FaCheckCircle } from "react-icons/fa";

// دالة لتنسيق التاريخ بناءً على توقيت السعودية
const formatLocalDate = (date: Date | null): string => {
  if (!date) return "";
  return format(date, "yyyy-MM-dd", { locale: ar, timeZone: "Asia/Riyadh" });
};

interface Asset {
  id: string;
  fields: {
    assetnum: number;
    "اسم الاصل": string;
    "الرقم التسلسلي"?: string;
  };
}

interface TransferRequest {
  id: string;
  fields: {
    id: string;
    sender: { id: string; empid: string; name: string } | null;
    receiver: { id: string; empid: string; name: string } | null;
    assets: { id: string; assetnum: number; name: string; serial: string }[];
    status: string;
    transfer_date: string;
  };
}

interface SelectOption {
  value: string;
  label: string;
  asset: Asset;
}

interface StatusOption {
  value: string;
  label: string;
}

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export default function TransferPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [receiverId, setReceiverId] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [assetsOptions, setAssetsOptions] = useState<SelectOption[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>([]);
  const rsCanvas = useRef<ReactSketchCanvasRef>(null);
  const receiverCanvas = useRef<ReactSketchCanvasRef>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState<"Accepted" | "Rejected" | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [receiverSignatureData, setReceiverSignatureData] = useState<string | null>(null);
  const [receiverImageUrl, setReceiverImageUrl] = useState<string | null>(null);
  const [receiverHasDrawn, setReceiverHasDrawn] = useState(false);
  const [reasonRejection, setReasonRejection] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusOption | null>({
    value: "All",
    label: "جميع الحالات",
  });
  const [isProcessing, setIsProcessing] = useState<"loading" | "success" | null>(null);
  const [showThankYouCard, setShowThankYouCard] = useState(false);

  const statusOptions: StatusOption[] = [
    { value: "All", label: "جميع الحالات" },
    { value: "Pending", label: "قيد الانتظار" },
    { value: "Accepted", label: "مقبول" },
    { value: "Rejected", label: "مرفوض" },
  ];

 // مراقبة تغييرات الحالات في المستوى العلوي
 useEffect(() => {
  console.log("loading changed:", loading);
}, [loading]);

useEffect(() => {
  console.log("isProcessing changed:", isProcessing);
}, [isProcessing]);

useEffect(() => {
  console.log("signatureData changed:", signatureData);
}, [signatureData]);

useEffect(() => {
  console.log("signatureData changed:", signatureData);
  if (signatureData) {
    console.log("Checking if loading is set after signature save:", loading);
  }
}, [signatureData, loading]);

// جلب البيانات وإعداد userId
useEffect(() => {
  if (typeof window !== "undefined") {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
    console.log("Loaded userId from localStorage:", storedUserId);
  }

  const fetchAssets = async () => {
    setLoading(true);
    try {
      console.log("Fetching assets...");
      const response = await fetchWithTimeout("/api/transfer", { cache: "no-store" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "فشل جلب الأصول");
      }
      const data = await response.json();
      console.log("Assets fetched:", data);
      const options = data.map((asset: Asset) => ({
        value: asset.id,
        label: `${asset.fields.assetnum} - ${asset.fields["اسم الاصل"]} (${
          asset.fields["الرقم التسلسلي"] || "غير متوفر"
        })`,
        asset,
      }));
      setAssetsOptions(options);
    } catch (error: any) {
      console.error("Error fetching assets:", error);
      toast.error(`حدث خطأ أثناء جلب الأصول: ${error.message}`);
    } finally {
      setLoading(false);
      console.log("fetchAssets completed, loading:", false);
    }
  };

  const fetchTransferRequests = async () => {
    setLoading(true);
    try {
      console.log("Fetching transfer requests...");
      const response = await fetchWithTimeout("/api/transfer?type=requests", { cache: "no-store" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "فشل جلب الطلبات");
      }
      const data = await response.json();
      console.log("Transfer requests fetched:", data);
      setTransferRequests(data);
    } catch (error: any) {
      console.error("Error fetching transfer requests:", error);
      toast.error(`حدث خطأ أثناء جلب الطلبات: ${error.message}`);
    } finally {
      setLoading(false);
      console.log("fetchTransferRequests completed, loading:", false);
    }
  };

  fetchAssets();
  fetchTransferRequests();
}, []); // قائمة تبعيات فارغة لتشغيل useEffect مرة واحدة فقط عند تحميل المكون

// تنظيف URLs عند تغيير imageUrl أو receiverImageUrl
useEffect(() => {
  return () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (receiverImageUrl) URL.revokeObjectURL(receiverImageUrl);
  };
}, [imageUrl, receiverImageUrl]);

  const base64ToBlob = (base64: string) => {
    if (!base64 || !base64.includes(",")) {
      throw new Error("Invalid Base64 string: Missing data URI prefix or comma separator");
    }
    const byteString = atob(base64.split(",")[1]);
    const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const isValidImage = async (data: string): Promise<boolean> => {
    try {
      const img = new Image();
      img.src = data;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      return true;
    } catch {
      return false;
    }
  };

  const clearSignature = () => {
    rsCanvas.current?.resetCanvas();
    setSignatureData(null);
    setImageUrl(null);
    setHasDrawn(false);
  };

  const saveSignature = async () => {
    console.log("Starting saveSignature, loading:", loading, "isProcessing:", isProcessing);
    try {
      const paths = await rsCanvas.current?.exportPaths();
      if (!paths || paths.length === 0) {
        toast.warn("يرجى رسم توقيع قبل الحفظ. اللوحة فارغة.");
        return;
      }

      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const data = await rsCanvas.current?.exportImage("png");
      if (!data) {
        toast.error("فشل تصدير التوقيع. يرجى المحاولة مرة أخرى.");
        return;
      }

      const isValid = await isValidImage(data);
      if (!isValid) {
        toast.error("فشل تصدير التوقيع كصورة صالحة. يرجى إعادة الرسم والحفظ.");
        return;
      }

      setSignatureData(data);
      const blob = base64ToBlob(data);
      const objectUrl = URL.createObjectURL(blob);
      setImageUrl(objectUrl);
      console.log("تم حفظ التوقيع:", objectUrl);
    }  catch (e) {
      console.error("Error in saveSignature:", e);
      toast.error("حدث خطأ أثناء حفظ التوقيع. يرجى المحاولة مرة أخرى.");
    } finally {
      console.log("Finished saveSignature, loading:", loading, "isProcessing:", isProcessing);
    }
  };

  const handleCanvasChange = async () => {
    console.log("handleCanvasChange triggered");

    const paths = await rsCanvas.current?.exportPaths();
    setHasDrawn(paths && paths.length > 0);
  };

  const clearReceiverSignature = () => {
    receiverCanvas.current?.resetCanvas();
    setReceiverSignatureData(null);
    setReceiverImageUrl(null);
    setReceiverHasDrawn(false);
  };

  const saveReceiverSignature = async () => {
    try {
      const paths = await receiverCanvas.current?.exportPaths();
      if (!paths || paths.length === 0) {
        toast.warn("يرجى رسم توقيع قبل الحفظ. اللوحة فارغة.");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data = await receiverCanvas.current?.exportImage("png");
      if (!data) {
        toast.error("فشل تصدير التوقيع. يرجى المحاولة مرة أخرى.");
        return;
      }

      const isValid = await isValidImage(data);
      if (!isValid) {
        toast.error("فشل تصدير التوقيع كصورة صالحة. يرجى إعادة الرسم والحفظ.");
        return;
      }

      setReceiverSignatureData(data);
      const blob = base64ToBlob(data);
      const objectUrl = URL.createObjectURL(blob);
      setReceiverImageUrl(objectUrl);
      console.log("تم حفظ توقيع المستلم:", objectUrl);
    } catch (e) {
      console.error("خطأ أثناء حفظ توقيع المستلم:", e);
      toast.error("حدث خطأ أثناء حفظ التوقيع. يرجى المحاولة مرة أخرى.");
    }
  };

  const handleReceiverCanvasChange = async () => {
    const paths = await receiverCanvas.current?.exportPaths();
    setReceiverHasDrawn(paths && paths.length > 0);
  };

  const handleSubmit = async () => {
    if (!receiverId || !selectedAssets.length) {
      toast.error("يرجى إدخال رقم الموظف المستلم واختيار الأصل");
      return;
    }

    if (!userId) {
      toast.error("لم يتم العثور على بيانات المستخدم");
      return;
    }

    const paths = await rsCanvas.current?.exportPaths();
    if (!paths || paths.length === 0) {
      toast.error("يرجى رسم توقيع قبل التأكيد. اللوحة فارغة.");
      return;
    }

    if (!signatureData || !hasDrawn) {
      toast.error("يرجى رسم وحفظ التوقيع قبل التأكيد");
      return;
    }

    if (!signatureData.startsWith("data:image/")) {
      toast.error("صيغة التوقيع غير صالحة. يرجى إعادة رسم وحفظ التوقيع.");
      return;
    }

    setIsProcessing("loading");
    setShowThankYouCard(false);

    try {
      const response = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: userId,
          receiver_id: receiverId,
          assetnums: selectedAssets.map((asset) => asset.fields.assetnum),
          signature: signatureData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل إنشاء الطلب");
      }

      setIsProcessing("success");
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("تم إنشاء طلب النقل وإرسال الإيميل بنجاح", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onOpen: () => setIsProcessing(null),
      });

      setShowThankYouCard(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowThankYouCard(false);

      setReceiverId("");
      setSelectedAssets([]);
      clearSignature();

      const fetchRequests = async () => {
        const res = await fetch("/api/transfer?type=requests");
        if (res.ok) {
          const data = await res.json();
          setTransferRequests(data);
        } else {
          toast.error("فشل إعادة جلب الطلبات");
        }
      };
      fetchRequests();
    } catch (error: any) {
      toast.error(error.message);
      setIsProcessing(null);
      setShowThankYouCard(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (requestId: string, status: "Accepted" | "Rejected") => {
    setRequestId(requestId);
    setModalStatus(status);
    setShowModal(true);
    clearReceiverSignature();
    setReasonRejection("");
  };

  const submitStatusUpdate = async () => {
    if (!receiverSignatureData) {
      toast.error("يرجى حفظ التوقيع قبل تأكيد الإجراء");
      return;
    }

    if (modalStatus === "Rejected" && !reasonRejection.trim()) {
      toast.error("يرجى إدخال سبب الرفض");
      return;
    }

    const paths = await receiverCanvas.current?.exportPaths();
    if (!paths || paths.length === 0) {
      toast.error("يرجى رسم توقيع قبل التأكيد. اللوحة فارغة.");
      return;
    }

    if (!receiverSignatureData.startsWith("data:image/")) {
      toast.error("صيغة التوقيع غير صالحة. يرجى إعادة رسم وحفظ التوقيع.");
      return;
    }
    

    setIsProcessing("loading");
    setShowThankYouCard(false);

    try {
      const response = await fetch("/api/transfer", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          status: modalStatus,
          receiverSignature: receiverSignatureData,
          reasonRejection: modalStatus === "Rejected" ? reasonRejection : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل تحديث حالة الطلب");
      }

      setIsProcessing("success");
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success(
        `تم تحديث حالة الطلب إلى ${modalStatus === "Accepted" ? "مقبول" : "مرفوض"} وإرسال الإيميل بنجاح`,
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onOpen: () => setIsProcessing(null),
        }
      );

      setShowThankYouCard(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowThankYouCard(false);

      setShowModal(false);
      clearReceiverSignature();
      setReasonRejection("");

      const fetchRequests = async () => {
        const res = await fetch("/api/transfer?type=requests");
        if (res.ok) {
          const data = await res.json();
          setTransferRequests(data);
        } else {
          toast.error("فشل إعادة جلب الطلبات");
        }
      };
      fetchRequests();
    } catch (error: any) {
      toast.error(error.message);
      setIsProcessing(null);
      setShowThankYouCard(false);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedRequests = transferRequests
    .filter((request) => {
      if (!statusFilter || statusFilter.value === "All") return true;
      return request.fields.status === statusFilter.value;
    })
    .sort((a, b) => {
      const dateA = new Date(a.fields.transfer_date).getTime();
      const dateB = new Date(b.fields.transfer_date).getTime();
      if (a.fields.status === "Pending" && b.fields.status === "Pending") {
        return dateA - dateB;
      }
      if (a.fields.status === "Pending") return -1;
      if (b.fields.status === "Pending") return 1;
      return dateB - dateA;
    });

  const selectedOptions = selectedAssets.map((asset) => ({
    value: asset.id,
    label: `${asset.fields.assetnum} - ${asset.fields["اسم الاصل"]} (${
      asset.fields["الرقم التسلسلي"] || "غير متوفر"
    })`,
    asset,
  }));

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100 p-4">
        <ToastContainer position="top-right" autoClose={3000} rtl={true} />

        {(isProcessing || showThankYouCard) && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            {isProcessing ? (
              <div className="relative flex justify-center items-center w-24 h-24">
                <div className="absolute inset-0 bg-gray-600 bg-opacity-80 rounded-full"></div>
                {isProcessing === "loading" && (
                  <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin opacity-80"></div>
                )}
                {isProcessing === "success" && (
                  <FaCheckCircle className="text-green-500 w-16 h-16 animate-bounce" />
                )}
              </div>
            ) : showThankYouCard ? (
              <div className="email-loading-container">
                <div className="email-icon">
                  <div className="loader" />
                  <FaCheckCircle
                    className="check-icon"
                    style={{ color: "#28a745", width: "60px", height: "60px" }}
                  />
                </div>
                <p className="loading-text">جارٍ إرسال البريد الإلكتروني...</p>
              </div>
            ) : null}
          </div>
        )}

{loading && (
  <div className="fixed inset-0 flex justify-center items-center z-50">
    <ClipLoader color="#2563eb" size={50} />
  </div>
)}

        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                {modalStatus === "Accepted" ? "تأكيد القبول" : "تأكيد الرفض"}
              </h2>
              <p className="text-gray-600 mb-4">
                يرجى تقديم توقيعك {modalStatus === "Rejected" ? "وإدخال سبب الرفض" : "لتأكيد القبول"}.
              </p>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">توقيع المستلم</label>
                <div>
                  <ReactSketchCanvas
                    ref={receiverCanvas}
                    width="400px"
                    height="200px"
                    strokeColor="black"
                    strokeWidth={5}
                    onChange={handleReceiverCanvasChange}
                  />
                  {receiverImageUrl && (
                    <img
                      src={receiverImageUrl}
                      alt="Receiver Signature"
                      className="mt-2 max-w-[200px] border border-gray-300 rounded"
                      onError={() => {
                        console.error("فشل تحميل صورة التوقيع");
                        setReceiverImageUrl(null);
                        setReceiverSignatureData(null);
                        setReceiverHasDrawn(false);
                      }}
                    />
                  )}
                </div>
                <div className="flex space-x-2 mt-2">
                  <button
                    type="button"
                    onClick={clearReceiverSignature}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  >
                    مسح التوقيع
                  </button>
                  <button
                    type="button"
                    onClick={saveReceiverSignature}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    حفظ التوقيع
                  </button>
                </div>
              </div>
              {modalStatus === "Rejected" && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium">سبب الرفض</label>
                  <textarea
                    value={reasonRejection}
                    onChange={(e) => setReasonRejection(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={4}
                    placeholder="أدخل سبب الرفض..."
                    required
                  />
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowModal(false);
                    clearReceiverSignature();
                    setReasonRejection("");
                  }}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  إلغاء
                </button>
                <button
                  onClick={submitStatusUpdate}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? "جاري التأكيد..." : "تأكيد"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">إنشاء طلب نقل</h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-1">رقم الموظف المستلم:</label>
              <input
                type="text"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">اختيار الأصول:</label>
              <Select
                isMulti
                options={assetsOptions}
                value={selectedOptions}
                onChange={(selected) =>
                  setSelectedAssets(selected ? selected.map((option) => option.asset) : [])
                }
                placeholder="ابحث عن الأصول..."
                className="basic-multi-select"
                classNamePrefix="select"
                isRtl={true}
              />
            </div>

            {selectedAssets.length > 0 && (
              <div className="p-3 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">الأصول المحددة:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1"
                    >
                      <span>
                        {asset.fields["اسم الاصل"]} (رقم: {asset.fields.assetnum})
                      </span>
                      <button
                        onClick={() =>
                          setSelectedAssets(selectedAssets.filter((a) => a.id !== asset.id))
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 font-medium">توقيع المرسل</label>
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
                    className="mt-2 max-w-[200px] border border-gray-300 rounded"
                    onError={() => {
                      console.error("فشل تحميل صورة التوقيع");
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

            <button
              onClick={handleSubmit}
              disabled={loading || !receiverId || selectedAssets.length === 0 || !signatureData}
              className="bg-green-600 text-white p-2 rounded w-full disabled:bg-gray-400"
            >
              {loading ? "جاري الإرسال..." : "إنشاء طلب النقل"}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">قائمة طلبات النقل</h2>
          <div className="mb-4">
            <label className="block mb-1">تصفية حسب الحالة:</label>
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(selected) => setStatusFilter(selected as StatusOption | null)}
              placeholder="اختر الحالة..."
              className="basic-single-select"
              classNamePrefix="select"
              isRtl={true}
            />
          </div>
          {filteredAndSortedRequests.length === 0 ? (
            <p className="text-gray-500">لا توجد طلبات نقل متاحة</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-2 px-4 text-right">رقم الطلب</th>
                    <th className="py-2 px-4 text-right">المرسل</th>
                    <th className="py-2 px-4 text-right">المستقبل</th>
                    <th className="py-2 px-4 text-right">الأصول</th>
                    <th className="py-2 px-4 text-right">الحالة</th>
                    <th className="py-2 px-4 text-right">تاريخ النقل</th>
                    <th className="py-2 px-4 text-right">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedRequests.map((request) => (
                    <tr key={request.id} className="border-b">
                      <td className="py-2 px-4">{request.fields.id}</td>
                      <td className="py-2 px-4">
                        {request.fields.sender
                          ? `${request.fields.sender.name} (${request.fields.sender.empid})`
                          : "غير معروف"}
                      </td>
                      <td className="py-2 px-4">
                        {request.fields.receiver
                          ? `${request.fields.receiver.name} (${request.fields.receiver.empid})`
                          : "غير معروف"}
                      </td>
                      <td className="py-2 px-4">
                        <ul className="list-disc pr-4">
                          {request.fields.assets.map((asset) => (
                            <li key={asset.id}>
                              {asset.name} (رقم: {asset.assetnum}, الرقم التسلسلي: {asset.serial})
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-2 px-4">{request.fields.status}</td>
                      <td className="py-2 px-4">
                        {new Date(request.fields.transfer_date).toLocaleString("ar-SA")}
                      </td>
                      <td className="py-2 px-4">
                        {userId &&
                          request.fields.receiver &&
                          userId.toString() === request.fields.receiver.empid.toString() &&
                          request.fields.status === "Pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateStatus(request.id, "Accepted")}
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                              disabled={loading}
                            >
                              قبول
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(request.id, "Rejected")}
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                              disabled={loading}
                            >
                              رفض
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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