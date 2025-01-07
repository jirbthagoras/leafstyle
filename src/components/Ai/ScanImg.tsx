'use client'

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { uploadImage } from '@/services/UploadImgService';
import { analyzeImage } from '@/services/AnalyzeImgService';
import { Camera, X, Upload, Clock, Leaf, Shield,} from 'lucide-react';
import { motion } from 'framer-motion';  // Import motion from framer-motion

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
  pointsAdded: boolean;
  error?: string;
}

const ImageUpload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [errorDetail, setErrorDetail] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Scroll ke hasil analisis setelah gambar diunggah
  useEffect(() => {
    if (result) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result]);

  const handleImageUpload = async (file: File) => {
    try {
      setLoading(true);
      setError('');
      setErrorDetail('');

      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      const imageUrl = await uploadImage(file, {
        uploadPreset: 'recycling_app_uploads',
        folder: 'ai_scans'
      });

      try {
        const analysis = await analyzeImage(imageUrl);
        if (!analysis) {
          throw new Error('Tidak ada hasil analisis yang diterima.');
        }
        
        setResult(analysis);
        
        // Show warning if points weren't added
        if (!analysis.pointsAdded) {
          setError('Batas Scan Harian Tercapai');
          setErrorDetail('Anda masih bisa melihat saran daur ulang, tetapi tidak mendapatkan poin tambahan hari ini.');
        }
      } catch (analysisError) {
        console.error('Analysis error:', analysisError);
        setError('Terjadi kesalahan dalam analisis gambar');
        setErrorDetail('Silakan coba lagi nanti.');
      }
    } catch (error) {
      console.error('Error in handleImageUpload:', error);

      if (error instanceof Error) {
        if (error.message.includes('format')) {
          setError('Format gambar tidak diterima');
          setErrorDetail('Coba unggah gambar dengan format JPG, PNG, atau JPEG.');
        } else if (error.message.includes('clear')) {
          setError('Gambar terlalu buram atau tidak jelas.');
          setErrorDetail('Coba unggah gambar yang lebih jelas atau lebih terang.');
        } else {
          setError('Terjadi kesalahan dalam proses unggah atau analisis gambar.');
          setErrorDetail('Pastikan gambar yang diunggah jelas dan dalam format yang didukung.');
        }
      } else {
        setError('Terjadi kesalahan yang tidak terduga.');
      }
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

  const handleClear = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-yellow-50 py-12">
      <div className="max-w-6xl mx-auto px-4 mt-20">
        <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.5 }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-700 mb-2">Analisis Sampah</h1>
          <p className="text-gray-600">Upload foto sampah Anda untuk mendapatkan saran daur ulang yang tepat</p>
        </div>
        </motion.div>


        <div className="grid grid-cols-1 gap-8">
          {/* Image Upload Section */}
          <motion.div
            className="p-6 border rounded-lg bg-white shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="flex items-center gap-2 text-lg font-semibold text-green-700 mb-4">
              <Upload className="w-5 h-5 text-green-600" /> Upload Gambar
            </h2>
            {!image ? (
              <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-green-200 rounded-lg cursor-pointer hover:bg-green-50 transition-all duration-300 hover:scale-105 transform">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Camera className="w-16 h-16 mb-4 text-green-600 animate-bounce" />
                <span className="text-lg text-gray-700 font-medium">Ambil atau Upload Foto</span>
                <span className="text-sm text-gray-500 mt-2">Klik untuk memilih gambar</span>
              </label>
            ) : (
              <div className="relative group">
                <div className="relative aspect-square w-full max-w-[80%] lg:max-w-[50%] mx-auto rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt="Preview"
                    fill
                    className="object-cover group-hover:scale-110 transition-all duration-500 ease-in-out transform"
                  />
                </div>
                <button
                  onClick={handleClear}
                  className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-300"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </motion.div>

          {/* Error Handling Section */}
          {error && (
            <motion.div
              className="p-6 border rounded-lg bg-red-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-red-700 text-center text-lg font-semibold">Terjadi Kesalahan</h3>
              <p className="text-red-700 text-center">{error}</p>
              {errorDetail && <p className="text-red-600 text-center text-sm mt-2">{errorDetail}</p>}
            </motion.div>
          )}

          {/* Analysis Results Section */}
          <motion.div
            className="space-y-6"
            ref={resultRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {loading && (
              <motion.div
                className="p-6 border rounded-lg bg-white shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="w-full max-w-xs space-y-4">
                    <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-600 animate-pulse" style={{ width: '30%' }}></div>
                    </div>
                    <p className="text-center text-green-600">Menganalisis gambar...</p>
                  </div>
                </div>
              </motion.div>
            )}

            {result && result.suggestions?.length > 0 && (
              <motion.div
                className="p-6 border rounded-lg bg-white shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold text-green-700 mb-4">Saran Daur Ulang</h2>
                <div className="space-y-4">
                  {result.suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      className="p-4 border rounded-lg bg-green-50 group hover:shadow-xl transition-all duration-300 hover:bg-green-50 hover:scale-105 transform"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-lg text-gray-800">{suggestion.title}</h4>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          Nilai: Rp {suggestion.value.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{suggestion.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{suggestion.timeRequired}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 bg-gray-200 rounded-full w-full overflow-hidden">
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${suggestion.difficulty}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{suggestion.difficulty}%</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3 pt-2">
                        <div className="flex items-start gap-2">
                          <Leaf className="w-5 h-5 text-green-500 mt-1 animate-spin" />
                          <div>
                            <p className="font-medium text-sm text-gray-700">Manfaat Lingkungan</p>
                            <p className="text-sm text-gray-600">{suggestion.environmentalBenefit}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Shield className="w-5 h-5 text-blue-500 mt-1" />
                          <div>
                            <p className="font-medium text-sm text-gray-700">Tips Keamanan</p>
                            <p className="text-sm text-gray-600">{suggestion.safetyTips}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {suggestion.materials.map((material, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-green-200 transition-colors"
                          >
                            {material}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
