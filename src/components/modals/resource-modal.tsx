'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Folder,
  Search,
  User,
  HardDrive,
  Calendar,
  Info,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../dialog';
import { Button } from '../button';
import { Input } from '../input';
import { cn } from '../../lib/utils';

export type ResourceModalType =
  | 'rename'
  | 'delete'
  | 'tag'
  | 'move'
  | 'properties';

export interface ResourceModalProps {
  type: ResourceModalType | null;
  open: boolean;
  onClose: () => void;
  itemName: string;
  initialValue?: string;
  onConfirm?: (value: any) => void;
  isLoading?: boolean;
  // properties specific
  itemDetails?: {
    ownerName: string;
    location: string;
    sizeBytes: number;
    createdAt: number;
    updatedAt: number | null;
  };
  formatDate?: (date: number) => string;
  formatBytes?: (bytes: number) => string;
  // tags specific
  initialTags?: { id: string; name: string }[];
}

export const ResourceModal: React.FC<ResourceModalProps> = ({
  type,
  open,
  onClose,
  itemName,
  initialValue,
  onConfirm,
  isLoading,
  itemDetails,
  formatDate,
  formatBytes,
  initialTags,
}) => {
  const [inputValue, setInputValue] = useState(initialValue || '');
  const [tags, setTags] = useState<string[]>(
    initialTags?.map((t) => t.name) || [],
  );
  const [tagInput, setTagInput] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setInputValue(initialValue || '');
      setTags(initialTags?.map((t) => t.name) || []);
      setTagInput('');
      setSelectedFolderId(null);
    }
  }, [open, initialValue, initialTags]);

  const handleConfirm = () => {
    if (type === 'rename') onConfirm?.(inputValue);
    else if (type === 'tag') onConfirm?.(tags);
    else if (type === 'move') onConfirm?.(selectedFolderId);
    else onConfirm?.(null);
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'rename':
        return '이름 바꾸기';
      case 'delete':
        return '항목 삭제';
      case 'tag':
        return '태그 관리';
      case 'move':
        return '항목 이동';
      case 'properties':
        return '속성';
      default:
        return '';
    }
  };

  if (!type) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'sm:max-w-[425px]',
          type === 'tag' || type === 'move' ? 'sm:max-w-[480px]' : '',
        )}
      >
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          {(type === 'tag' || type === 'move' || type === 'rename') && (
            <p className="text-sm text-slate-500 text-center truncate px-4">
              {itemName}
            </p>
          )}
        </DialogHeader>

        <div className="py-4">
          {type === 'rename' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">이름</label>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="이름을 입력하세요"
                  autoFocus
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>
          )}

          {type === 'delete' && (
            <div className="text-center space-y-2">
              <p className="text-slate-900 font-medium">
                항목을 삭제하시겠습니까?
              </p>
              <p className="text-sm text-slate-500">
                삭제된 항목은 휴지통으로 이동됩니다.
              </p>
            </div>
          )}

          {type === 'tag' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-700">
                  현재 태그
                </h3>
                <div className="flex flex-wrap gap-2 min-h-12 p-3 border rounded-lg bg-slate-50">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-md text-sm text-slate-700 shadow-sm"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}
                  {tags.length === 0 && (
                    <span className="text-sm text-slate-400 self-center italic">
                      등록된 태그가 없습니다.
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="태그 이름을 입력해주세요."
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button
                  variant="secondary"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || tags.length >= 5}
                >
                  추가
                </Button>
              </div>
            </div>
          )}

          {type === 'move' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input className="pl-9" placeholder="폴더 검색" />
              </div>
              <div className="border rounded-lg overflow-hidden bg-slate-50 h-64 overflow-y-auto p-2">
                <div
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${selectedFolderId === 'root' ? 'bg-blue-100 text-blue-700' : 'hover:bg-white'}`}
                  onClick={() => setSelectedFolderId('root')}
                >
                  <Folder className="size-4 fill-current opacity-70" />
                  <span className="text-sm font-medium">내 드라이브</span>
                </div>
              </div>
            </div>
          )}

          {type === 'properties' && itemDetails && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Info className="size-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">
                    {itemName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">노트 항목</p>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">소유자</span>
                  <span>{itemDetails.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">위치</span>
                  <span>{itemDetails.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">크기</span>
                  <span>
                    {formatBytes?.(itemDetails.sizeBytes) ||
                      itemDetails.sizeBytes}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">생성일</span>
                  <span>
                    {formatDate?.(itemDetails.createdAt) ||
                      itemDetails.createdAt}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className={cn(type === 'move' ? 'justify-between' : '')}>
          {type === 'move' && (
            <Button variant="ghost" className="h-9 text-xs px-2">
              새 폴더 만들기
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              취소
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading || (type === 'rename' && !inputValue.trim())}
            >
              {type === 'delete' ? '삭제' : '확인'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
