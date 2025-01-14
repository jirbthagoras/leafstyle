import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { analyzePost } from "./AnalyzePostService";
import PointService from "./PointService";
import { toast } from "react-toastify";
import { toastError } from "@/utils/toastConfig";

export interface Post {
    id: string;
    content: string;
    image: string | null;
    timestamp: string;
    author: string;
    replies: Reply[];
}

export interface Reply {
    id: string;
    content: string;
    timestamp: string;
    author: string;
}

class CommunityService {
    currentUser: User | null = null;
    currentUserName: string = "Anonymous";

    constructor() {
        onAuthStateChanged(auth, async (user) => {
            this.currentUser = user;
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                this.currentUserName = userDoc.exists() ? userDoc.data().name : "Anonymous";
            }
        });
    }

    async fetchPosts(): Promise<Post[]> {
        const dummyPosts: Post[] = [
            {
              id: "1",
              content: "Just finished planting 10 trees in my neighborhood! 🌳 It's amazing how a small action can make such a big difference. Who else is joining the green revolution? #GreenCommunity #Sustainability",
              image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop",
              timestamp: new Date().toISOString(),
              author: "EcoWarrior",
              replies: [
                {
                  id: "r1",
                  content: "This is inspiring! I'll join the initiative this weekend.",
                  timestamp: new Date().toISOString(),
                  author: "GreenThumb"
                },
                {
                  id: "r2",
                  content: "Could you share some tips on tree planting?",
                  timestamp: new Date().toISOString(),
                  author: "NatureLover"
                }
              ]
            },
            {
              id: "2",
              content: "Started my first composting project today! 🌱 It's incredible how we can turn kitchen waste into nutrient-rich soil. Here's my setup - any tips from experienced composters? #Composting #ZeroWaste",
              image: "https://images.unsplash.com/photo-1591955506264-3f5a6834570a?q=80&w=1000&auto=format&fit=crop",
              timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              author: "CompostQueen",
              replies: [
                {
                  id: "r3",
                  content: "Make sure to maintain a good balance of green and brown materials!",
                  timestamp: new Date(Date.now() - 3600000).toISOString(),
                  author: "GardenGuru"
                }
              ]
            },
            {
              id: "3",
              content: "Check out my upcycled art project! 🎨 Used old plastic bottles to create this garden sculpture. Remember, one person's trash is another's treasure! #UpcyclingArt #Sustainability",
              image: "",
              timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
              author: "CreativeRecycler",
              replies: [
                {
                  id: "r4",
                  content: "This is absolutely beautiful! Would love to learn how you made it",
                  timestamp: new Date(Date.now() - 86400000).toISOString(),
                  author: "ArtLover"
                },
                {
                  id: "r5",
                  content: "Great way to reduce plastic waste! 👏",
                  timestamp: new Date(Date.now() - 43200000).toISOString(),
                  author: "EcoArtist"
                }
              ]
            }
          ];
        return dummyPosts;
        
        // Comment out or remove the dummy return when you want to use the actual Firebase implementation
        /*
        const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(postsQuery);
        const posts: Post[] = [];
        for (const docSnap of snapshot.docs) {
            const data = docSnap.data();
            const repliesSnapshot = await getDocs(collection(db, `posts/${docSnap.id}/replies`));
            const replies: Reply[] = repliesSnapshot.docs.map((replyDoc) => ({
                id: replyDoc.id,
                ...replyDoc.data(),
            })) as Reply[];
            posts.push({
                id: docSnap.id,
                content: data.content,
                image: data.image || null,
                timestamp: data.timestamp,
                author: data.author,
                replies,
            });
        }
        */
    }

    async createPost(content: string, image: string | null): Promise<void> {
        if (!this.currentUser) throw new Error("User not logged in");

        try {
            // Create the post
            const postRef = await addDoc(collection(db, "posts"), {
                content,
                image,
                timestamp: new Date().toISOString(),
                author: this.currentUserName,
                authorId: this.currentUser.uid
            });

            // Analyze post content
            const analysis = await analyzePost(content);

            // Use PointService to add points
            await PointService.addPoints(
                analysis.points,
                `Environmental post in category: ${analysis.category}. ${analysis.feedback}`,
                'POST_REWARD'
            );
        } catch (error) {
            console.error("Error creating post:", error);
            toastError("Failed to create post")
            throw error;
        }
    }

    async addReply(postId: string, replyContent: string): Promise<void> {
        if (!this.currentUser) throw new Error("User not logged in");

        const replyRef = collection(db, `posts/${postId}/replies`);
        await addDoc(replyRef, {
            content: replyContent,
            timestamp: new Date().toISOString(),
            author: this.currentUserName,
        });
    }
}

const communityService = new CommunityService();
export default communityService;
