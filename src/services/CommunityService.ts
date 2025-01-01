import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";

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

    constructor() {
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
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
        await addDoc(collection(db, "posts"), {
            content,
            image,
            timestamp: new Date().toISOString(),
            author: this.currentUser.displayName || "Anonymous",
        });
    }

    async addReply(postId: string, replyContent: string): Promise<void> {
        if (!this.currentUser) throw new Error("User not logged in");
        const replyRef = collection(db, `posts/${postId}/replies`);
        await addDoc(replyRef, {
            content: replyContent,
            timestamp: new Date().toISOString(),
            author: this.currentUser.displayName || "Anonymous",
        });
    }
}

const communityService = new CommunityService();
export default communityService;
