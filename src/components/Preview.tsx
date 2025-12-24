'use client';

import { forwardRef, useState, useEffect } from 'react';
import { WebsiteOption, RTPStyle, TextRow, RightModalImage } from '@/types';

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

// Wave text component - splits text into animated characters
const WaveText = ({ text, style, frame }: { text: string; style: RTPStyle; frame: number }) => {
  const chars = text.split('');

  return (
    <div className="flex justify-center items-center flex-wrap">
      {chars.map((char, idx) => {
        // Calculate wave offset based on frame and character position
        const waveOffset = Math.sin((frame * 0.3 + idx * 0.3)) * 15;

        return (
          <span
            key={idx}
            className="inline-block text-6xl font-black tracking-wider"
            style={{
              color: style.primaryColor,
              textShadow: `0 0 20px ${style.primaryColor}, 0 0 40px ${style.primaryColor}80`,
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

// Google search bar component with blinking cursor
const GoogleSearchBar = ({ text, style, isVisible }: { text: string; style: RTPStyle; isVisible: boolean }) => {
  return (
    <div className="flex justify-center mt-8">
      <div
        className="bg-white rounded-full px-8 py-4 flex items-center gap-4 shadow-lg"
        style={{
          minWidth: '500px',
          boxShadow: `0 0 30px ${style.primaryColor}40`
        }}
      >
        {/* Google Logo */}
        <div className="flex items-center gap-1 text-2xl font-bold">
          <span style={{ color: '#4285F4' }}>G</span>
          <span style={{ color: '#EA4335' }}>o</span>
          <span style={{ color: '#FBBC05' }}>o</span>
          <span style={{ color: '#4285F4' }}>g</span>
          <span style={{ color: '#34A853' }}>l</span>
          <span style={{ color: '#EA4335' }}>e</span>
        </div>
        {/* Search input */}
        <div className="flex-1 flex items-center border-2 border-gray-300 rounded-full px-4 py-2">
          <span
            className="text-xl text-gray-800 font-semibold"
            style={{
              opacity: isVisible ? 1 : 0.3,
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
            {text}
          </span>
          <span
            className="ml-1 w-0.5 h-6 bg-gray-800"
            style={{ opacity: isVisible ? 1 : 0 }}
          />
        </div>
      </div>
    </div>
  );
};

// Blinking modal component
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
      className="px-8 py-4 rounded-xl text-center"
      style={{
        background: `linear-gradient(135deg, ${style.primaryColor}30, ${style.accentColor}20)`,
        border: `3px solid ${style.primaryColor}`,
        boxShadow: isVisible
          ? `0 0 40px ${style.primaryColor}, 0 0 80px ${style.primaryColor}60`
          : `0 0 20px ${style.primaryColor}40`,
        transform: isVisible ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <span
        className="text-4xl font-black"
        style={{
          color: style.secondaryColor,
          textShadow: `0 0 20px ${style.secondaryColor}`,
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
        backgroundImage: `url("${selectedBackground}")`,
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

      {/* Logo - Top Center */}
      <div className="absolute top-12 left-0 right-0 flex justify-center z-10">
        <img
          src={selectedWebsite.logo}
          alt={selectedWebsite.name}
          className="h-32 w-auto object-contain"
          style={{ filter: `drop-shadow(0 0 30px ${selectedStyle.primaryColor}80)` }}
        />
      </div>

      {/* Content Container */}
      <div className="absolute inset-0 flex pt-48 px-12 pb-12 z-10">
        {/* Left Modal - 65% width - Frameless */}
        <div className="w-[65%] flex flex-col justify-center items-center pr-8">
          {/* Header with Wave Effect */}
          {headerText && (
            <div className="mb-12">
              <WaveText text={headerText} style={selectedStyle} frame={animationFrame} />
            </div>
          )}

          {/* Text Lines */}
          <div className="w-full max-w-3xl space-y-6">
            {allTexts.map((text, idx) => (
              <div
                key={idx}
                className="px-10 py-5 rounded-2xl text-center"
                style={{
                  background: `linear-gradient(135deg, ${selectedStyle.accentColor}90 0%, ${selectedStyle.accentColor}60 100%)`,
                  border: `3px solid ${selectedStyle.primaryColor}60`,
                  boxShadow: `0 10px 40px ${selectedStyle.primaryColor}30`,
                }}
              >
                <span
                  className="text-4xl font-bold"
                  style={{
                    color: selectedStyle.secondaryColor,
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Footer 1 - Instruction */}
          {footer1Text && (
            <div className="mt-12 text-center">
              <span
                className="text-3xl font-semibold"
                style={{
                  color: selectedStyle.primaryColor,
                  textShadow: `0 0 20px ${selectedStyle.primaryColor}60`,
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

        {/* Right Modal - 35% width */}
        <div className="w-[35%] flex flex-col justify-center items-center pl-8">
          {/* Blinking Title Modal */}
          {rightModalTitle && (
            <BlinkingModal
              title={rightModalTitle}
              style={selectedStyle}
              isVisible={blinkVisible}
            />
          )}

          {/* Image Slideshow */}
          {rightModalImages.length > 0 && (
            <div className="mt-8 w-full max-w-lg">
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  border: `4px solid ${selectedStyle.primaryColor}60`,
                  boxShadow: `0 10px 50px ${selectedStyle.primaryColor}40`,
                }}
              >
                <img
                  src={rightModalImages[currentImageIndex]?.url || ''}
                  alt={rightModalImages[currentImageIndex]?.name || 'Image'}
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '600px' }}
                />
              </div>
              {/* Image name */}
              {rightModalImages[currentImageIndex]?.name && (
                <div className="mt-4 text-center">
                  <span
                    className="text-2xl font-semibold"
                    style={{ color: selectedStyle.secondaryColor }}
                  >
                    {rightModalImages[currentImageIndex].name}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Right Modal Footer */}
          {rightModalFooter && (
            <div className="mt-8 text-center px-4">
              <span
                className="text-2xl"
                style={{
                  color: selectedStyle.primaryColor,
                  textShadow: `0 0 15px ${selectedStyle.primaryColor}40`,
                }}
              >
                {rightModalFooter}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';

export default Preview;
