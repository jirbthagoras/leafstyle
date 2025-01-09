"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import marketplaceService from "@/services/MarketplaceService";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const AddProduct = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: "",
    material: "",
    bankAccount: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const price = parseFloat(formData.price);
      if (isNaN(price)) {
        throw new Error("Invalid price");
      }

      if (images.length === 0) {
        throw new Error("At least one image is required");
      }

      await marketplaceService.createProduct(
        {
          ...formData,
          price,
        },
        images
      );

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push("/marketplace");
      }, 2000);
    } catch (err) {
      setError("Failed to create product. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-20">
      {loading && (
        <motion.div
          className="h-1 bg-green-600"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2 }}
        />
      )}
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => router.push('/marketplace')}
          className="flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Marketplace
        </button>

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 right-4 bg-green-600 text-white py-2 px-4 rounded-md shadow-lg"
          >
            Product created successfully!
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl p-8 border border-green-100"
        >
          <h1 className="text-3xl font-bold text-green-600 mb-8 text-center">
            Add New Product
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              <div className="relative group">
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1 block w-full h-12 px-4 rounded-lg border-gray-300 shadow-sm 
                           focus:ring-2 focus:ring-green-500 focus:border-transparent
                           hover:border-green-300 transition-colors text-base"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                           focus:ring-2 focus:ring-green-500 focus:border-transparent
                           hover:border-green-300 transition-colors text-base"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    Price (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="mt-1 block w-full h-12 px-4 rounded-lg border-gray-300 shadow-sm 
                             focus:ring-2 focus:ring-green-500 focus:border-transparent
                             hover:border-green-300 transition-colors text-base"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bankAccount}
                    onChange={(e) =>
                      setFormData({ ...formData, bankAccount: e.target.value })
                    }
                    placeholder="Bank - Account Number"
                    className="mt-1 block w-full h-12 px-4 rounded-lg border-gray-300 shadow-sm 
                             focus:ring-2 focus:ring-green-500 focus:border-transparent
                             hover:border-green-300 transition-colors text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="mt-1 block w-full h-12 px-4 rounded-lg border-gray-300 shadow-sm 
                             focus:ring-2 focus:ring-green-500 focus:border-transparent
                             hover:border-green-300 transition-colors text-base"
                  >
                    <option value="">Select category</option>
                    <option value="Paper">Paper</option>
                    <option value="Plastic">Plastic</option>
                    <option value="Metal">Metal</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Glass">Glass</option>
                    <option value="Textile">Textile</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    Condition
                  </label>
                  <select
                    required
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData({ ...formData, condition: e.target.value })
                    }
                    className="mt-1 block w-full h-12 px-4 rounded-lg border-gray-300 shadow-sm 
                             focus:ring-2 focus:ring-green-500 focus:border-transparent
                             hover:border-green-300 transition-colors text-base"
                  >
                    <option value="">Select condition</option>
                    <option value="Recyclable">Recyclable</option>
                    <option value="Reusable">Reusable</option>
                    <option value="Needs Processing">Needs Processing</option>
                    <option value="For Parts">For Parts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    Material
                  </label>
                  <select
                    required
                    value={formData.material}
                    onChange={(e) =>
                      setFormData({ ...formData, material: e.target.value })
                    }
                    className="mt-1 block w-full h-12 px-4 rounded-lg border-gray-300 shadow-sm 
                             focus:ring-2 focus:ring-green-500 focus:border-transparent
                             hover:border-green-300 transition-colors text-base"
                  >
                    <option value="">Select material</option>
                    <option value="PET Plastic">PET Plastic</option>
                    <option value="HDPE Plastic">HDPE Plastic</option>
                    <option value="Cardboard">Cardboard</option>
                    <option value="Aluminum">Aluminum</option>
                    <option value="Steel">Steel</option>
                    <option value="Glass">Glass</option>
                    <option value="Mixed Paper">Mixed Paper</option>
                    <option value="Electronic Components">Electronic Components</option>
                    <option value="Fabric">Fabric</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="mt-1 block w-full h-12 px-4 rounded-lg border-gray-300 shadow-sm 
                             focus:ring-2 focus:ring-green-500 focus:border-transparent
                             hover:border-green-300 transition-colors text-base"
                  />
                </div>
              </div>

              <div className="col-span-2 mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Images
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-green-300 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                        multiple
                        required={images.length === 0}
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500"
                      >
                        <span>Upload files</span>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
                
                {previews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-48 object-cover rounded-md shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-lg text-white font-medium text-lg
                       transition-all duration-300 ease-out transform hover:scale-105 
                       ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700 shadow-lg"}`}
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProduct;
