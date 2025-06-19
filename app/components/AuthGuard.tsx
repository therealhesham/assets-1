"use client";

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // التحقق من حالة المصادقة عند تحميل المكون
  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empid:email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'كلمة المرور أو الرقم التعريفي غير صحيح');
      }

      setIsAuthenticated(true);
      sessionStorage.setItem('isAuthenticated', 'true');
      setError('');
      router.push('/'); 
    } catch (err: any) {
      setError(err.message);
      setEmail('');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  // معالجة تسجيل الخروج
  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setError('');
    router.push('/'); // إعادة توجيه إلى صفحة تسجيل الدخول
  };

  // الأنماط باستخدام styled-components (نفس الأنماط السابقة)
  const StyledWrapper = styled.div`
    .Btn {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 45px;
      height: 45px;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition-duration: .3s;
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
      background-color: rgb(255, 65, 65);
    }

    .sign {
      width: 100%;
      transition-duration: .3s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sign svg {
      width: 17px;
    }

    .sign svg path {
      fill: white;
    }

    .text {
      position: absolute;
      right: 0%;
      width: 0%;
      opacity: 0;
      color: white;
      font-size: 0.9em;
      font-weight: 600;
      transition-duration: .3s;
      white-space: nowrap;
    }

    .Btn:hover {
      width: 125px;
      border-radius: 40px;
      transition-duration: .3s;
    }

    .Btn:hover .sign {
      width: 30%;
      transition-duration: .3s;
      padding-left: 20px;
    }

    .Btn:hover .text {
      opacity: 1;
      width: 70%;
      transition-duration: .3s;
      padding-right: 10px;
    }

    .Btn:active {
      transform: translate(2px, 2px);
    }
  `;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-semibold text-center mb-6">تسجيل الدخول</h2>
          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                الـID
              </label>
              <input
                id="text"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="الID"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar" dir="ltr">
        <div className="navbar-content">
          <div className="navbar-right">
            <div className="navbar-links logout-button">
              <StyledWrapper>
                <button className="Btn" onClick={handleLogout}>
                  <div className="sign">
                    <svg viewBox="0 0 512 512">
                      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                    </svg>
                  </div>
                  <div className="text">تسجيل الخروج</div>
                </button>
              </StyledWrapper>
            </div>
            <div className="navbar-links">
              <a href="/addasset" className="navbar-link text-md font-bold">
                اضافة الأصول
              </a>
            </div>
            <div className="navbar-links">
              <a href="/assetadminstration" className="navbar-link text-md font-bold">
                ادارة الأصول
              </a>
            </div>
            <div className="navbar-links">
              <a href="/assetform" className="navbar-link text-md font-bold">
                اسناد عهدة
              </a>
            </div>
            <div className="navbar-links">
              <a href="/CustodyManagement" className="navbar-link text-md font-bold">
                ادارة العهد
              </a>
            </div>
            <div className="navbar-logo">
              <img
                src="/media/logo.png"
                alt="Logo"
                className="logo"
              />
            </div>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}