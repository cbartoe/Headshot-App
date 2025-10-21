import { useState } from 'react';
import { Download, Sparkles, Loader2 } from 'lucide-react';

const ImageComparison = ({ originalImage, generatedImage, onDownload, onRevise, isRevising }) => {
  const [revisionPrompt, setRevisionPrompt] = useState('');

  if (!originalImage || !generatedImage) {
    return null;
  }

  const handleRevise = () => {
    if (revisionPrompt.trim()) {
      onRevise(revisionPrompt);
      setRevisionPrompt(''); // Clear the input after submitting
    }
  };

  const examplePrompts = [
    "Make the background darker",
    "Adjust lighting to be brighter",
    "Soften the shadows",
    "Make the expression more serious",
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Compare Your Results
        </h3>
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Download className="h-4 w-4" />
          Download AI Headshot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Image */}
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="font-medium text-gray-700">Original Photo</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={originalImage}
              alt="Original"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Generated Image */}
        <div className="space-y-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="font-medium text-blue-700">AI Generated Headshot</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={generatedImage}
              alt="AI Generated"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Revision Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-3">
          Refine Your Headshot
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Describe what you'd like to adjust in the generated headshot. The AI will make targeted edits while preserving your identity.
        </p>

        <div className="space-y-3">
          <textarea
            value={revisionPrompt}
            onChange={(e) => setRevisionPrompt(e.target.value)}
            placeholder="E.g., 'Make the background darker' or 'Adjust the lighting to be brighter'"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="3"
            disabled={isRevising}
          />

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs text-gray-500">Quick examples:</span>
            {examplePrompts.map((example, idx) => (
              <button
                key={idx}
                onClick={() => setRevisionPrompt(example)}
                disabled={isRevising}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>

          <button
            onClick={handleRevise}
            disabled={!revisionPrompt.trim() || isRevising}
            className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold
              hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {isRevising ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Revising...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Revise Headshot
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageComparison;
