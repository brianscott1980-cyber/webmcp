import React, { useState, useEffect } from 'react';

const AnnotationPrompt = ({ annotationPrompt, onSave, onCancel, currentUser }) => {
  const [draftText, setDraftText] = useState('');
    
  // Set initial text when component mounts or when annotationPrompt changes
  useEffect(() => {
    setDraftText(annotationPrompt.text);
  }, [annotationPrompt.text]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl border-2 border-blue-500/50 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-white mb-4">
          {annotationPrompt.editingId ? 'Edit Annotation' : 'Add Annotation'}
        </h3>
        <textarea
          className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your annotation here..."
          rows="3"
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
        />
        <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                window.trackGAEvent && window.trackGAEvent('annotation_cancel', {
                  component: 'AnnotationPrompt'
                });
                onCancel();
              }}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (draftText.trim()) {
                  window.trackGAEvent && window.trackGAEvent('annotation_save', {
                    component: 'AnnotationPrompt',
                    text: draftText.trim()
                  });
                  onSave(draftText.trim());
                }
              }}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              {annotationPrompt.editingId ? 'Update' : 'Add'} Annotation
        </div>
      </div>
    </div>
  );
};

export default AnnotationPrompt;