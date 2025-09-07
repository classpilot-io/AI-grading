'use client'; // Required for App Router

import React, { useEffect, useRef } from 'react';
import katex from 'katex';

export default function KaTeXComponent({ mathText }: any) {
  const mathRef = useRef<any>(null);

  useEffect(() => {
    if (mathRef.current) {
      if (!mathText) {
        mathRef.current.innerHTML = '';
        return;
      }
      
      // Split the text by inline and display math delimiters
      const parts = mathText.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/);
      
      const renderedParts = parts.map((part: any, index: any) => {
        // Check if the part is a math expression
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const expression = part.slice(2, -2).trim();
          try {
            return katex.renderToString(expression, {
              throwOnError: false,
              displayMode: true,
            });
          } catch (error) {
            return `<span style="color:red;">Error: Invalid math expression</span>`;
          }
        } else if (part.startsWith('$') && part.endsWith('$')) {
          const expression = part.slice(1, -1).trim();
          try {
            return katex.renderToString(expression, {
              throwOnError: false,
              displayMode: false,
            });
          } catch (error) {
            return `<span style="color:red;">Error: Invalid math expression</span>`;
          }
        } else {
          // This is the key change: Replace newlines with <br /> tags
          return part.replace(/\n/g, '<br />');
        }
      }).join('');

      mathRef.current.innerHTML = renderedParts;
    }
  }, [mathText]);

  return <div ref={mathRef}></div>;
}