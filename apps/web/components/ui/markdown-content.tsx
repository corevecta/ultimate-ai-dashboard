'use client'

import React from 'react'

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  // Simple markdown to HTML conversion without external dependencies
  const renderMarkdown = (text: string) => {
    let html = text
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-white mb-2 mt-4">$1</h3>')
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mb-3 mt-6">$1</h2>')
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mb-4 mt-6">$1</h1>')
    
    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    
    // Lists
    html = html.replace(/^\* (.+)/gim, '<li class="ml-4 text-gray-300">• $1</li>')
    html = html.replace(/^- (.+)/gim, '<li class="ml-4 text-gray-300">• $1</li>')
    html = html.replace(/^\d+\. (.+)/gim, '<li class="ml-4 text-gray-300">$1</li>')
    
    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="bg-gray-800/50 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto my-4"><code>${code.trim()}</code></pre>`
    })
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-800/50 px-1 py-0.5 rounded text-sm text-gray-300">$1</code>')
    
    // Paragraphs
    html = html.split('\n\n').map(paragraph => {
      if (paragraph.trim() === '') return ''
      if (paragraph.includes('<h1') || paragraph.includes('<h2') || paragraph.includes('<h3') || 
          paragraph.includes('<pre') || paragraph.includes('<li')) {
        return paragraph
      }
      return `<p class="text-gray-300 mb-4">${paragraph}</p>`
    }).join('\n')
    
    // Wrap lists
    html = html.replace(/(<li.*<\/li>\n?)+/g, (match) => {
      return `<ul class="list-disc pl-6 mb-4 space-y-1">${match}</ul>`
    })
    
    return html
  }
  
  return (
    <div 
      className="prose prose-invert max-w-none p-6"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  )
}