'use client';

import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Preview from '@/components/Preview';
import { WEBSITES as websites, RTP_STYLES as styles, BACKGROUND_CATEGORIES as defaultBgCategories } from '@/data/config';
import { TextRow, RightModalImage, BackgroundCategory } from '@/types';
import { toPng } from 'html-to-image';
import GIF from 'gif.js';

export default function HomePage() {
  // Website selection
  const [selectedWebsite, setSelectedWebsite] = useState(websites[0]);

  // Style selection
  const [selectedStyle, setSelectedStyle] = useState(styles[0]);

  // Background selection
  const [selectedBackground, setSelectedBackground] = useState(defaultBgCategories[0].backgrounds[0]);

  // Left modal content
  const [headerText, setHeaderText] = useState('LINK ALTERNATIF');
  const [text1, setText1] = useState('www.example1.com');
  const [text2, setText2] = useState('www.example2.com');
  const [additionalTexts, setAdditionalTexts] = useState<TextRow[]>([]);
  const [footer1Text, setFooter1Text] = useState('KETIK "NAMA WEB" DI GOOGLE UNTUK MENEMUKAN LINK TERBARU');
  const [searchBarText, setSearchBarText] = useState('NAMA WEB');

  // Right modal content
  const [rightModalTitle, setRightModalTitle] = useState('Klik di sini');
  const [rightModalImages, setRightModalImages] = useState<RightModalImage[]>([]);
  const [rightModalFooter, setRightModalFooter] = useState('Silahkan clear cache atau menggunakan vpn');

  // Animation frame for preview
  const [animationFrame, setAnimationFrame] = useState(0);

  // GIF generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  // GIF output settings
  const [outputSize, setOutputSize] = useState<'small' | 'medium' | 'large'>('medium');

  const sizeConfig = {
    small: { width: 640, height: 320, scale: 0.2 },
    medium: { width: 960, height: 480, scale: 0.3 },
    large: { width: 1280, height: 640, scale: 0.4 },
  };

  // Ref for preview element
  const previewRef = useRef<HTMLDivElement>(null);

  // Animation loop for live preview
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 120); // 4 second loop at 30fps
    }, 1000 / 30); // 30fps

    return () => clearInterval(interval);
  }, []);

  // Dynamic background categories based on selected website
  const dynamicBackgroundCategories = useMemo<BackgroundCategory[]>(() => {
    const categories: BackgroundCategory[] = [];

    // Add website-exclusive backgrounds if available
    if (selectedWebsite.backgrounds && selectedWebsite.backgrounds.length > 0) {
      categories.push({
        id: `exclusive-${selectedWebsite.id}`,
        name: `Exclusive ${selectedWebsite.name}`,
        backgrounds: selectedWebsite.backgrounds,
      });
    }

    // Add default categories
    return [...categories, ...defaultBgCategories];
  }, [selectedWebsite]);

  // Auto-select exclusive background and slideshow images when website changes
  useEffect(() => {
    if (selectedWebsite.backgrounds && selectedWebsite.backgrounds.length > 0) {
      setSelectedBackground(selectedWebsite.backgrounds[0]);
    }
    // Auto-load slideshow images if available
    if (selectedWebsite.slideshowImages && selectedWebsite.slideshowImages.length > 0) {
      setRightModalImages(
        selectedWebsite.slideshowImages.map((url, idx) => ({
          id: `slideshow-${idx}`,
          url,
          name: ''
        }))
      );
    }
  }, [selectedWebsite]);

  // Shuffle functions
  const shuffleBackground = useCallback(() => {
    const allBgs = dynamicBackgroundCategories.flatMap(cat => cat.backgrounds);
    const randomBg = allBgs[Math.floor(Math.random() * allBgs.length)];
    setSelectedBackground(randomBg);
  }, [dynamicBackgroundCategories]);

  const shuffleStyle = useCallback(() => {
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    setSelectedStyle(randomStyle);
  }, []);

  // Additional text handlers
  const addText = useCallback(() => {
    setAdditionalTexts(prev => [...prev, { id: Date.now().toString(), text: '' }]);
  }, []);

  const removeText = useCallback((id: string) => {
    setAdditionalTexts(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateText = useCallback((id: string, text: string) => {
    setAdditionalTexts(prev => prev.map(t => t.id === id ? { ...t, text } : t));
  }, []);

  // Right modal image handlers
  const addRightModalImage = useCallback(() => {
    setRightModalImages(prev => [...prev, { id: Date.now().toString(), url: '', name: '' }]);
  }, []);

  const removeRightModalImage = useCallback((id: string) => {
    setRightModalImages(prev => prev.filter(img => img.id !== id));
  }, []);

  const updateRightModalImage = useCallback((id: string, url: string, name: string) => {
    setRightModalImages(prev => prev.map(img => img.id === id ? { ...img, url, name } : img));
  }, []);

  // Scale image using canvas
  const scaleImage = (img: HTMLImageElement, targetWidth: number, targetHeight: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    return canvas;
  };

  // Generate GIF with compression
  const generateGif = async () => {
    if (!previewRef.current) return;

    setIsGenerating(true);
    setProgress(0);

    const config = sizeConfig[outputSize];

    try {
      const gif = new GIF({
        workers: 2,
        quality: 20, // Higher = more compression (1-30)
        width: config.width,
        height: config.height,
        workerScript: '/gif.worker.js',
        dither: false, // Disable dithering for smaller file
      });

      const totalFrames = 24; // Reduced frames
      const frameDelay = 80; // ~12fps

      // Capture frames
      for (let frame = 0; frame < totalFrames; frame++) {
        // Update animation frame
        setAnimationFrame(frame * 5); // Speed up animation cycle

        // Wait for render
        await new Promise(resolve => setTimeout(resolve, 80));

        // Capture frame at FULL size (3200x1600)
        const dataUrl = await toPng(previewRef.current, {
          width: 3200,
          height: 1600,
          pixelRatio: 1,
          cacheBust: true,
        });

        // Load full-size image
        const fullImg = new Image();
        await new Promise<void>((resolve, reject) => {
          fullImg.onload = () => resolve();
          fullImg.onerror = reject;
          fullImg.src = dataUrl;
        });

        // Scale down to target size using canvas
        const scaledCanvas = scaleImage(fullImg, config.width, config.height);

        // Add scaled frame to GIF
        gif.addFrame(scaledCanvas, { delay: frameDelay, copy: true });

        setProgress(Math.round(((frame + 1) / totalFrames) * 100));
      }

      // Render GIF
      gif.on('finished', (blob: Blob) => {
        // Show file size
        const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
        console.log(`GIF size: ${sizeMB} MB`);

        // Download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedWebsite.name.toLowerCase().replace(/\s+/g, '-')}-link-alternatif-${config.width}x${config.height}.gif`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setIsGenerating(false);
        setProgress(0);
      });

      gif.render();
    } catch (error) {
      console.error('Error generating GIF:', error);
      setIsGenerating(false);
      setProgress(0);
      alert('Gagal membuat GIF. Silahkan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Link Alternative Homepage GIF Generator
          </h1>
          <p className="text-gray-400 mt-2">Buat GIF animasi untuk homepage link alternatif (3200x1600px)</p>
        </div>

        {/* Header Controls */}
        <Header
          selectedWebsite={selectedWebsite}
          onWebsiteChange={setSelectedWebsite}
          websites={websites}
          selectedBackground={selectedBackground}
          onBackgroundChange={setSelectedBackground}
          backgroundCategories={dynamicBackgroundCategories}
          selectedStyle={selectedStyle}
          onStyleChange={setSelectedStyle}
          styles={styles}
          headerText={headerText}
          onHeaderTextChange={setHeaderText}
          text1={text1}
          onText1Change={setText1}
          text2={text2}
          onText2Change={setText2}
          additionalTexts={additionalTexts}
          onAddText={addText}
          onRemoveText={removeText}
          onUpdateText={updateText}
          footer1Text={footer1Text}
          onFooter1TextChange={setFooter1Text}
          searchBarText={searchBarText}
          onSearchBarTextChange={setSearchBarText}
          rightModalTitle={rightModalTitle}
          onRightModalTitleChange={setRightModalTitle}
          rightModalImages={rightModalImages}
          onAddRightModalImage={addRightModalImage}
          onRemoveRightModalImage={removeRightModalImage}
          onUpdateRightModalImage={updateRightModalImage}
          rightModalFooter={rightModalFooter}
          onRightModalFooterChange={setRightModalFooter}
          onShuffleBackground={shuffleBackground}
          onShuffleStyle={shuffleStyle}
        />

        {/* Output Size & Generate Button */}
        <div className="flex flex-col items-center gap-4">
          {/* Size Selector */}
          <div className="flex items-center gap-4 bg-gray-900 rounded-lg p-4">
            <span className="text-gray-300 font-medium">Ukuran Output:</span>
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setOutputSize(size)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    outputSize === size
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {size === 'small' && '640x320 (~1-2MB)'}
                  {size === 'medium' && '960x480 (~2-4MB)'}
                  {size === 'large' && '1280x640 (~4-8MB)'}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            size="lg"
            onClick={generateGif}
            disabled={isGenerating}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-6 text-xl"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                Generating... {progress}%
              </>
            ) : (
              <>
                <Download className="w-6 h-6 mr-2" />
                Download GIF ({sizeConfig[outputSize].width}x{sizeConfig[outputSize].height})
              </>
            )}
          </Button>
        </div>

        {/* Preview */}
        <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
          <h2 className="text-xl font-semibold text-gray-300 mb-4">Preview (Live Animation)</h2>
          <div className="overflow-auto max-h-[600px] border border-gray-700 rounded-lg">
            <div style={{ transform: 'scale(0.25)', transformOrigin: 'top left', width: '800px', height: '400px' }}>
              <Preview
                ref={previewRef}
                selectedWebsite={selectedWebsite}
                selectedStyle={selectedStyle}
                selectedBackground={selectedBackground}
                headerText={headerText}
                text1={text1}
                text2={text2}
                additionalTexts={additionalTexts}
                footer1Text={footer1Text}
                searchBarText={searchBarText}
                rightModalTitle={rightModalTitle}
                rightModalImages={rightModalImages}
                rightModalFooter={rightModalFooter}
                animationFrame={animationFrame}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
