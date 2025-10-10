import React from 'react';
import AnnotationPrompt from './AnnotationPrompt';
import SelectionPopup from './SelectionPopup';

const ArticlePanel = ({ 
  articleContent,
  annotationPrompt,
  selectionPopup,
  handleTextSelection,
  setAnnotationPrompt,
  currentUser,
  annotations,
  setAnnotations,
  showAlert,
  annotateText
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Article Content */}
      <div 
        onMouseUp={handleTextSelection}
        dangerouslySetInnerHTML={{ __html: articleContent }}
        className="prose prose-invert max-w-none relative"
        onMouseMove={e => {
          const annotationId = e.target.getAttribute('data-annotation-id');
          if (annotationId && annotations[annotationId]) {
            // Remove existing tooltip if any
            const target = e.target;
            const existingTooltip = document.getElementById('annotation-tooltip');
            if (existingTooltip) existingTooltip.remove();
            
            const tooltip = document.createElement('div');
            tooltip.className = 'fixed z-50 bg-gray-800/95 backdrop-blur-sm text-white p-4 rounded-xl shadow-2xl border-2 border-blue-500 text-sm max-w-xs animate-in fade-in duration-200';
            
            // Position tooltip relative to cursor
            const padding = 15; // Space between cursor and tooltip
            tooltip.style.left = `${e.clientX}px`;
            tooltip.style.top = `${e.clientY - padding}px`;
            tooltip.style.transform = 'translate(-50%, -100%)';
            
            // Create and style the content
            const content = document.createElement('div');
            content.className = 'flex flex-col gap-2';
            
            // Add a "Note" label
            const label = document.createElement('div');
            label.className = 'text-blue-400 text-xs font-medium uppercase tracking-wide';
            label.textContent = 'Note';
            content.appendChild(label);
            
            // Add the annotation text
            const text = document.createElement('div');
            text.className = 'text-white/90 font-medium leading-relaxed';
            text.textContent = annotations[annotationId].text;
            content.appendChild(text);
            
            // Add a decorative pointer that follows the cursor
            const pointer = document.createElement('div');
            pointer.className = 'absolute bottom-0 left-1/2 w-4 h-4 bg-gray-800/95 border-b-2 border-r-2 border-blue-500 transform rotate-45 translate-y-2 -translate-x-1/2 -z-10';
            
            tooltip.appendChild(content);
            tooltip.appendChild(pointer);
            tooltip.id = 'annotation-tooltip';
            target.parentNode.appendChild(tooltip);
          }
        }}
        onMouseOut={e => {
          const tooltip = document.getElementById('annotation-tooltip');
          if (tooltip) {
            tooltip.remove();
          }
        }}
      />
      {annotationPrompt.show && (
        <AnnotationPrompt 
          annotationPrompt={annotationPrompt}
          onSave={(text) => {
            if (annotationPrompt.editingId) {
              // Update existing annotation
              setAnnotations(prev => ({
                ...prev,
                [annotationPrompt.editingId]: {
                  text: text,
                  user: currentUser,
                  timestamp: new Date().toISOString()
                }
              }));
              showAlert('Annotation updated successfully', 'success');
            } else {
              // Add new annotation
              annotateText(annotationPrompt.selectedText, text);
              showAlert('Annotation added successfully', 'success');
            }
            setAnnotationPrompt({ show: false, text: '', range: null, editingId: null });
          }}
          onCancel={() => setAnnotationPrompt({ show: false, text: '', range: null, editingId: null })}
          currentUser={currentUser}
        />
      )}
      {selectionPopup.show && (
        <SelectionPopup 
          text={selectionPopup.text}
          x={selectionPopup.x}
          y={selectionPopup.y}
        />
      )}
    </div>
  );
};

export default ArticlePanel;
