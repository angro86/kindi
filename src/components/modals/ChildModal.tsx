'use client';

import { useState } from 'react';
import { ChildModalProps, AvatarIndex } from '@/types';
import { X } from '@/components/ui/icons';
import { avatars } from '@/components/avatars';
import { AVATAR_NAMES } from '@/lib/constants';

export function ChildModal({ child, onSave, onClose }: ChildModalProps) {
  const [name, setName] = useState(child?.name || '');
  const [age, setAge] = useState(child?.age || 4);
  const [av, setAv] = useState<AvatarIndex>(child?.avatar || 0);

  const handleSave = () => {
    if (name.trim()) {
      onSave({ id: child?.id || Date.now(), name, age, avatar: av });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{child ? 'Edit' : 'Add'} Profile</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="flex gap-3 justify-center mb-6">
          {avatars.map((Avatar, i) => (
            <button
              key={i}
              onClick={() => setAv(i as AvatarIndex)}
              className={`p-2 rounded-xl ${av === i ? 'bg-indigo-100 ring-2 ring-indigo-400' : ''}`}
            >
              <Avatar size={50} />
              <span className="text-xs text-gray-500 block">{AVATAR_NAMES[i]}</span>
            </button>
          ))}
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg mb-4"
          placeholder="Name"
        />
        <div className="mb-6">
          <span className="text-sm text-gray-600">Age: {age}</span>
          <input
            type="range"
            min="2"
            max="8"
            value={age}
            onChange={(e) => setAge(+e.target.value)}
            className="w-full mt-2"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-indigo-500 font-bold text-white"
          >
            {child ? 'Save' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
