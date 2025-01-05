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
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: "",
    material: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
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

      if (!image) {
        throw new Error("Image is required");
      }

      await marketplaceService.createProduct(
        {
          ...formData,
          price,
        },
        [image]
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
    <div className="min-h-screen bg-gray-50 pt-20">
      {loading && (
        <motion.div
          className="h-1 bg-green-600"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2 }}
        />
      )}
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={() => router.back()}
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
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h1 className="text-2xl font-bold text-green-600 mb-6">
            Add New Product
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <span className="absolute left-0 -top-6 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition">
                Enter a descriptive title for your product
              </span>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                rows={4}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price (Rp)
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
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

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Condition
              </label>
              <select
                required
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              >
                <option value="">Select condition</option>
                <option value="Recyclable">Recyclable</option>
                <option value="Reusable">Reusable</option>
                <option value="Needs Processing">Needs Processing</option>
                <option value="For Parts">For Parts</option>
              </select>
            </div>

            {/* Material */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Material
              </label>
              <select
                required
                value={formData.material}
                onChange={(e) =>
                  setFormData({ ...formData, material: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
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

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full"
                required
              />
              {preview && (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto rounded-md shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium hover:scale-105 duration-500 ease-out ${
                loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
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
