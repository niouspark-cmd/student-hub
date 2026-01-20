import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string;
    title: string;
    price: number;
    imageUrl: string | null;
    vendorId: string;
    vendorName: string;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addToCart: (product: any, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (product: any, quantity = 1) => {
                set((state) => {
                    const existing = state.items.find((item) => item.id === product.id);
                    if (existing) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            ),
                        };
                    }
                    return {
                        items: [
                            ...state.items,
                            {
                                id: product.id,
                                title: product.title,
                                price: product.price,
                                imageUrl: product.imageUrl,
                                vendorId: product.vendor?.id || product.vendorId,
                                vendorName: product.vendor?.name || product.vendorName || 'Vendor',
                                quantity: quantity,
                            },
                        ],
                    };
                });
            },
            removeFromCart: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== productId),
                }));
            },
            updateQuantity: (productId, quantity) => {
                if (quantity < 1) {
                    get().removeFromCart(productId);
                    return;
                }
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === productId ? { ...item, quantity } : item
                    ),
                }));
            },
            clearCart: () => set({ items: [] }),
            getCartTotal: () => {
                return get().items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },
            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'omni-cart-storage', // name of the item in the storage (must be unique)
        }
    )
)
