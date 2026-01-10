"use client";

import Image from "next/image";

interface StoryBodyProps {
  content: string;
}

export default function StoryBody({ content }: StoryBodyProps) {
  // Parse content - handle images with ![alt](url) and full-bleed with !![alt](url)
  const parseContent = (text: string) => {
    const parts: Array<{ type: 'text' | 'image' | 'fullbleed'; content: string; alt?: string }> = [];
    
    // Split by image patterns
    const imageRegex = /(!?!\[([^\]]*)\]\(([^)]+)\))/g;
    let lastIndex = 0;
    let match;
    
    while ((match = imageRegex.exec(text)) !== null) {
      // Add text before this image
      if (match.index > lastIndex) {
        const textContent = text.slice(lastIndex, match.index).trim();
        if (textContent) {
          parts.push({ type: 'text', content: textContent });
        }
      }
      
      // Determine if full-bleed (starts with !!) or regular (starts with !)
      const isFullBleed = match[0].startsWith('!!');
      parts.push({
        type: isFullBleed ? 'fullbleed' : 'image',
        content: match[3], // URL
        alt: match[2] || 'Story image'
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      const textContent = text.slice(lastIndex).trim();
      if (textContent) {
        parts.push({ type: 'text', content: textContent });
      }
    }
    
    return parts;
  };

  const renderTextContent = (text: string) => {
    // Split into paragraphs
    const paragraphs = text.split(/\n\n+/);
    
    return paragraphs.map((para, index) => {
      const trimmed = para.trim();
      if (!trimmed) return null;
      
      // Check for pull quotes (lines starting with >)
      if (trimmed.startsWith('>')) {
        const quoteText = trimmed.replace(/^>\s*/, '');
        return (
          <blockquote 
            key={index}
            className="my-12 py-8 border-t border-b border-white/20"
          >
            <p className="font-serif text-2xl md:text-3xl text-white/90 italic leading-relaxed">
              {quoteText}
            </p>
          </blockquote>
        );
      }
      
      // Check for subheadings (lines starting with ##)
      if (trimmed.startsWith('## ')) {
        const headingText = trimmed.replace(/^## /, '');
        return (
          <h2 
            key={index}
            className="text-xs tracking-[0.2em] uppercase text-white/50 mt-16 mb-6"
          >
            {headingText}
          </h2>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="text-lg text-white/80 leading-relaxed mb-6">
          {trimmed}
        </p>
      );
    });
  };

  const parts = parseContent(content);

  return (
    <div className="story-body">
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return (
            <div key={index} className="max-w-3xl mx-auto px-6 lg:px-0">
              {renderTextContent(part.content)}
            </div>
          );
        }
        
        if (part.type === 'fullbleed') {
          return (
            <figure key={index} className="my-16 -mx-6 lg:-mx-16 xl:-mx-32">
              <div className="relative aspect-[21/9] w-full">
                <Image
                  src={part.content}
                  alt={part.alt || 'Story image'}
                  fill
                  className="object-cover"
                />
              </div>
              {part.alt && part.alt !== 'Story image' && (
                <figcaption className="text-center text-sm text-white/50 mt-4 px-6">
                  {part.alt}
                </figcaption>
              )}
            </figure>
          );
        }
        
        if (part.type === 'image') {
          return (
            <figure key={index} className="my-12 max-w-3xl mx-auto px-6 lg:px-0">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={part.content}
                  alt={part.alt || 'Story image'}
                  fill
                  className="object-cover"
                />
              </div>
              {part.alt && part.alt !== 'Story image' && (
                <figcaption className="text-center text-sm text-white/50 mt-4">
                  {part.alt}
                </figcaption>
              )}
            </figure>
          );
        }
        
        return null;
      })}
    </div>
  );
}
