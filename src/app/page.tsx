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
    if (selectedWebsite.exclusiveBackgrounds && selectedWebsite.exclusiveBackgrounds.length > 0) {
      categories.push({
        id: `exclusive-${selectedWebsite.id}`,
        name: `Exclusive ${selectedWebsite.name}`,
        backgrounds: selectedWebsite.exclusiveBackgrounds,
      });
    }

    // Add default categories
    return [...categories, ...defaultBgCategories];
  }, [selectedWebsite]);

  // Auto-select exclusive background when website changes
  useEffect(() => {
    if (selectedWebsite.exclusiveBackgrounds && selectedWebsite.exclusiveBackgrounds.length > 0) {
      setSelectedBackground(selectedWebsite.exclusiveBackgrounds[0]);
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

  // Generate GIF
  const generateGif = async () => {
    if (!previewRef.current) return;

    setIsGenerating(true);
    setProgress(0);

    try {
      const gif = new GIF({
        workers: 4,
        quality: 10,
        width: 3200,
        height: 1600,
        workerScript: '/gif.worker.js',
      });

      const totalFrames = 60; // 2 seconds at 30fps
      const frameDelay = 1000 / 30; // ~33ms per frame

      // Capture frames
      for (let frame = 0; frame < totalFrames; frame++) {
        // Update animation frame
        setAnimationFrame(frame * 2); // Multiply to speed up animation

        // Wait for render
        await new Promise(resolve => setTimeout(resolve, 50));

        // Capture frame
        const dataUrl = await toPng(previewRef.current, {
          width: 3200,
          height: 1600,
          pixelRatio: 1,
          cacheBust: true,
        });

        // Convert to image
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = dataUrl;
        });

        // Add frame to GIF
        gif.addFrame(img, { delay: frameDelay, copy: true });

        setProgress(Math.round((frame / totalFrames) * 100));
      }

      // Render GIF
      gif.on('finished', (blob: Blob) => {
        // Download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedWebsite.name.toLowerCase().replace(/\s+/g, '-')}-link-alternatif.gif`;
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

        {/* Generate Button */}
        <div className="flex justify-center gap-4">
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
                Download GIF
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
