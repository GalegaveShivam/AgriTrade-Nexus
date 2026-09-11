import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { CropLot, PurchaseOrder, MandiPriceItem } from '../types';
import { INITIAL_CROPS, INITIAL_ORDERS, INITIAL_MANDI_PRICES } from '../data/initialData';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with specific firestoreDatabaseId if provided
const databaseId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);

// Collection References
export const cropsCollection = collection(db, 'crops');
export const ordersCollection = collection(db, 'orders');
export const mandiPricesCollection = collection(db, 'mandiPrices');

/**
 * Seed initial data if Firestore collections are empty
 */
export async function seedInitialDataIfEmpty() {
  try {
    const cropsSnap = await getDocs(cropsCollection);
    if (cropsSnap.empty) {
      console.log('Seeding initial crop lots to Firestore...');
      for (const crop of INITIAL_CROPS) {
        await setDoc(doc(db, 'crops', crop.id), crop);
      }
    }

    const ordersSnap = await getDocs(ordersCollection);
    if (ordersSnap.empty) {
      console.log('Seeding initial purchase orders to Firestore...');
      for (const order of INITIAL_ORDERS) {
        await setDoc(doc(db, 'orders', order.id), order);
      }
    }

    const pricesSnap = await getDocs(mandiPricesCollection);
    if (pricesSnap.empty) {
      console.log('Seeding initial mandi prices to Firestore...');
      for (let i = 0; i < INITIAL_MANDI_PRICES.length; i++) {
        const item = INITIAL_MANDI_PRICES[i];
        await setDoc(doc(db, 'mandiPrices', `mandi-${i + 1}`), item);
      }
    }
  } catch (err) {
    console.warn('Could not seed initial Firestore data (using local fallback):', err);
  }
}

/**
 * Subscribe to real-time crop lots
 */
export function subscribeToCrops(onData: (crops: CropLot[]) => void) {
  try {
    return onSnapshot(
      cropsCollection,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: CropLot[] = [];
          snapshot.forEach((docSnap) => {
            items.push({ ...(docSnap.data() as CropLot), id: docSnap.id });
          });
          onData(items);
        } else {
          // If empty, trigger seed
          seedInitialDataIfEmpty();
        }
      },
      (error) => {
        console.warn('Firestore crops subscription error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to attach crops snapshot listener:', err);
    return () => {};
  }
}

/**
 * Subscribe to real-time purchase orders
 */
export function subscribeToOrders(onData: (orders: PurchaseOrder[]) => void) {
  try {
    return onSnapshot(
      ordersCollection,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: PurchaseOrder[] = [];
          snapshot.forEach((docSnap) => {
            items.push({ ...(docSnap.data() as PurchaseOrder), id: docSnap.id });
          });
          onData(items);
        }
      },
      (error) => {
        console.warn('Firestore orders subscription error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to attach orders snapshot listener:', err);
    return () => {};
  }
}

/**
 * Save new crop lot to Firestore
 */
export async function saveCropLotToFirestore(crop: CropLot): Promise<void> {
  const cropRef = doc(db, 'crops', crop.id);
  await setDoc(cropRef, crop);
}

/**
 * Update crop price in Firestore
 */
export async function updateCropPriceInFirestore(cropId: string, newPrice: number): Promise<void> {
  const cropRef = doc(db, 'crops', cropId);
  await updateDoc(cropRef, { pricePerQtl: newPrice });
}

/**
 * Delete or remove crop from Firestore
 */
export async function deleteCropFromFirestore(cropId: string): Promise<void> {
  const cropRef = doc(db, 'crops', cropId);
  await deleteDoc(cropRef);
}

/**
 * Save purchase order to Firestore
 */
export async function saveOrderToFirestore(order: PurchaseOrder): Promise<void> {
  const orderRef = doc(db, 'orders', order.id);
  await setDoc(orderRef, order);
}

/**
 * Update order status in Firestore (e.g., dispatch, delivered)
 */
export async function updateOrderStatusInFirestore(
  orderId: string,
  newStatus: PurchaseOrder['status']
): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, { status: newStatus });
}
