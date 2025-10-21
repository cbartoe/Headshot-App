import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import FileUpload from './components/FileUpload';
import StyleSelector from './components/StyleSelector';
import ImageComparison from './components/ImageComparison';
import { Sparkles, Loader2 } from 'lucide-react';
import { uploadImage, generateHeadshot, reviseHeadshot } from './services/api';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('corporate-classic');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRevising, setIsRevising] = useState(false);

  const handleFileSelect = (file) => {
    setUploadedFile(file);
    setGeneratedImage(null); // Reset generated image when new file is uploaded
    toast.success('Photo uploaded successfully!');
  };

  const handleStyleSelect = (styleId) => {
    setSelectedStyle(styleId);
    toast.success('Style selected!');
  };

  const handleGenerate = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a photo first');
      return;
    }

    try {
      setIsGenerating(true);
      toast.loading('Uploading image...', { id: 'generating' });

      // Upload image to backend
      const uploadResponse = await uploadImage(uploadedFile);
      console.log('Upload response:', uploadResponse);

      toast.loading('Generating your professional headshot...', { id: 'generating' });

      // Convert image to base64 for API
      const reader = new FileReader();
      reader.readAsDataURL(uploadedFile);
      reader.onloadend = async () => {
        const base64Image = reader.result;

        try {
          // Generate headshot using Google Gemini AI
          const generateResponse = await generateHeadshot(base64Image, selectedStyle);
          console.log('Generation response:', generateResponse);

          // Use the actual generated image from the API
          if (generateResponse.generatedImage) {
            setGeneratedImage(generateResponse.generatedImage);
            setIsGenerating(false);
            toast.success('Headshot generated successfully!', { id: 'generating' });
          } else {
            throw new Error('No generated image in response');
          }
        } catch (genError) {
          console.error('Generation error:', genError);
          setIsGenerating(false);
          toast.error(genError.response?.data?.error || genError.message || 'Failed to generate headshot', { id: 'generating' });
        }
      };
    } catch (error) {
      console.error('Error generating headshot:', error);
      setIsGenerating(false);
      toast.error(error.response?.data?.error || 'Failed to generate headshot', { id: 'generating' });
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `headshot-${selectedStyle}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded!');
  };

  const handleRevise = async (revisionPrompt) => {
    if (!generatedImage) {
      toast.error('No image to revise');
      return;
    }

    try {
      setIsRevising(true);
      toast.loading('Revising your headshot...', { id: 'revising' });

      // Send the generated image + revision prompt to the backend
      const reviseResponse = await reviseHeadshot(generatedImage, revisionPrompt, selectedStyle);
      console.log('Revision response:', reviseResponse);

      if (reviseResponse.generatedImage) {
        setGeneratedImage(reviseResponse.generatedImage);
        toast.success('Headshot revised successfully!', { id: 'revising' });
      } else {
        throw new Error('No revised image in response');
      }
    } catch (error) {
      console.error('Error revising headshot:', error);
      toast.error(error.response?.data?.error || 'Failed to revise headshot', { id: 'revising' });
    } finally {
      setIsRevising(false);
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setGeneratedImage(null);
    setSelectedStyle('corporate-classic');
    toast.success('Reset complete!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-blue-500" />
              <h1 className="text-3xl font-bold text-gray-900">
                AI Headshot Studio
              </h1>
            </div>
            {(uploadedFile || generatedImage) && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Start Over
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">

          {/* Upload Section */}
          <section>
            <FileUpload onFileSelect={handleFileSelect} uploadedFile={uploadedFile} />
          </section>

          {/* Style Selection - Always show when file is uploaded */}
          {uploadedFile && (
            <section className="animate-fadeIn">
              <StyleSelector
                selectedStyle={selectedStyle}
                onStyleSelect={handleStyleSelect}
              />
            </section>
          )}

          {/* Generate Button - Show initially */}
          {uploadedFile && !generatedImage && (
            <section className="flex justify-center animate-fadeIn">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold text-lg
                  hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center gap-3 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Headshot
                  </>
                )}
              </button>
            </section>
          )}

          {/* Regenerate Button - Show after generation, directly below style selector */}
          {generatedImage && uploadedFile && (
            <section className="flex justify-center animate-fadeIn">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Try Another Style
                  </h3>
                  <p className="text-sm text-gray-600">
                    Select a different style above and generate a new headshot with the same photo
                  </p>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold
                      hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center gap-3 shadow-md hover:shadow-lg mx-auto"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Generate New Headshot
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Comparison Section */}
          {generatedImage && uploadedFile && (
            <section className="animate-fadeIn">
              <ImageComparison
                originalImage={URL.createObjectURL(uploadedFile)}
                generatedImage={generatedImage}
                onDownload={handleDownload}
                onRevise={handleRevise}
                isRevising={isRevising}
              />
            </section>
          )}

        </div>

        {/* Info Footer */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>Upload your photo, choose a style, and get a professional AI headshot in seconds</p>
        </div>
      </main>
    </div>
  );
}

export default App;
