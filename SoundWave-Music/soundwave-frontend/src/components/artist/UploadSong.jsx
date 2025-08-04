import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Music, 
  FileAudio, 
  Image, 
  Tag, 
  Globe, 
  Calendar,
  Save,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const UploadSong = () => {
  const [uploadStep, setUploadStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    releaseDate: '',
    description: '',
    lyrics: '',
    isExplicit: false,
    isPublic: true,
    price: 0,
    tags: []
  });
  const [files, setFiles] = useState({
    audio: null,
    cover: null
  });
  const [errors, setErrors] = useState({});
  
  const audioRef = useRef(null);
  const coverRef = useRef(null);

  const genres = [
    'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Electronic', 'Jazz', 'Classical',
    'Country', 'Folk', 'Reggae', 'Blues', 'Metal', 'Punk', 'Indie'
  ];

  const handleFileSelect = (type, file) => {
    if (type === 'audio') {
      if (file && file.type.startsWith('audio/')) {
        setFiles(prev => ({ ...prev, audio: file }));
        setErrors(prev => ({ ...prev, audio: '' }));
      } else {
        setErrors(prev => ({ ...prev, audio: 'Please select a valid audio file' }));
      }
    } else if (type === 'cover') {
      if (file && file.type.startsWith('image/')) {
        setFiles(prev => ({ ...prev, cover: file }));
        setErrors(prev => ({ ...prev, cover: '' }));
      } else {
        setErrors(prev => ({ ...prev, cover: 'Please select a valid image file' }));
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.artist.trim()) {
      newErrors.artist = 'Artist name is required';
    }

    if (!formData.genre) {
      newErrors.genre = 'Genre is required';
    }

    if (!files.audio) {
      newErrors.audio = 'Audio file is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setUploadStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setUploadStep(prev => prev - 1);
  };

  const simulateUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    setIsUploading(false);
    setUploadStep(4); // Success step
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      await simulateUpload();
    }
  };

  const renderStep = () => {
    switch (uploadStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Upload Audio File</h3>
              <p className="text-gray-400 mb-6">Select the audio file you want to upload</p>
            </div>

            <div className="space-y-4">
              {/* Audio File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Audio File *
                </label>
                <div
                  onClick={() => audioRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                >
                  {files.audio ? (
                    <div className="space-y-2">
                      <FileAudio className="h-12 w-12 text-blue-500 mx-auto" />
                      <p className="text-white font-medium">{files.audio.name}</p>
                      <p className="text-gray-400 text-sm">
                        {(files.audio.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <p className="text-white font-medium">Click to select audio file</p>
                      <p className="text-gray-400 text-sm">
                        Supports MP3, WAV, FLAC (Max 50MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={audioRef}
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileSelect('audio', e.target.files[0])}
                  className="hidden"
                />
                {errors.audio && (
                  <p className="text-red-400 text-sm mt-1">{errors.audio}</p>
                )}
              </div>

              {/* Cover Art Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cover Art (Optional)
                </label>
                <div
                  onClick={() => coverRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
                >
                  {files.cover ? (
                    <div className="space-y-2">
                      <img
                        src={URL.createObjectURL(files.cover)}
                        alt="Cover preview"
                        className="w-20 h-20 mx-auto rounded object-cover"
                      />
                      <p className="text-white text-sm">{files.cover.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Image className="h-8 w-8 text-gray-400 mx-auto" />
                      <p className="text-white text-sm">Click to select cover art</p>
                      <p className="text-gray-400 text-xs">
                        Supports JPG, PNG (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={coverRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect('cover', e.target.files[0])}
                  className="hidden"
                />
                {errors.cover && (
                  <p className="text-red-400 text-sm mt-1">{errors.cover}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Song Information</h3>
              <p className="text-gray-400 mb-6">Provide details about your song</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Song Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter song title"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Artist Name *
                </label>
                <input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => handleInputChange('artist', e.target.value)}
                  placeholder="Enter artist name"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.artist && (
                  <p className="text-red-400 text-sm mt-1">{errors.artist}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Album (Optional)
                </label>
                <input
                  type="text"
                  value={formData.album}
                  onChange={(e) => handleInputChange('album', e.target.value)}
                  placeholder="Enter album name"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Genre *
                </label>
                <select
                  value={formData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select genre</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                {errors.genre && (
                  <p className="text-red-400 text-sm mt-1">{errors.genre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Release Date
                </label>
                <input
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => handleInputChange('releaseDate', e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (USD)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  placeholder="0.00"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Tell us about your song..."
                rows="3"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                placeholder="Press Enter to add tags"
                onKeyPress={handleTagInput}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="flex items-center space-x-1 bg-blue-600 text-white px-2 py-1 rounded text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isExplicit}
                  onChange={(e) => handleInputChange('isExplicit', e.target.checked)}
                  className="rounded bg-gray-800 border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-300">Contains explicit content</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                  className="rounded bg-gray-800 border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-300">Make this song public</span>
              </label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Review & Publish</h3>
              <p className="text-gray-400 mb-6">Review your song details before publishing</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-4">
                {files.cover ? (
                  <img
                    src={URL.createObjectURL(files.cover)}
                    alt="Cover preview"
                    className="w-20 h-20 rounded object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-700 rounded flex items-center justify-center">
                    <Music className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h4 className="text-white font-semibold text-lg">{formData.title}</h4>
                  <p className="text-gray-400">{formData.artist}</p>
                  {formData.album && (
                    <p className="text-gray-500 text-sm">{formData.album}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Genre:</span>
                  <span className="text-white ml-2">{formData.genre}</span>
                </div>
                <div>
                  <span className="text-gray-400">Release Date:</span>
                  <span className="text-white ml-2">{formData.releaseDate || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Price:</span>
                  <span className="text-white ml-2">${formData.price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Visibility:</span>
                  <span className="text-white ml-2">{formData.isPublic ? 'Public' : 'Private'}</span>
                </div>
              </div>

              {formData.description && (
                <div>
                  <span className="text-gray-400 text-sm">Description:</span>
                  <p className="text-white text-sm mt-1">{formData.description}</p>
                </div>
              )}

              {formData.tags.length > 0 && (
                <div>
                  <span className="text-gray-400 text-sm">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.tags.map(tag => (
                      <span key={tag} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Upload Successful!</h3>
              <p className="text-gray-400">
                Your song "{formData.title}" has been uploaded and is now available on SoundWave.
              </p>
            </div>
            
            <div className="space-y-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                View Song Page
              </button>
              <button 
                onClick={() => {
                  setUploadStep(1);
                  setFormData({
                    title: '',
                    artist: '',
                    album: '',
                    genre: '',
                    releaseDate: '',
                    description: '',
                    lyrics: '',
                    isExplicit: false,
                    isPublic: true,
                    price: 0,
                    tags: []
                  });
                  setFiles({ audio: null, cover: null });
                }}
                className="block mx-auto text-gray-400 hover:text-white transition-colors"
              >
                Upload Another Song
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Upload Song</h1>
        <p className="text-gray-300">Share your music with the world</p>
      </div>

      {/* Progress Steps */}
      {uploadStep < 4 && (
        <div className="flex items-center space-x-4 mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= uploadStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < uploadStep ? 'bg-blue-600' : 'bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-white">Uploading your song...</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">{uploadProgress}% complete</p>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-gray-800 rounded-lg p-6">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      {uploadStep < 4 && !isUploading && (
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={uploadStep === 1}
            className="px-6 py-3 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>

          <div className="flex items-center space-x-4">
            {uploadStep === 3 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Publish Song</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSong; 