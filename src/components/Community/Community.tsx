"use client";
import React, { useState } from "react";
import { PlaneIcon } from "lucide-react"; // Import ikon pesawat

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
  const [activePage, setActivePage] = useState("Home");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null); // Error untuk reply

  const handlePost = () => {
    if (!newPost.trim() && !selectedImage) {
      setError("Post content or image is required.");
      return;
    }
    if (!newPost.trim()) {
      setError("Post content is required.");
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

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed w-64 bg-green-600 text-white p-6 h-full lg:block hidden">
        <h2 className="text-4xl font-bold mb-8 mt-20">Community</h2>
        <nav className="space-y-4">
          {[
            { label: "🏠 Home", page: "Home" },
            { label: "💬 Discussions", page: "Discussions" },
            { label: "📄 Posts", page: "Posts" },
          ].map(({ label, page }) => (
            <a
              key={page}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActivePage(page);
              }}
              className={`block py-2 px-3 rounded ${
                activePage === page
                  ? "bg-green-500"
                  : "hover:bg-green-400 duration-500 ease-in-out"
              }`}
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-6 space-y-6 mt-20">
        {/* Create Post Section */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Create Post</h2>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Ceritakan Pengalamanmu"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-gray-200 focus:outline-none min-h-[100px]"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex items-center space-x-4">
            <button
              onClick={() => document.getElementById("imageInput")?.click()}
              className="px-4 py-2 bg-green-200 text-gray-800 rounded-lg hover:bg-green-300"
            >
              📷 Image
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
              className={`px-6 py-2 ${
                loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-700"
              } text-white rounded-lg shadow-md transform hover:scale-105 transition-transform duration-200 ml-auto`}
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
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Posts Section */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-lg rounded-lg p-6 space-y-4 transform hover:scale-[1.02] hover:shadow-2xl transition duration-200"
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
                    className="rounded-lg shadow-md max-h-96 w-96 object-cover"
                  />
                )}
              </div>
              <button className="text-green-500 hover:underline">
                💬 Reply
              </button>
              {post.replies.map((reply) => (
                <div
                  key={reply.id}
                  className="ml-8 mt-4 p-4 bg-gray-100 rounded-lg text-gray-800 shadow-sm"
                >
                  <p className="text-black font-semibold">{reply.author}</p>
                  <p className="text-sm text-gray-500">{reply.timestamp}</p>
                  <p className="mt-2 font-medium">{reply.content}</p>
                </div>
              ))}

              <div className="ml-8 mt-4 relative">
                <textarea
                  placeholder="Write your reply..."
                  className="w-full p-2 border rounded-lg pr-10" // Add padding right for icon space
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
            </div>
          ))}
        </div>
      </main>

      {/* Responsive Sidebar */}
      <aside className="lg:hidden fixed bottom-0 left-0 w-full bg-green-600 text-white flex justify-around py-4">
        {[
          { label: "🏠", page: "Home" },
          { label: "💬", page: "Discussions" },
          { label: "📄", page: "Posts" },
        ].map(({ label, page }) => (
          <a
            key={page}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActivePage(page);
            }}
            className={`text-center ${activePage === page ? "font-bold" : ""}`}
          >
            {label} <br /> {page}
          </a>
        ))}
      </aside>
    </div>
  );
};

export default CommunityPage;
