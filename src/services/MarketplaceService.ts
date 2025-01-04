import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, deleteDoc, getDoc, FieldValue, deleteField } from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config";
import { Product, ProductFilter } from "@/types/marketplace";
import { uploadImage } from "./UploadImgService";

class MarketplaceService {
  async createProduct(productData: Omit<Product, 'id' | 'seller' | 'createdAt' | 'status'>, images: File[]): Promise<string> {
    try {
      if (!auth.currentUser) throw new Error("User not authenticated");

      // Upload images to Cloudinary
      const imageUrls = await Promise.all(
        images.map(image => 
          uploadImage(image, {
            uploadPreset: 'recycling_app_uploads',
            folder: 'marketplace'
          })
        )
      );

      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userData = userDoc.data();

      const product = {
        ...productData,
        images: imageUrls,
        seller: {
          id: auth.currentUser.uid,
          name: userData?.name || "Anonymous"
        },
        createdAt: new Date().toISOString(),
        status: 'available'
      };

      const docRef = await addDoc(collection(db, "products"), product);
      return docRef.id;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async getProducts(filters?: ProductFilter): Promise<Product[]> {
    try {
      let q = collection(db, "products");
      const conditions = [];

      if (filters) {
        if (filters.category) {
          conditions.push(where("category", "==", filters.category));
        }
        if (filters.condition) {
          conditions.push(where("condition", "==", filters.condition));
        }
        if (filters.minPrice) {
          conditions.push(where("price", ">=", filters.minPrice));
        }
        if (filters.maxPrice) {
          conditions.push(where("price", "<=", filters.maxPrice));
        }
      }

      conditions.push(orderBy("status", "asc"));
      conditions.push(orderBy("createdAt", "desc"));

      q = query(q, ...conditions);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async updateProductStatus(productId: string, status: 'available' | 'sold'): Promise<void> {
    try {
      if (!auth.currentUser) throw new Error("User not authenticated");

      const productRef = doc(db, "products", productId);
      const productDoc = await getDoc(productRef);

      if (!productDoc.exists()) throw new Error("Product not found");
      if (productDoc.data().seller.id !== auth.currentUser.uid) {
        throw new Error("Unauthorized to update this product");
      }

      await updateDoc(productRef, { status });
    } catch (error) {
      console.error("Error updating product status:", error);
      throw error;
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      if (!auth.currentUser) throw new Error("User not authenticated");

      const productRef = doc(db, "products", productId);
      const productDoc = await getDoc(productRef);

      if (!productDoc.exists()) throw new Error("Product not found");
      if (productDoc.data().seller.id !== auth.currentUser.uid) {
        throw new Error("Unauthorized to delete this product");
      }

      await deleteDoc(productRef);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  async getProductById(productId: string): Promise<Product> {
    try {
      const productRef = doc(db, "products", productId);
      const productDoc = await getDoc(productRef);

      if (!productDoc.exists()) {
        throw new Error("Product not found");
      }

      return {
        id: productDoc.id,
        ...productDoc.data()
      } as Product;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  async checkout(productId: string, customerDetails: {
    name: string;
    phone: string;
    email: string;
    address: string;
  }): Promise<void> {
    try {
      if (!auth.currentUser) throw new Error("User not authenticated");

      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, {
        status: 'pending',
        buyer: {
          id: auth.currentUser.uid,
          name: customerDetails.name,
          orderDate: new Date().toISOString()
        },
        orderStatus: 'pending',
        customerDetails // Store shipping details
      });
    } catch (error) {
      console.error("Error during checkout:", error);
      throw error;
    }
  }

  async handleOrder(productId: string, action: 'accept' | 'reject'): Promise<void> {
    try {
      if (!auth.currentUser) throw new Error("User not authenticated");

      const productRef = doc(db, "products", productId);
      const productDoc = await getDoc(productRef);
      const productData = productDoc.data();

      if (!productData) throw new Error("Product not found");
      if (productData.seller.id !== auth.currentUser.uid) {
        throw new Error("Unauthorized to handle this order");
      }

      if (action === 'accept') {
        await updateDoc(productRef, {
          status: 'sold',
          orderStatus: 'accepted',
          paymentStatus: 'paid'
        });
      } else {
        await updateDoc(productRef, {
          status: 'available',
          orderStatus: deleteField(),
          buyer: deleteField(),
          customerDetails: deleteField(),
          paymentStatus: deleteField()
        });
      }
    } catch (error) {
      console.error("Error handling order:", error);
      throw error;
    }
  }

  async getMyProducts(): Promise<Product[]> {
    try {
      if (!auth.currentUser) throw new Error("User not authenticated");

      const q = query(
        collection(db, "products"),
        where("seller.id", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error("Error fetching my products:", error);
      throw error;
    }
  }
}

const marketplaceService = new MarketplaceService();
export default marketplaceService; 