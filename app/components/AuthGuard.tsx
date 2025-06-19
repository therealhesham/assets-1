// app/components/AuthGuard.tsx
"use client";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: ReactNode;
}

const Style = styled.div`
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
    background-color: white;
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
    fill: black;
  }

  .text {
    position: absolute;
    left: 0%;
    width: 0%;
    opacity: 0;
    color: white;
    font-size: 0.75em;
    font-weight: 600;
    transition-duration: 0.3s;
    white-space: nowrap;
  }

  .Btn:hover {
    background-color: black;
    width: 125px;
    border-radius: 40px;
    transition-duration: 0.3s;
  }

  .Btn:hover .sign {
    width: 30%;
    transition-duration: 0.3s;
    padding-right: 20px;
  }

  .Btn:hover .sign svg path {
    fill: white;
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
    cursor: pointer;
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
    transition-duration: 0.3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
    background-color: rgb(255, 65, 65);
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
    right: 0%;
    width: 0%;
    opacity: 0;
    color: white;
    font-size: 0.9em;
    font-weight: 600;
    transition-duration: 0.3s;
    white-space: nowrap;
  }

  .Btn:hover {
    width: 125px;
    border-radius: 40px;
    transition-duration: 0.3s;
  }

  .Btn:hover .sign {
    width: 30%;
    transition-duration: 0.3s;
    padding-left: 20px;
  }

  .Btn:hover .text {
    opacity: 1;
    width: 70%;
    transition-duration: 0.3s;
    padding-right: 10px;
  }

  .Btn:active {
    transform: translate(2px, 2px);
  }
`;

const NavbarWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 10px 20px;

  .navbar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .navbar-links {
    a {
      text-decoration: none;
      color: #333;
      font-size: 16px;
      &:hover {
        color: #007bff;
      }
    }
  }

  .navbar-logo img {
    height: 40px;
  }
`;

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, user, login, logout, error, loading } = useAuth();
  const [empid, setEmpid] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  // إعادة توجيه إذا لم يكن المستخدم مصادقًا
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(empid, password);
    setEmpid("");
    setPassword("");
  };

  if (loading) {
    return <div>جاري التحميل...</div>;
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
              className={`w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavbarWrapper className="navbar" dir="ltr">
        <div className="navbar-content">
          <div className="navbar-right">
            <div className="navbar-links logout-button">
              <StyledWrapper>
                <button className="Btn" onClick={logout}>
                  <div className="sign">
                    <svg viewBox="0 0 512 512">
                      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                    </svg>
                  </div>
                  <div className="text">تسجيل الخروج</div>
                </button>
              </StyledWrapper>
              <Style>
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
                  </div>
                </button>
              </Style>
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
              <img src="/media/logo.png" alt="Logo" className="logo" />
            </div>
          </div>
        </div>
      </NavbarWrapper>
      <main style={{ paddingTop: "60px" }}>{children}</main>
    </div>
  );
}