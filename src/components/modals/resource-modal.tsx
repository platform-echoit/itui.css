'use client';

import React, { useState, useEffect } from 'react';
import { FolderRegularIcon } from '../../icons/ITUI/folder';
import { InfoRegularIcon } from '../../icons/ITUI/info';
import { MagnifyingGlassRegularIcon } from '../../icons/ITUI/magnifying-glass';
import { XRegularIcon } from '../../icons/ITUI/x';
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

/**
 * Every string the five modal bodies render. One bag rather than 25 props:
 * they are always translated together and would otherwise bury the eleven
 * behavioural props in autocomplete.
 */
export interface ResourceModalLabels {
  renameTitle: string;
  deleteTitle: string;
  tagTitle: string;
  moveTitle: string;
  propertiesTitle: string;
  /** rename */
  nameLabel: string;
  namePlaceholder: string;
  /** delete */
  deleteQuestion: string;
  deleteNote: string;
  /** tag */
  currentTagsTitle: string;
  noTagsText: string;
  tagPlaceholder: string;
  addTagText: string;
  /** `aria-label` on each tag's remove button */
  removeTagLabel: string;
  /** move */
  folderSearchPlaceholder: string;
  rootFolderName: string;
  newFolderText: string;
  /** properties */
  itemTypeText: string;
  ownerLabel: string;
  locationLabel: string;
  sizeLabel: string;
  createdLabel: string;
  /** footer */
  cancelText: string;
  confirmText: string;
  deleteText: string;
}

const DEFAULT_LABELS: ResourceModalLabels = {
  renameTitle: 'Rename',
  deleteTitle: 'Delete item',
  tagTitle: 'Manage tags',
  moveTitle: 'Move item',
  propertiesTitle: 'Properties',
  nameLabel: 'Name',
  namePlaceholder: 'Enter a name',
  deleteQuestion: 'Delete this item?',
  deleteNote: 'Deleted items are moved to the trash.',
  currentTagsTitle: 'Current tags',
  noTagsText: 'No tags yet.',
  tagPlaceholder: 'Enter a tag name',
  addTagText: 'Add',
  removeTagLabel: 'Remove tag',
  folderSearchPlaceholder: 'Search folders',
  rootFolderName: 'My Drive',
  newFolderText: 'New folder',
  itemTypeText: 'Note',
  ownerLabel: 'Owner',
  locationLabel: 'Location',
  sizeLabel: 'Size',
  createdLabel: 'Created',
  cancelText: 'Cancel',
  confirmText: 'Confirm',
  deleteText: 'Delete',
};

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
  /** Overrides for any of the modal's built-in English strings */
  labels?: Partial<ResourceModalLabels>;
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
  labels,
}) => {
  const text = { ...DEFAULT_LABELS, ...labels };
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
        return text.renameTitle;
      case 'delete':
        return text.deleteTitle;
      case 'tag':
        return text.tagTitle;
      case 'move':
        return text.moveTitle;
      case 'properties':
        return text.propertiesTitle;
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
                <label className="text-sm font-medium">{text.nameLabel}</label>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={text.namePlaceholder}
                  autoFocus
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>
          )}

          {type === 'delete' && (
            <div className="text-center space-y-2">
              <p className="text-slate-900 font-medium">{text.deleteQuestion}</p>
              <p className="text-sm text-slate-500">{text.deleteNote}</p>
            </div>
          )}

          {type === 'tag' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-700">
                  {text.currentTagsTitle}
                </h3>
                <div className="flex flex-wrap gap-2 min-h-12 p-3 border rounded-lg bg-slate-50">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-md text-sm text-slate-700 shadow-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        aria-label={text.removeTagLabel}
                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <XRegularIcon className="size-3.5 [&_path]:fill-current" />
                      </button>
                    </div>
                  ))}
                  {tags.length === 0 && (
                    <span className="text-sm text-slate-400 self-center italic">
                      {text.noTagsText}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder={text.tagPlaceholder}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button
                  variant="secondary"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || tags.length >= 5}
                >
                  {text.addTagText}
                </Button>
              </div>
            </div>
          )}

          {type === 'move' && (
            <div className="space-y-4">
              <div className="relative">
                <MagnifyingGlassRegularIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 [&_path]:fill-current" />
                <Input
                  className="pl-9"
                  placeholder={text.folderSearchPlaceholder}
                />
              </div>
              <div className="border rounded-lg overflow-hidden bg-slate-50 h-64 overflow-y-auto p-2">
                <div
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${selectedFolderId === 'root' ? 'bg-blue-100 text-blue-700' : 'hover:bg-white'}`}
                  onClick={() => setSelectedFolderId('root')}
                >
                  <FolderRegularIcon className="size-4 opacity-70 [&_path]:fill-current" />
                  <span className="text-sm font-medium">
                    {text.rootFolderName}
                  </span>
                </div>
              </div>
            </div>
          )}

          {type === 'properties' && itemDetails && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <InfoRegularIcon className="size-6 text-blue-600 [&_path]:fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">
                    {itemName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {text.itemTypeText}
                  </p>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">{text.ownerLabel}</span>
                  <span>{itemDetails.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{text.locationLabel}</span>
                  <span>{itemDetails.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{text.sizeLabel}</span>
                  <span>
                    {formatBytes?.(itemDetails.sizeBytes) ||
                      itemDetails.sizeBytes}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{text.createdLabel}</span>
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
              {text.newFolderText}
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              {text.cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading || (type === 'rename' && !inputValue.trim())}
            >
              {type === 'delete' ? text.deleteText : text.confirmText}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
