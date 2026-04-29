import { computed, ref } from "vue";

type CartItemType = "food" | "drink" | "menu";

export type CartItem = {
  key: string;
  type: CartItemType;
  label: string;
  price: number;
  quantity: number;
  foodId: number;
  drinkId: number;
};

const CART_STORAGE_KEY = "ld_cart";
const MAX_ITEM_QUANTITY = 10;

const parseStoredCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [] as CartItem[];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [] as CartItem[];
    }

    return parsed.filter(
      (item) => item && typeof item === "object",
    ) as CartItem[];
  } catch {
    return [] as CartItem[];
  }
};

const items = ref<CartItem[]>(parseStoredCart());

const persist = () => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value));
};

const makeKey = (type: CartItemType, id: number) => `${type}-${id}`;

const addItem = (item: Omit<CartItem, "key" | "quantity"> & { id: number }) => {
  const key = makeKey(item.type, item.id);
  const existing = items.value.find((entry) => entry.key === key);

  if (existing) {
    existing.quantity = Math.min(MAX_ITEM_QUANTITY, existing.quantity + 1);
  } else {
    items.value.push({
      key,
      type: item.type,
      label: item.label,
      price: item.price,
      quantity: Math.min(MAX_ITEM_QUANTITY, 1),
      foodId: item.foodId,
      drinkId: item.drinkId,
    });
  }

  persist();
};

const removeItem = (key: string) => {
  items.value = items.value.filter((item) => item.key !== key);
  persist();
};

const setQuantity = (key: string, quantity: number) => {
  const target = items.value.find((item) => item.key === key);
  if (!target) {
    return;
  }

  target.quantity = Math.min(
    MAX_ITEM_QUANTITY,
    Math.max(1, Math.floor(quantity)),
  );
  persist();
};

const clear = () => {
  items.value = [];
  persist();
};

const itemCount = computed(() =>
  items.value.reduce((sum, item) => sum + Math.max(0, item.quantity), 0),
);

const totalPrice = computed(() =>
  items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
);

export const useCartStore = () => ({
  items,
  itemCount,
  totalPrice,
  addItem,
  removeItem,
  setQuantity,
  clear,
});
