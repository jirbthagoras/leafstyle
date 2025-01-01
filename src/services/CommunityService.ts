// CommunityService.ts
import { db } from '@/lib/firebase/config'; // Assume you've initialized Firebase
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    query,
    where,
    setDoc,
    serverTimestamp,
} from 'firebase/firestore';

export interface Article {
    id?: string;
    userId: string;
    content: string;
    createdAt?: string;
}

export interface Reply {
    id?: string;
    articleId: string;
    userId: string;
    content: string;
    createdAt?: string;
}

const articlesCollection = collection(db, 'articles');
const repliesCollection = collection(db, 'replies');

export const CommunityService = {
    async postArticle(article: Omit<Article, 'id' | 'createdAt'>): Promise<string> {
        const newArticle = { ...article, createdAt: serverTimestamp() };
        const docRef = await addDoc(articlesCollection, newArticle);
        return docRef.id;
    },

    async replyToArticle(reply: Omit<Reply, 'id' | 'createdAt'>): Promise<string> {
        const newReply = { ...reply, createdAt: serverTimestamp() };
        const docRef = await addDoc(repliesCollection, newReply);
        return docRef.id;
    },

    async getArticleById(articleId: string): Promise<Article | null> {
        const docRef = doc(articlesCollection, articleId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Article;
        }
        return null;
    },

    async getRepliesByArticleId(articleId: string): Promise<Reply[]> {
        const q = query(repliesCollection, where('articleId', '==', articleId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reply));
    },

    async getAllArticles(): Promise<Article[]> {
        const querySnapshot = await getDocs(articlesCollection);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
    },
};

// Example of how to use these functions
// CommunityService.postArticle({ userId: 'user123', content: 'Hello world!' });
// CommunityService.replyToArticle({ articleId: 'article123', userId: 'user456', content: 'Nice post!' });
