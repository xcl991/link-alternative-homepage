'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Shuffle, Plus, Trash2, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WebsiteOption, RTPStyle, BackgroundCategory, TextRow, RightModalImage } from '@/types';

interface HeaderProps {
  // Website
  selectedWebsite: WebsiteOption;
  onWebsiteChange: (website: WebsiteOption) => void;
  websites: WebsiteOption[];

  // Background
  selectedBackground: string;
  onBackgroundChange: (bg: string) => void;
  backgroundCategories: BackgroundCategory[];

  // Style
  selectedStyle: RTPStyle;
  onStyleChange: (style: RTPStyle) => void;
  styles: RTPStyle[];

  // Left Modal Content
  headerText: string;
  onHeaderTextChange: (text: string) => void;
  text1: string;
  onText1Change: (text: string) => void;
  text2: string;
  onText2Change: (text: string) => void;
  additionalTexts: TextRow[];
  onAddText: () => void;
  onRemoveText: (id: string) => void;
  onUpdateText: (id: string, text: string) => void;
  footer1Text: string;
  onFooter1TextChange: (text: string) => void;
  searchBarText: string;
  onSearchBarTextChange: (text: string) => void;

  // Right Modal Content
  rightModalTitle: string;
  onRightModalTitleChange: (text: string) => void;
  rightModalImages: RightModalImage[];
  onAddRightModalImage: () => void;
  onRemoveRightModalImage: (id: string) => void;
  onUpdateRightModalImage: (id: string, url: string, name: string) => void;
  rightModalFooter: string;
  onRightModalFooterChange: (text: string) => void;

  // Actions
  onShuffleBackground: () => void;
  onShuffleStyle: () => void;
}

export default function Header({
  selectedWebsite,
  onWebsiteChange,
  websites,
  selectedBackground,
  onBackgroundChange,
  backgroundCategories,
  selectedStyle,
  onStyleChange,
  styles,
  headerText,
  onHeaderTextChange,
  text1,
  onText1Change,
  text2,
  onText2Change,
  additionalTexts,
  onAddText,
  onRemoveText,
  onUpdateText,
  footer1Text,
  onFooter1TextChange,
  searchBarText,
  onSearchBarTextChange,
  rightModalTitle,
  onRightModalTitleChange,
  rightModalImages,
  onAddRightModalImage,
  onRemoveRightModalImage,
  onUpdateRightModalImage,
  rightModalFooter,
  onRightModalFooterChange,
  onShuffleBackground,
  onShuffleStyle,
}: HeaderProps) {
  const [isWebsiteOpen, setIsWebsiteOpen] = useState(false);
  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const [isBgCategoryOpen, setIsBgCategoryOpen] = useState(false);
  const [selectedBgCategory, setSelectedBgCategory] = useState<BackgroundCategory>(backgroundCategories[0]);

  useEffect(() => {
    if (backgroundCategories.length > 0) {
      setSelectedBgCategory(backgroundCategories[0]);
    }
  }, [backgroundCategories]);

  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-xl space-y-4">
      {/* Row 1: Website & Style Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Website Selector */}
        <div className="space-y-2">
          <Label className="text-gray-300">Website</Label>
          <div className="relative">
            <button
              onClick={() => setIsWebsiteOpen(!isWebsiteOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <span className="text-white truncate">{selectedWebsite.name}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isWebsiteOpen ? 'rotate-180' : ''}`} />
            </button>
            {isWebsiteOpen && (
              <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {websites.map((website) => (
                  <button
                    key={website.id}
                    onClick={() => {
                      onWebsiteChange(website);
                      setIsWebsiteOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors ${
                      selectedWebsite.id === website.id ? 'bg-blue-600/20 text-blue-400' : 'text-white'
                    }`}
                  >
                    {website.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Style Selector */}
        <div className="space-y-2">
          <Label className="text-gray-300">Style Warna</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <button
                onClick={() => setIsStyleOpen(!isStyleOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedStyle.primaryColor }}
                  />
                  <span className="text-white truncate">{selectedStyle.name}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isStyleOpen ? 'rotate-180' : ''}`} />
              </button>
              {isStyleOpen && (
                <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => {
                        onStyleChange(style);
                        setIsStyleOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors flex items-center gap-2 ${
                        selectedStyle.id === style.id ? 'bg-blue-600/20 text-blue-400' : 'text-white'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: style.primaryColor }}
                      />
                      {style.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={onShuffleStyle}
              className="shrink-0"
              title="Acak Style"
            >
              <Shuffle className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Background Category */}
        <div className="space-y-2 lg:col-span-2">
          <Label className="text-gray-300">Kategori Background</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <button
                onClick={() => setIsBgCategoryOpen(!isBgCategoryOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-colors"
              >
                <span className="text-white truncate">{selectedBgCategory.name}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isBgCategoryOpen ? 'rotate-180' : ''}`} />
              </button>
              {isBgCategoryOpen && (
                <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {backgroundCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedBgCategory(cat);
                        onBackgroundChange(cat.backgrounds[0]);
                        setIsBgCategoryOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors ${
                        selectedBgCategory.id === cat.id ? 'bg-blue-600/20 text-blue-400' : 'text-white'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={onShuffleBackground}
              className="shrink-0"
              title="Acak Background"
            >
              <Shuffle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Row 2: Background Thumbnails */}
      <div className="space-y-2">
        <Label className="text-gray-300">Pilih Background</Label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {selectedBgCategory.backgrounds.map((bg, idx) => (
            <button
              key={idx}
              onClick={() => onBackgroundChange(bg)}
              className={`shrink-0 w-20 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                selectedBackground === bg ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-700 hover:border-gray-500'
              }`}
            >
              <img
                src={bg}
                alt={`BG ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Row 3: Left Modal Content */}
      <div className="border-t border-gray-700 pt-4">
        <h3 className="text-lg font-semibold text-cyan-400 mb-3">Modal Kiri (65%)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Header Text (Wave Effect)</Label>
            <Input
              value={headerText}
              onChange={(e) => onHeaderTextChange(e.target.value)}
              placeholder="LINK ALTERNATIF"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Text 1</Label>
            <Input
              value={text1}
              onChange={(e) => onText1Change(e.target.value)}
              placeholder="www.example.com"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Text 2</Label>
            <Input
              value={text2}
              onChange={(e) => onText2Change(e.target.value)}
              placeholder="www.example2.com"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>

        {/* Additional Texts */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-gray-300">Text Tambahan</Label>
            <Button variant="outline" size="sm" onClick={onAddText} className="gap-1">
              <Plus className="w-4 h-4" />
              Tambah
            </Button>
          </div>
          {additionalTexts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {additionalTexts.map((row, idx) => (
                <div key={row.id} className="flex gap-2">
                  <Input
                    value={row.text}
                    onChange={(e) => onUpdateText(row.id, e.target.value)}
                    placeholder={`Text ${idx + 3}`}
                    className="bg-gray-800 border-gray-700 text-white flex-1"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onRemoveText(row.id)}
                    className="shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Texts */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Footer 1 (Instruksi)</Label>
            <Input
              value={footer1Text}
              onChange={(e) => onFooter1TextChange(e.target.value)}
              placeholder='KETIK "NAMA WEB" DI GOOGLE...'
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Search Bar Text (Kedap Kedip)</Label>
            <Input
              value={searchBarText}
              onChange={(e) => onSearchBarTextChange(e.target.value)}
              placeholder="NAMA WEB"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
      </div>

      {/* Row 4: Right Modal Content */}
      <div className="border-t border-gray-700 pt-4">
        <h3 className="text-lg font-semibold text-purple-400 mb-3">Modal Kanan (35%)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Judul Modal (Kedap Kedip)</Label>
            <Input
              value={rightModalTitle}
              onChange={(e) => onRightModalTitleChange(e.target.value)}
              placeholder="Klik di sini"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Footer Modal Kanan</Label>
            <Input
              value={rightModalFooter}
              onChange={(e) => onRightModalFooterChange(e.target.value)}
              placeholder="Silahkan clear cache atau menggunakan vpn"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>

        {/* Right Modal Images */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-gray-300">Gambar CDN (untuk slideshow)</Label>
            <Button variant="outline" size="sm" onClick={onAddRightModalImage} className="gap-1">
              <Image className="w-4 h-4" />
              Tambah Gambar
            </Button>
          </div>
          {rightModalImages.length > 0 && (
            <div className="space-y-2">
              {rightModalImages.map((img, idx) => (
                <div key={img.id} className="flex gap-2 items-center">
                  <Input
                    value={img.url}
                    onChange={(e) => onUpdateRightModalImage(img.id, e.target.value, img.name)}
                    placeholder={`URL Gambar ${idx + 1}`}
                    className="bg-gray-800 border-gray-700 text-white flex-1"
                  />
                  <Input
                    value={img.name}
                    onChange={(e) => onUpdateRightModalImage(img.id, img.url, e.target.value)}
                    placeholder="Nama"
                    className="bg-gray-800 border-gray-700 text-white w-32"
                  />
                  {img.url && (
                    <div className="w-12 h-12 rounded overflow-hidden border border-gray-600">
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onRemoveRightModalImage(img.id)}
                    className="shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
