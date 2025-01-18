import { onAuthStateChanged, User } from "firebase/auth";
import { collection, addDoc, doc, getDoc, orderBy, query, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { analyzePost } from "./AnalyzePostService";
import PointService from "./PointService";
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
        return posts;
    }

    async createPost(content: string, image: string | null): Promise<void> {
        if (!this.currentUser) throw new Error("User not logged in");

        try {
            // Create the post

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
