'use client'    

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { uploadImage } from '@/services/UploadImgService';
import { analyzeImage } from '@/services/AnalyzeImgService';
import { Camera, X } from 'lucide-react';

interface RecyclingSuggestion {
  title: string;
  description: string;
  value: number;
  difficulty: number;
  materials: string[];
  timeRequired: string;
  environmentalBenefit: string;
  safetyTips: string;
}

interface AnalysisResult {
  items: string;
  suggestions: RecyclingSuggestion[];
}

const ImageUpload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    try {
      setLoading(true);
      setError('');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      const imageUrl = await uploadImage(file);
      console.log('Uploaded image URL:', imageUrl);

      const analysis = await analyzeImage(imageUrl);
      console.log('Analysis result:', analysis);

      if (!analysis) {
        throw new Error('Tidak ada hasil analisis yang diterima');
      }

      setResult(analysis);
      
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Image Upload */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-green-600">Analisis Sampah</h2>
          
          {!image ? (
            <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-300">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
              <Camera className="w-12 h-12 mb-4 text-green-600" />
              <span className="text-lg text-gray-600 font-medium">Ambil atau Upload Foto</span>
              <span className="text-sm text-gray-500 mt-2">Klik untuk memilih gambar</span>
            </label>
          ) : (
            <div className="relative">
              <div className="relative aspect-square w-full">
                <Image
                  src={image}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <button
                onClick={() => {
                  setImage(null);
                  setResult(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Analysis Results */}
        <div className="space-y-6">
          {loading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
              <span className="ml-3 text-green-600">Menganalisis gambar...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {result.suggestions?.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Saran Daur Ulang</h3>
                  <div className="space-y-4">
                    {result.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-lg group"
                      >
                        {/* Condensed View */}
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-lg">{suggestion.title}</h4>
                          <span className="text-sm text-gray-500">Hover untuk detail</span>
                        </div>
                        
                        {/* Expanded View - Visible on Hover */}
                        <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                          <p className="text-gray-600 mt-2 mb-2">{suggestion.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                            <div>
                              <span className="font-medium">Nilai:</span> Rp {suggestion.value.toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">Kesulitan:</span> {suggestion.difficulty}/100
                            </div>
                            <div>
                              <span className="font-medium">Waktu:</span> {suggestion.timeRequired}
                            </div>
                            <div>
                              <span className="font-medium">Bahan:</span> {suggestion.materials.join(", ")}
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">Manfaat Lingkungan:</span>
                              <p className="mt-1">{suggestion.environmentalBenefit}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">Tips Keamanan:</span>
                              <p className="mt-1">{suggestion.safetyTips}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload; 