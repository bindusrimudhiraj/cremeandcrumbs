import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export default function Notification() {
  const { notification } = useStore();
  if (!notification) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 shadow-xl animate-slide-up ${notification.type === 'error' ? 'bg-red-800 text-white' : 'bg-espresso-800 text-cream-100'}`}>
      {notification.type === 'error'
        ? <AlertCircle className="w-4 h-4 shrink-0" />
        : <CheckCircle className="w-4 h-4 text-gold-400 shrink-0" />}
      <p className="font-sans text-sm">{notification.message}</p>
    </div>
  );
}
