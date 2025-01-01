"use client";

import React, { useEffect, useState } from "react";
import { PlaneIcon } from "lucide-react"; // Import ikon pesawat
import { motion } from "framer-motion";
import communityService, { Post } from "@/services/CommunityService";

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await communityService.fetchPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      }
    };
    loadPosts();
  }, []);

  const handlePost = async () => {
    if (!newPost.trim() && !selectedImage) {
      setError("Post content or image is required.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      let imageUrl = null;

      if (selectedImage) {
        imageUrl = await communityService.uploadImage(selectedImage);
      }

      await communityService.createPost(newPost, imageUrl);
      setNewPost("");
      setSelectedImage(null);

      const updatedPosts = await communityService.fetchPosts();
      setPosts(updatedPosts);
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (postId: string) => {
    const content = replyContent[postId]?.trim();

    if (!content) {
      setReplyError("Reply cannot be empty!");
      return;
    }

    setReplyError(null);

    try {
      await communityService.addReply(postId, content);
      setReplyContent((prev) => ({ ...prev, [postId]: "" }));

      const updatedPosts = await communityService.fetchPosts();
      setPosts(updatedPosts);
    } catch (err) {
      console.error("Error adding reply:", err);
      setReplyError("Failed to add reply. Please try again.");
    }
  };

  return (
      <motion.div
          className="min-h-screen bg-gray-50 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
      >
        {/* Header */}
        <motion.header
            className="bg-gradient-to-r from-green-400 via-green-500 bg-green-600 text-white p-4 shadow-md mt-16"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto flex justify-center">
            <h1 className="text-4xl font-bold">Community Leaf</h1>
          </div>
        </motion.header>

        {/* Main Content */}
        <motion.main className="flex-1 p-6 space-y-6">
          {/* Create Post Section */}
          <section className="bg-green-50 rounded-lg shadow-lg p-6 space-y-4">
            <h2 className="text-4xl text-center font-bold text-gray-800">Create Post</h2>
            <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your experience"
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 min-h-[100px]"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex items-center space-x-4">
              <button
                  onClick={() => document.getElementById("imageInput")?.click()}
                  className="px-4 py-2 bg-green-200 text-gray-800 rounded-lg hover:bg-green-300"
              >
                📷 Add Image
              </button>
              <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedImage(file);
                    }
                  }}
              />
              <button
                  onClick={handlePost}
                  disabled={loading}
                  className={`px-6 py-2 text-white rounded-lg shadow-md ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-700"}`}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
            {selectedImage && (
                <div className="relative">
                  <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Selected"
                      className="max-h-60 rounded-lg shadow-md"
                  />
                  <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md"
                  >
                    ×
                  </button>
                </div>
            )}
          </section>

          {/* Posts Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="bg-white shadow-lg rounded-lg p-6 space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-green-500 text-white flex items-center justify-center rounded-full">
                        {post.author[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">{post.author}</p>
                        <p className="text-sm text-gray-500">{post.timestamp}</p>
                      </div>
                    </div>
                    <p className="text-gray-800">{post.content}</p>
                    {post.image && (
                        <img
                            src={post.image}
                            alt="Post"
                            className="rounded-lg shadow-md max-h-96 w-full object-cover"
                        />
                    )}
                  </div>

                  {/* Replies */}
                  <div>
                    {post.replies.map((reply) => (
                        <div key={reply.id} className="ml-8 mt-4 bg-gray-100 p-4 rounded-lg">
                          <p className="text-black font-semibold">{reply.author}</p>
                          <p className="text-sm text-gray-500">{reply.timestamp}</p>
                          <p>{reply.content}</p>
                        </div>
                    ))}
                    <div className="mt-4 relative">
                  <textarea
                      value={replyContent[post.id] || ""}
                      onChange={(e) =>
                          setReplyContent((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      placeholder="Write your reply..."
                      className="w-full p-2 border rounded-lg"
                  />
                      <button
                          onClick={() => handleReply(post.id)}
                          className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600"
                      >
                        <PlaneIcon className="h-6 w-6 text-green-500" />
                      </button>
                    </div>
                    {replyError && <p className="text-red-500 text-sm">{replyError}</p>}
                  </div>
                </div>
            ))}
          </section>
        </motion.main>
      </motion.div>
  );
};

export default CommunityPage;
