
'use client';

import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

// الأنماط (StyledWrapper)
const StyledWrapper = styled.div`
  /* تنسيق زر تسجيل الخروج */
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
    transition-duration: 0.3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
    background-color: #ff4141;
  }

  .sign {
    width: 100%;
    transition-duration: 0.3s;
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
    left: 0%;
    width: 0%;
    opacity: 0;
    color: white;
    font-size: 0.9em;
    font-weight: 600;
    transition-duration: 0.3s;
    white-space: nowrap;
  }

  .Btn:hover {
    background-color: #d32f2f;
    width: 125px;
    border-radius: 40px;
    transition-duration: 0.3s;
  }

  .Btn:hover .sign {
    width: 30%;
    transition-duration: 0.3s;
    padding-right: 20px;
  }

  .Btn:hover .text {
    opacity: 1;
    width: 70%;
    transition-duration: 0.3s;
    padding-left: 8px;
  }

  .Btn:active {
    transform: translate(2px, 2px);
  }

  /* تنسيق زر المستخدم */
  #btn-user {
    --text-color: #000;
    --bg-color-sup: #d2d2d2;
    --bg-color: #f4f4f4;
    --bg-hover-color: #ffffff;
    --online-status: #00da00;
    --font-size: 16px;
    --btn-transition: all 0.2s ease-out;
  }

  .button-user {
    display: flex;
    justify-content: center;
    align-items: center;
    font: 400 var(--font-size) Helvetica Neue, sans-serif;
    box-shadow: 0 0 2.17382px rgba(0, 0, 0, 0.049),
      0 1.75px 6.01034px rgba(0, 0, 0, 0.07),
      0 3.63px 14.4706px rgba(0, 0, 0, 0.091), 0 22px 48px rgba(0, 0, 0, 0.14);
    background-color: var(--bg-color);
    border-radius: 68px;
    cursor: default;
    padding: 6px 10px 6px 6px;
    width: fit-content;
    height: 40px;
    border: 0;
    overflow: hidden;
    position: relative;
    transition: var(--btn-transition);
  }

  .button-user:hover {
    height: 56px;
    padding: 8px 20px 8px 10px;
    background-color: var(--bg-hover-color);
    transition: var(--btn-transition);
  }

  .button-user:active {
    transform: scale(0.98);
  }

  .content-avatar {
    width: 30px;
    height: 30px;
    margin: 0;
    transition: var(--btn-transition);
    position: relative;
  }

  .button-user:hover .content-avatar {
    width: 40px;
    height: 40px;
  }

  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    background-color: var(--bg-color-sup);
  }

  .user-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .status-user {
    position: absolute;
    width: 6px;
    height: 6px;
    right: 1px;
    bottom: 1px;
    border-radius: 50%;
    outline: 2px solid var(--bg-color);
    background-color: var(--online-status);
    transition: var(--btn-transition);
    animation: active-status 2s ease-in-out infinite;
  }

  .button-user:hover .status-user {
    width: 10px;
    height: 10px;
    right: 1px;
    bottom: 1px;
    outline: 3px solid var(--bg-hover-color);
  }

  .notice-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: 10px;
    padding-right: 10px;
    text-align: center;
    color: var(--text-color);
    min-width: 100px;
  }

  .username {
    letter-spacing: -6px;
    height: 0;
    opacity: 0;
    transform: translateY(-20px);
    transition: var(--btn-transition);
    font-size: 14px;
    width: 100%;
    text-align: center;
  }

  .user-id {
    font-size: 12px;
    letter-spacing: -6px;
    height: 0;
    opacity: 0;
    transform: translateY(10px);
    transition: var(--btn-transition);
    width: 100%;
    text-align: center;
  }

  .label-user {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    transform: scaleY(1);
    transition: var(--btn-transition);
    font-size: 14px;
    width: 100%;
  }

  .button-user:hover .username {
    height: auto;
    letter-spacing: normal;
    opacity: 1;
    transform: translateY(0);
    transition: var(--btn-transition);
  }

  .button-user:hover .user-id {
    height: auto;
    letter-spacing: normal;
    opacity: 1;
    transform: translateY(0);
    transition: var(--btn-transition);
  }

  .button-user:hover .label-user {
    height: 0;
    transform: scaleY(0);
    transition: var(--btn-transition);
  }

  .label-user,
  .username {
    font-weight: 600;
  }

  @keyframes active-status {
    0% {
      background-color: var(--online-status);
    }
    33.33% {
      background-color: #93e200;
    }
    66.33% {
      background-color: #93e200;
    }
    100% {
      background-color: var(--online-status);
    }
  }
`;

const NavbarWrapper = styled.nav`
  background-color: #1a1a1a;
  padding: 15px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  transition: all 0.3s ease;

  .navbar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .navbar-logo img {
    height: 45px;
    transition: transform 0.3s ease;
  }

  .navbar-logo img:hover {
    transform: scale(1.1);
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 25px;
  }

  .navbar-links {
    display: flex;
    gap: 20px;
  }

  .navbar-links a {
    text-decoration: none;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 5px;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .navbar-links a:hover {
    background-color: #007bff;
    color: #fff;
  }

  .hamburger {
    display: none;
    cursor: pointer;
    background: none;
    border: none;
    padding: 8px;
    border-radius: 50%;
    transition: background-color 0.3s ease;
  }

  .hamburger svg {
    width: 28px;
    height: 28px;
    stroke: #fff;
  }

  .hamburger:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .mobile-navbar-links {
    display: none;
  }

  @media (max-width: 768px) {
    .navbar-right {
      display: none;
    }

    .navbar-right.open {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 70px;
      left: 0;
      width: 100%;
      background-color: #2c2c2c;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 999;
    }

    .navbar-links {
      display: none;
    }

    .mobile-navbar-links {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .mobile-navbar-links a {
      text-decoration: none;
      color: #fff;
      padding: 12px 20px;
      font-size: 18px;
      font-weight: 500;
      border-radius: 5px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    .mobile-navbar-links a:hover {
      background-color: #007bff;
      color: #fff;
    }

    .logout-button {
      padding: 12px 20px;
      width: 100%;
    }

    .button-user {
      padding: 12px 20px;
      width: 100%;
      justify-content: flex-start;
    }

    .hamburger {
      display: block;
    }
  }
`;

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, user, login, logout, error, loading } = useAuth();
  const [empid, setEmpid] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const router = useRouter();

  // التحقق من المصادقة
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!loading && (!isAuthenticated || !userId)) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // دالة تسجيل الدخول
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(empid, password);
    setEmpid('');
    setPassword('');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-semibold text-center mb-6">تسجيل الدخول</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="empid" className="block text-sm font-medium text-gray-700">
                الـID
              </label>
              <input
                id="empid"
                type="text"
                value={empid}
                onChange={(e) => setEmpid(e.target.value)}
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
    <div>
      <NavbarWrapper className="navbar" dir="rtl">
        <div className="navbar-content">
          <div className="navbar-logo">
            <img src="/media/logo.png" alt="Logo" className="logo" />
          </div>
          <div className={`navbar-right ${isMenuOpen ? 'open' : ''}`}>
            <div className="navbar-links">
            <a href="/CustodyManagement" className="hover:text-gray-400">
                إدارة العهد
              </a>
              <a href="/assetform" className="hover:text-gray-400">
                إسناد عهدة
              </a>
              <a href="/assetadminstration" className="hover:text-gray-400">
                إدارة الأصول
              </a>
              <a href="/addasset" className="hover:text-gray-400">
                إضافة الأصول
              </a>
              <a href="/transfer" className="hover:text-gray-400">
                استلام وتسليم
              </a>
              <StyledWrapper>
                <button id="btn-user" className="button-user">
                  <div className="content-avatar">
                    <div className="status-user" />
                    <div className="avatar">
                      <svg className="user-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12,12.5c-3.04,0-5.5,1.73-5.5,3.5s2.46,3.5,5.5,3.5,5.5-1.73,5.5-3.5-2.46-3.5-5.5-3.5Zm0-.5c1.66,0,3-1.34,3-3s-1.34-3-3-3-3,1.34-3,3,1.34,3,3,3Z" />
                      </svg>
                    </div>
                  </div>
                  <div className="notice-content">
                    <div className="username">{user}</div>
                    <div className="label-user">{user}</div>
                    <div className="user-id">موظف</div>
                  </div>
                </button>
              </StyledWrapper>
              <StyledWrapper>
                <button className="Btn logout-button" onClick={logout}>
                  <div className="sign">
                    <svg viewBox="0 0 512 512">
                      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                    </svg>
                  </div>
                  <div className="text">تسجيل الخروج</div>
                </button>
              </StyledWrapper>
            </div>
            <div className="mobile-navbar-links">
              <a href="/CustodyManagement" className="block hover:text-gray-400">
                إدارة العهد
              </a>
              <a href="/assetform" className="block hover:text-gray-400">
                إسناد عهدة
              </a>
              <a href="/assetadminstration" className="block hover:text-gray-400">
                إدارة الأصول
              </a>
              <a href="/addasset" className="block hover:text-gray-400">
                إضافة الأصول
              </a>
              <a href="/transfer" className="block hover:text-gray-400">
                استلام وتسليم
              </a>
              <StyledWrapper>
                <button id="btn-user" className="button-user">
                  <div className="content-avatar">
                    <div className="status-user" />
                    <div className="avatar">
                      <svg className="user-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12,12.5c-3.04,0-5.5,1.73-5.5,3.5s2.46,3.5,5.5,3.5,5.5-1.73,5.5-3.5-2.46-3.5-5.5-3.5Zm0-.5c1.66,0,3-1.34,3-3s-1.34-3-3-3-3,1.34-3,3,1.34,3,3,3Z" />
                      </svg>
                    </div>
                  </div>
                  <div className="notice-content">
                    <div className="username">{user}</div>
                    <div className="label-user">{user}</div>
                    <div className="user-id">موظف</div>
                  </div>
                </button>
              </StyledWrapper>
              <StyledWrapper>
                <button className="Btn logout-button" onClick={logout}>
                  <div className="sign">
                    <svg viewBox="0 0 512 512">
                      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                    </svg>
                  </div>
                  <div className="text">تسجيل الخروج</div>
                </button>
              </StyledWrapper>
            </div>
          </div>
          <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </NavbarWrapper>
      <main style={{ paddingTop: '70px' }}>{children}</main>
    </div>
  );
}