"use client";
import React, { useState } from "react";
import { PlaneIcon } from "lucide-react"; // Import ikon pesawat
import { motion } from "framer-motion"; // Import motion dari framer-motion

interface Post {
  id: number;
  content: string;
  image: string | null;
  timestamp: string;
  author: string;
  replies: Reply[];
}

interface Reply {
  id: number;
  content: string;
  timestamp: string;
  author: string;
}

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyError, setReplyError] = useState<string | null>(null); // Error untuk reply

  const handlePost = () => {
    // Memastikan setidaknya ada teks atau gambar yang dimasukkan
    if (!newPost.trim() && !selectedImage) {
      setError("Post content or image is required.");
      return;
    }
    setError(null);
    setLoading(true);

    const post: Post = {
      id: Date.now(),
      content: newPost,
      image: selectedImage,
      timestamp: new Date().toLocaleString(),
      author: "User",
      replies: [],
    };

    setTimeout(() => {
      setPosts([post, ...posts]);
      setNewPost("");
      setSelectedImage(null);
      setLoading(false);
    }, 1000);
  };

  const handleReply = (postId: number, replyContent: string) => {
    if (!replyContent.trim()) {
      setReplyError("Reply cannot be empty!");
      return;
    }
    setReplyError(null); // Reset error jika ada teks
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              replies: [
                ...post.replies,
                {
                  id: Date.now(),
                  content: replyContent,
                  timestamp: new Date().toLocaleString(),
                  author: "User",
                },
              ],
            }
          : post
      )
    );
  };

  const handleReadMore = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              showAllReplies: !post.showAllReplies, // Toggle untuk menampilkan atau menyembunyikan replies
            }
          : post
      )
    );
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }} // Durasi animasi
    >
      {/* Header */}
      <motion.header
        className=" bg-gradient-to-r from-green-400 via-green-500 bg-green-600 text-white p-4 shadow-md mt-16"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex justify-center">
          <h1 className="text-4xl font-bold">Community Leaf</h1>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        className="flex-1 p-6 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        {/* Create Post Section */}
        <motion.section
          className="bg-green-50 rounded-lg shadow-lg p-6 space-y-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl text-center font-bold text-gray-800">Create Post</h2>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Ceritakan Pengalamanmu"
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
                  setSelectedImage(URL.createObjectURL(file));
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
                src={selectedImage}
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
        </motion.section>

        {/* Posts Section */}
        <motion.section
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {posts.map((post) => (
            <motion.div
              key={post.id}
              className="bg-white shadow-lg rounded-lg p-6 space-y-4 hover:scale-105 transition-transform duration-200"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
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
              <button className="text-green-500 hover:underline">
                💬 Reply
              </button>

              {/* Display replies */}
              {post.replies.slice(0, post.showAllReplies ? post.replies.length : 3).map((reply) => (
                <div
                  key={reply.id}
                  className="ml-8 mt-4 p-4 bg-gray-100 rounded-lg text-gray-800 shadow-sm"
                >
                  <p className="text-black font-semibold">{reply.author}</p>
                  <p className="text-sm text-gray-500">{reply.timestamp}</p>
                  <p className="mt-2 font-medium">{reply.content}</p>
                </div>
              ))}
              
              {/* Read More button */}
              {post.replies.length > 3 && !post.showAllReplies && (
                <button
                  onClick={() => handleReadMore(post.id)}
                  className="mt-2 text-blue-500 hover:underline"
                >
                  Read More
                </button>
              )}
              {post.showAllReplies && post.replies.length > 3 && (
                <button
                  onClick={() => handleReadMore(post.id)}
                  className="mt-2 text-blue-500 hover:underline"
                >
                  Show Less
                </button>
              )}

              <div className="ml-8 mt-4 relative">
                <textarea
                  placeholder="Write your reply..."
                  className="w-full p-2 border rounded-lg pr-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      const replyContent = e.currentTarget.value;
                      handleReply(post.id, replyContent);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                {replyError && (
                  <p className="text-red-500 text-sm">{replyError}</p>
                )}
                <button
                  onClick={() => {
                    const replyContent =
                      document.querySelector(`textarea`)?.value;
                    if (replyContent) {
                      handleReply(post.id, replyContent);
                    }
                  }}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600"
                >
                  <PlaneIcon className="h-6 w-6 text-green-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.section>
      </motion.main>
    </motion.div>
  );
};

export default CommunityPage;
