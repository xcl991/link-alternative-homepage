'use client';

import { forwardRef } from 'react';
import { WebsiteOption, RTPStyle, TextRow, RightModalImage } from '@/types';

// Helper function to proxy external URLs for CORS
const proxyUrl = (url: string) => {
  if (!url) return '';
  // Use our proxy API to fetch external images
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
};

interface PreviewProps {
  selectedWebsite: WebsiteOption;
  selectedStyle: RTPStyle;
  selectedBackground: string;
  headerText: string;
  text1: string;
  text2: string;
  additionalTexts: TextRow[];
  footer1Text: string;
  searchBarText: string;
  rightModalTitle: string;
  rightModalImages: RightModalImage[];
  rightModalFooter: string;
  animationFrame: number; // 0-based frame for GIF animation
}

// Wave text component - splits text into animated characters (150% larger)
const WaveText = ({ text, style, frame }: { text: string; style: RTPStyle; frame: number }) => {
  const chars = text.split('');

  return (
    <div className="flex justify-center items-center flex-wrap">
      {chars.map((char, idx) => {
        // Calculate wave offset based on frame and character position
        const waveOffset = Math.sin((frame * 0.3 + idx * 0.3)) * 20;

        return (
          <span
            key={idx}
            className="inline-block font-black tracking-wider"
            style={{
              fontSize: '7rem', // 150% larger (was ~4rem/text-6xl)
              color: style.primaryColor,
              textShadow: `0 0 30px ${style.primaryColor}, 0 0 60px ${style.primaryColor}80`,
              transform: `translateY(${waveOffset}px)`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </div>
  );
};

// Google search bar component with blinking cursor (150% larger)
const GoogleSearchBar = ({ text, style, isVisible }: { text: string; style: RTPStyle; isVisible: boolean }) => {
  return (
    <div
      className="bg-white rounded-full px-12 py-6 flex items-center gap-6 shadow-lg"
      style={{
        minWidth: '750px',
        boxShadow: `0 0 40px ${style.primaryColor}40`
      }}
    >
      {/* Google Logo */}
      <div className="flex items-center gap-1 font-bold" style={{ fontSize: '2.5rem' }}>
        <span style={{ color: '#4285F4' }}>G</span>
        <span style={{ color: '#EA4335' }}>o</span>
        <span style={{ color: '#FBBC05' }}>o</span>
        <span style={{ color: '#4285F4' }}>g</span>
        <span style={{ color: '#34A853' }}>l</span>
        <span style={{ color: '#EA4335' }}>e</span>
      </div>
      {/* Search input */}
      <div className="flex-1 flex items-center border-2 border-gray-300 rounded-full px-6 py-3">
        <span
          className="text-gray-800 font-semibold"
          style={{
            fontSize: '2rem',
            opacity: isVisible ? 1 : 0.3,
            transition: 'opacity 0.3s ease-in-out'
          }}
        >
          {text}
        </span>
        <span
          className="ml-2 w-1 h-10 bg-gray-800"
          style={{ opacity: isVisible ? 1 : 0 }}
        />
      </div>
    </div>
  );
};

// Blinking modal component (150% larger)
const BlinkingModal = ({
  title,
  style,
  isVisible
}: {
  title: string;
  style: RTPStyle;
  isVisible: boolean;
}) => {
  return (
    <div
      className="px-12 py-6 rounded-2xl text-center"
      style={{
        background: `linear-gradient(135deg, ${style.primaryColor}30, ${style.accentColor}20)`,
        border: `4px solid ${style.primaryColor}`,
        boxShadow: isVisible
          ? `0 0 60px ${style.primaryColor}, 0 0 120px ${style.primaryColor}60`
          : `0 0 30px ${style.primaryColor}40`,
        transform: isVisible ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <span
        className="font-black"
        style={{
          fontSize: '4rem', // 150% larger (was ~2.5rem/text-4xl)
          color: style.secondaryColor,
          textShadow: `0 0 30px ${style.secondaryColor}`,
          opacity: isVisible ? 1 : 0.6,
        }}
      >
        {title}
      </span>
    </div>
  );
};

const Preview = forwardRef<HTMLDivElement, PreviewProps>(({
  selectedWebsite,
  selectedStyle,
  selectedBackground,
  headerText,
  text1,
  text2,
  additionalTexts,
  footer1Text,
  searchBarText,
  rightModalTitle,
  rightModalImages,
  rightModalFooter,
  animationFrame,
}, ref) => {
  // Calculate animation states based on frame
  const blinkVisible = Math.floor(animationFrame / 15) % 2 === 0; // Blink every ~0.5 seconds at 30fps
  const currentImageIndex = rightModalImages.length > 0
    ? Math.floor(animationFrame / 60) % rightModalImages.length // Change image every ~2 seconds
    : 0;

  // Combine all texts
  const allTexts = [text1, text2, ...additionalTexts.map(t => t.text)].filter(t => t.trim() !== '');

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        width: '3200px',
        height: '1600px',
        backgroundImage: `url("${proxyUrl(selectedBackground)}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: selectedStyle.backgroundColor,
      }}
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${selectedStyle.backgroundColor}DD 0%, ${selectedStyle.backgroundColor}99 50%, ${selectedStyle.backgroundColor}DD 100%)`,
        }}
      />

      {/* Logo - Top Center (100% larger: h-32 → h-64) */}
      <div className="absolute top-8 left-0 right-0 flex justify-center z-10">
        <img
          src={proxyUrl(selectedWebsite.logo)}
          alt={selectedWebsite.name}
          crossOrigin="anonymous"
          className="h-64 w-auto object-contain"
          style={{ filter: `drop-shadow(0 0 40px ${selectedStyle.primaryColor}80)` }}
        />
      </div>

      {/* Main Content Container - Left and Right Modals */}
      <div className="absolute top-72 left-0 right-0 bottom-64 flex px-12 z-10">
        {/* Left Modal - 60% width - Frameless (150% larger content) */}
        <div className="w-[60%] flex flex-col justify-center items-center pr-8">
          {/* Header with Wave Effect */}
          {headerText && (
            <div className="mb-16">
              <WaveText text={headerText} style={selectedStyle} frame={animationFrame} />
            </div>
          )}

          {/* Text Lines (150% larger) */}
          <div className="w-full max-w-4xl space-y-8">
            {allTexts.map((text, idx) => (
              <div
                key={idx}
                className="px-16 py-8 rounded-3xl text-center"
                style={{
                  background: `linear-gradient(135deg, ${selectedStyle.accentColor}90 0%, ${selectedStyle.accentColor}60 100%)`,
                  border: `4px solid ${selectedStyle.primaryColor}60`,
                  boxShadow: `0 15px 60px ${selectedStyle.primaryColor}30`,
                }}
              >
                <span
                  className="font-bold"
                  style={{
                    fontSize: '4rem', // 150% larger (was ~2.5rem/text-4xl)
                    color: selectedStyle.secondaryColor,
                    textShadow: '0 3px 15px rgba(0,0,0,0.5)',
                  }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Modal - 40% width (150% larger content) */}
        <div className="w-[40%] flex flex-col justify-center items-center pl-8">
          {/* Blinking Title Modal */}
          {rightModalTitle && (
            <BlinkingModal
              title={rightModalTitle}
              style={selectedStyle}
              isVisible={blinkVisible}
            />
          )}

          {/* Image Slideshow (150% larger) */}
          {rightModalImages.length > 0 && (
            <div className="mt-12 w-full max-w-2xl">
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  border: `6px solid ${selectedStyle.primaryColor}60`,
                  boxShadow: `0 15px 75px ${selectedStyle.primaryColor}40`,
                }}
              >
                <img
                  src={proxyUrl(rightModalImages[currentImageIndex]?.url || '')}
                  alt={rightModalImages[currentImageIndex]?.name || 'Image'}
                  crossOrigin="anonymous"
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '700px' }}
                />
              </div>
              {/* Image name */}
              {rightModalImages[currentImageIndex]?.name && (
                <div className="mt-6 text-center">
                  <span
                    className="font-semibold"
                    style={{
                      fontSize: '2.5rem', // 150% larger
                      color: selectedStyle.secondaryColor
                    }}
                  >
                    {rightModalImages[currentImageIndex].name}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Right Modal Footer (larger) */}
          {rightModalFooter && (
            <div className="mt-12 text-center px-6">
              <span
                className="font-semibold"
                style={{
                  fontSize: '3rem', // Larger font
                  color: selectedStyle.primaryColor,
                  textShadow: `0 0 25px ${selectedStyle.primaryColor}60`,
                }}
              >
                {rightModalFooter}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Center Footer - Google Search Bar and Instruction */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex flex-col items-center gap-6">
        {/* Footer 1 - Instruction */}
        {footer1Text && (
          <div className="text-center">
            <span
              className="font-bold"
              style={{
                fontSize: '3.5rem', // Larger font
                color: selectedStyle.primaryColor,
                textShadow: `0 0 40px ${selectedStyle.primaryColor}80`,
              }}
            >
              {footer1Text}
            </span>
          </div>
        )}

        {/* Google Search Bar with Blinking */}
        {searchBarText && (
          <GoogleSearchBar
            text={searchBarText}
            style={selectedStyle}
            isVisible={blinkVisible}
          />
        )}
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';

export default Preview;
