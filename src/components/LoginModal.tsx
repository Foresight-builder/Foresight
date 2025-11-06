"use client";
import React, { useEffect, useMemo, useState } from "react";
import { X, Mail, Wallet, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import WalletModal from "./WalletModal";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: "email" | "wallet";
}

export default function LoginModal({ open, onClose, defaultTab = "email" }: LoginModalProps) {
  const { user, requestEmailOtp, verifyEmailOtp, sendMagicLink, error } = useAuth();
  const { account } = useWallet();

  const [tab, setTab] = useState<"email" | "wallet">(defaultTab);
  const [email, setEmail] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    // 登录成功后自动关闭
    if (user || account) {
      onClose();
    }
  }, [user, account, open, onClose]);

  useEffect(() => {
    if (!open) {
      setTab(defaultTab);
      setEmail("");
      setOtpRequested(false);
      setOtp("");
      setLoading(false);
    }
  }, [open, defaultTab]);

  const canRequest = useMemo(() => {
    return /.+@.+\..+/.test(email);
  }, [email]);

  const handleRequestOtp = async () => {
    if (!canRequest) return;
    setLoading(true);
    try {
      await requestEmailOtp(email);
      setOtpRequested(true);
    } catch {}
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!email || !otp) return;
    setLoading(true);
    try {
      await verifyEmailOtp(email, otp);
      onClose();
    } catch {}
    setLoading(false);
  };

  const handleSendMagicLink = async () => {
    if (!canRequest) return;
    setLoading(true);
    try {
      await sendMagicLink(email);
      setOtpRequested(true);
    } catch {}
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex gap-2">
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${tab === "email" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`}
                onClick={() => setTab("email")}
              >
                邮箱登录
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${tab === "wallet" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`}
                onClick={() => setTab("wallet")}
              >
                钱包登录
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="关闭"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {tab === "email" ? (
            <div className="px-6 py-6">
              {!otpRequested ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">使用邮箱继续</h3>
                  <p className="text-sm text-gray-600">我们会发送一封包含登录链接与 6 位验证码的邮件。</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">邮箱地址</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-red-600">{error}</div>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRequestOtp}
                      disabled={!canRequest || loading}
                      className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-white disabled:opacity-60"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                      发送验证码
                    </button>
                    <button
                      onClick={handleSendMagicLink}
                      disabled={!canRequest || loading}
                      className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-gray-900 disabled:opacity-60"
                    >
                      发送登录链接
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    继续即表示你同意我们的
                    <a href="/terms" target="_blank" className="underline ml-1">服务条款</a>
                    与
                    <a href="/privacy" target="_blank" className="underline ml-1">隐私政策</a>。
                  </p>
                  <div className="text-xs text-gray-500">也可以切换到「钱包登录」继续。</div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">输入邮箱中的 6 位验证码</h3>
                  <p className="text-sm text-gray-600">我们已向 <span className="font-medium">{email}</span> 发送邮件。</p>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="tracking-widest text-center text-lg w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="••••••"
                  />
                  {error && (
                    <div className="text-sm text-red-600">{error}</div>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleVerifyOtp}
                      disabled={otp.length !== 6 || loading}
                      className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-white disabled:opacity-60"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                      验证并登录
                    </button>
                    <button
                      onClick={handleRequestOtp}
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-gray-900"
                    >
                      重新发送
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">也可以在邮件中点击登录链接完成登录。</p>
                </div>
              )}
            </div>
          ) : (
            <div className="px-6 py-6 space-y-4">
              <h3 className="text-lg font-semibold">使用钱包继续</h3>
              <p className="text-sm text-gray-600">支持常见钱包（如 MetaMask、Coinbase 等）。</p>
              <button
                onClick={() => setWalletModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-white"
              >
                <Wallet className="w-4 h-4" /> 打开钱包选择器
              </button>
              <p className="text-xs text-gray-500">也可以切换到「邮箱登录」。</p>
            </div>
          )}
        </div>
      </div>

      {walletModalOpen && (
        <WalletModal onClose={() => setWalletModalOpen(false)} />
      )}
    </div>
  );
}