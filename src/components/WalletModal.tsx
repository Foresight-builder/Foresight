"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useWallet } from '@/contexts/WalletContext';
import { motion, AnimatePresence } from 'framer-motion';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { connectWallet, availableWallets, isConnecting } = useWallet();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 阻止页面滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleWalletConnect = async (walletType: string) => {
    setSelectedWallet(walletType);
    try {
      await connectWallet(walletType as any);
      onClose();
    } catch (error) {
      console.error('连接钱包失败:', error);
    } finally {
      setSelectedWallet(null);
    }
  };

  const walletIcons = {
    metamask: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M30.04 1.63L17.85 10.6l2.26-5.32L30.04 1.63z" fill="#E2761B"/>
        <path d="M1.96 1.63l12.11 9.06-2.18-5.41L1.96 1.63zM25.71 23.3l-3.25 4.97 6.96 1.92 2-6.81-5.71-.08zM1.59 23.38l1.99 6.81 6.96-1.92-3.25-4.97-5.7.08z" fill="#E4761B"/>
        <path d="M10.46 14.25L8.54 17.1l6.9.31-.23-7.42-4.75 4.26zM21.54 14.25l-4.84-4.35-.16 7.53 6.9-.31-1.9-2.87zM10.54 28.27l4.15-2.02-3.58-2.8-.57 4.82zM17.31 26.25l4.15 2.02-.57-4.82-3.58 2.8z" fill="#E4761B"/>
        <path d="M21.46 28.27l-4.15-2.02.33 2.7-.04 1.23 3.86-1.91zM10.54 28.27l3.86 1.91-.03-1.23.33-2.7-4.16 2.02z" fill="#D7C1B3"/>
        <path d="M14.47 21.05l-3.45-1.01 2.44-1.12 1.01 2.13zM17.53 21.05l1.01-2.13 2.45 1.12-3.46 1.01z" fill="#233447"/>
        <path d="M10.54 28.27l.59-4.97-3.84.08 3.25 4.89zM20.87 23.3l.59 4.97 3.25-4.89-3.84-.08zM23.44 17.1l-6.9.31.64 3.64 1.01-2.13 2.45 1.12 2.8-2.94zM11.02 19.04l2.44-1.12 1.01 2.13.64-3.64-6.9-.31 2.81 2.94z" fill="#CD6116"/>
        <path d="M8.54 17.1l2.9 5.66-.1-2.72L8.54 17.1zM20.64 19.04l-.1 2.72 2.9-5.66-2.8 2.94zM15.11 17.41l-.64 3.64.81 4.18.18-5.45-.35-2.37zM16.89 17.41l-.34 2.36.17 5.46.81-4.18-.64-3.64z" fill="#E4751F"/>
        <path d="M17.53 21.05l-.81 4.18.58.4 3.58-2.8.1-2.72-3.45.94zM11.02 19.04l.1 2.72 3.58 2.8.58-.4-.81-4.18-3.45-.94z" fill="#F6851B"/>
        <path d="M17.59 30.18l.04-1.23-.35-.3h-2.56l-.35.3.03 1.23-3.86-1.91 1.35 1.1 2.74 1.9h2.6l2.74-1.9 1.35-1.1-3.73 1.91z" fill="#C0AD9E"/>
        <path d="M17.31 26.25l-.58-.4h-1.46l-.58.4-.33 2.7.35-.3h2.56l.35.3-.31-2.7z" fill="#161616"/>
        <path d="M30.55 11.35l1.02-4.9L30.04 1.63l-12.73 9.45 4.9 4.14 6.93 2.02 1.53-1.78-.66-.48 1.06-0.97-.82-.63 1.06-.81-.7-.53zM.43 6.45l1.02 4.9-.71.53 1.06.81-.82.63 1.06.97-.66.48 1.53 1.78 6.93-2.02 4.9-4.14L1.96 1.63.43 6.45z" fill="#763D16"/>
      </svg>
    ),
    coinbase: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#0052FF"/>
        <path d="M16 6C10.48 6 6 10.48 6 16s4.48 10 10 10 10-4.48 10-10S21.52 6 16 6zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="white"/>
        <rect x="12" y="14" width="8" height="4" rx="2" fill="#0052FF"/>
      </svg>
    ),
    binance: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#F3BA2F"/>
        <path d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.26L16 26l-6.144-6.144 2.26-2.26zm9.764-5.596L26 16l-2.26 2.26L21.48 16l2.26-2.26z" fill="white"/>
        <path d="M16 13.2l-1.8 1.8 1.8 1.8 1.8-1.8L16 13.2z" fill="white"/>
      </svg>
    ),
    okx: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="16" fill="black"/>
        <path d="M8 8h6v6H8V8zm9 0h6v6h-6V8zm9 0h6v6h-6V8zM8 17h6v6H8v-6zm9 0h6v6h-6v-6zm9 0h6v6h-6v-6z" fill="white"/>
      </svg>
    )
  };

  const walletNames = {
    metamask: 'MetaMask',
    coinbase: 'Coinbase Wallet',
    binance: 'Binance Wallet',
    okx: 'OKX Wallet'
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* 背景遮罩 */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/20 to-pink-900/20 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* 弹窗内容 */}
          <motion.div 
            className="relative bg-gradient-to-br from-white via-white to-purple-50/50 rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-white/20 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* 装饰性背景元素 */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-2xl"></div>
            
            {/* 头部 */}
            <div className="relative flex items-center justify-between p-6 border-b border-gradient-to-r from-purple-100/50 to-pink-100/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M21 18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="15,10 21,4 15,4 21,4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">连接钱包</h2>
                  <p className="text-sm text-gray-500">选择您的钱包进行连接</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-gradient-to-br hover:from-purple-100 hover:to-pink-100 rounded-xl transition-all duration-200 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400 group-hover:text-gray-600">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </motion.button>
            </div>

            {/* 钱包列表 */}
            <div className="relative p-6 space-y-3">
              {availableWallets.map((wallet, index) => (
                <motion.button
                  key={wallet.type}
                  onClick={() => handleWalletConnect(wallet.type)}
                  disabled={!wallet.isAvailable || isConnecting}
                  className={`
                    w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 group relative overflow-hidden
                    ${wallet.isAvailable 
                      ? 'border-purple-200/50 hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 cursor-pointer hover:shadow-lg' 
                      : 'border-gray-200/50 bg-gray-50/50 cursor-not-allowed opacity-60'
                    }
                    ${selectedWallet === wallet.type ? 'border-purple-400 bg-gradient-to-r from-purple-100/50 to-pink-100/50 shadow-lg' : ''}
                  `}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={wallet.isAvailable ? { scale: 1.02 } : {}}
                  whileTap={wallet.isAvailable ? { scale: 0.98 } : {}}
                >
                  {/* 悬停时的渐变背景 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  
                  <div className="relative flex items-center space-x-4">
                    <div className="flex-shrink-0 p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                      {walletIcons[wallet.type as keyof typeof walletIcons]}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                        {walletNames[wallet.type as keyof typeof walletNames]}
                      </div>
                      {!wallet.isAvailable ? (
                        <div className="text-sm text-red-500 font-medium">未安装</div>
                      ) : (
                        <div className="text-sm text-gray-500 group-hover:text-purple-500 transition-colors duration-300">点击连接</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative">
                    {selectedWallet === wallet.type && isConnecting ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent" />
                    ) : wallet.isAvailable ? (
                      <div className="w-6 h-6 rounded-full border-2 border-purple-300 group-hover:border-purple-500 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-red-400">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" fill="currentColor"/>
                      </svg>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* 底部说明 */}
            <div className="relative px-6 pb-6">
              <div className="text-sm text-gray-500 text-center leading-relaxed">
                通过连接钱包，您同意我们的
                <a href="#" className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200 mx-1">服务条款</a>
                和
                <a href="#" className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200 mx-1">隐私政策</a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default WalletModal;