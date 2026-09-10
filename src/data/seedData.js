import { daysAgo } from "../utils/helpers";

export const CATEGORIES = ["Groceries", "Beverages", "Snacks", "Household", "Personal Care"];

export const initialProducts = [
  { id: "p1", name: "Medjool Dates 500g", sku: "GRO-1001", barcode: "8901001", category: "Groceries", price: 8.5, cost: 5.2, stock: 40, lowStockThreshold: 10, unit: "pack", inventoryType: "STOCK_TRACKED", status: "Active", description: "Soft, premium Medjool dates." },
  { id: "p2", name: "Basmati Rice 5kg", sku: "GRO-1002", barcode: "8901002", category: "Groceries", price: 12.0, cost: 8.0, stock: 25, lowStockThreshold: 8, unit: "bag", inventoryType: "STOCK_TRACKED", status: "Active", description: "Long-grain aged basmati rice." },
  { id: "p3", name: "Extra Virgin Olive Oil 1L", sku: "GRO-1003", barcode: "8901003", category: "Groceries", price: 14.5, cost: 9.6, stock: 18, lowStockThreshold: 6, unit: "bottle", inventoryType: "STOCK_TRACKED", status: "Active", description: "Cold-pressed olive oil." },
  { id: "p4", name: "Fresh Cardamom Tea", sku: "BEV-2001", barcode: "8902001", category: "Beverages", price: 3.5, cost: 1.2, stock: 0, lowStockThreshold: 0, unit: "cup", inventoryType: "NON_STOCK", status: "Active", description: "Freshly brewed hot cardamom tea." },
  { id: "p5", name: "Chicken Kottu Roti", sku: "SNK-3002", barcode: "8903002", category: "Snacks", price: 8.0, cost: 4.5, stock: 0, lowStockThreshold: 0, unit: "plate", inventoryType: "NON_STOCK", status: "Active", description: "Freshly prepared chicken kottu roti." },
  { id: "p6", name: "Honey 500g", sku: "GRO-1005", barcode: "8901005", category: "Groceries", price: 11.0, cost: 7.0, stock: 15, lowStockThreshold: 5, unit: "jar", inventoryType: "STOCK_TRACKED", status: "Active", description: "Raw wildflower honey." },
  { id: "p7", name: "Mint Tea, 100 bags", sku: "BEV-2002", barcode: "8902002", category: "Beverages", price: 6.5, cost: 3.8, stock: 5, lowStockThreshold: 10, unit: "box", inventoryType: "STOCK_TRACKED", status: "Active", description: "Moroccan-style mint tea." },
  { id: "p8", name: "Dates Chocolate Box", sku: "SNK-3001", barcode: "8903001", category: "Snacks", price: 7.0, cost: 4.1, stock: 0, lowStockThreshold: 10, unit: "box", inventoryType: "STOCK_TRACKED", status: "Active", description: "Chocolate-coated dates, 12pc." },
  { id: "p9", name: "Prayer Mat", sku: "HOU-4001", barcode: "8904001", category: "Household", price: 16.0, cost: 9.5, stock: 12, lowStockThreshold: 4, unit: "piece", inventoryType: "STOCK_TRACKED", status: "Active", description: "Padded travel prayer mat." },
  { id: "p10", name: "Miswak Pack (5pc)", sku: "PER-5001", barcode: "8905001", category: "Personal Care", price: 3.0, cost: 1.4, stock: 50, lowStockThreshold: 15, unit: "pack", inventoryType: "STOCK_TRACKED", status: "Active", description: "Natural miswak sticks." },
  { id: "p11", name: "Attar Perfume Oil 12ml", sku: "PER-5002", barcode: "8905002", category: "Personal Care", price: 18.0, cost: 10.2, stock: 9, lowStockThreshold: 5, unit: "bottle", inventoryType: "STOCK_TRACKED", status: "Active", description: "Alcohol-free oud attar." },
  { id: "p12", name: "Chickpeas 1kg", sku: "GRO-1006", barcode: "8901006", category: "Groceries", price: 3.5, cost: 2.0, stock: 35, lowStockThreshold: 10, unit: "bag", inventoryType: "STOCK_TRACKED", status: "Inactive", description: "Dried chickpeas." },
];

export const initialUsers = [
  { id: "u1", name: "Admin User", username: "admin@barakah.pos", role: "ADMIN", status: "Active", createdAt: daysAgo(120) },
  { id: "u2", name: "John Mensah", username: "john@barakah.pos", role: "CASHIER", status: "Active", createdAt: daysAgo(60) },
  { id: "u3", name: "Sara Yusuf", username: "sara@barakah.pos", role: "CASHIER", status: "Active", createdAt: daysAgo(30) },
];

const seedItem = (p, qty) => ({ productId: p.id, name: p.name, price: p.price, qty, lineTotal: +(p.price * qty).toFixed(2) });
const pById = (id) => initialProducts.find((p) => p.id === id);

const rawSeedTxns = [
  { id: "t1", day: 6, h: 9, m: 12, cashier: "u2", items: [seedItem(pById("p1"), 2), seedItem(pById("p4"), 1)] },
  { id: "t2", day: 6, h: 11, m: 40, cashier: "u3", items: [seedItem(pById("p2"), 1)] },
  { id: "t3", day: 5, h: 10, m: 5, cashier: "u2", items: [seedItem(pById("p6"), 1), seedItem(pById("p5"), 2)] },
  { id: "t4", day: 5, h: 15, m: 20, cashier: "u3", items: [seedItem(pById("p9"), 1)] },
  { id: "t5", day: 4, h: 9, m: 50, cashier: "u2", items: [seedItem(pById("p3"), 1), seedItem(pById("p10"), 3)] },
  { id: "t6", day: 3, h: 13, m: 15, cashier: "u3", items: [seedItem(pById("p4"), 2)] },
  { id: "t7", day: 3, h: 17, m: 5, cashier: "u2", items: [seedItem(pById("p11"), 1)] },
  { id: "t8", day: 2, h: 9, m: 30, cashier: "u2", items: [seedItem(pById("p1"), 3), seedItem(pById("p6"), 1)] },
  { id: "t9", day: 2, h: 14, m: 0, cashier: "u3", items: [seedItem(pById("p2"), 2)] },
  { id: "t10", day: 1, h: 10, m: 45, cashier: "u3", items: [seedItem(pById("p5"), 1), seedItem(pById("p4"), 1)] },
  { id: "t11", day: 1, h: 16, m: 10, cashier: "u2", items: [seedItem(pById("p1"), 1)] },
  { id: "t12", day: 0, h: 9, m: 25, cashier: "u2", items: [seedItem(pById("p1"), 4), seedItem(pById("p3"), 1), seedItem(pById("p10"), 2)] },
];

export const seedTransactions = rawSeedTxns.map((t, i) => {
  const subtotal = +t.items.reduce((s, it) => s + it.lineTotal, 0).toFixed(2);
  const cashier = initialUsers.find((u) => u.id === t.cashier);
  return {
    id: t.id,
    invoiceNumber: `INV-2026-${String(100 + i).padStart(6, "0")}`,
    cashierId: t.cashier,
    cashierName: cashier.name,
    items: t.items,
    subtotal,
    total: subtotal,
    paymentMethod: "Cash",
    cashReceived: Math.ceil(subtotal / 5) * 5,
    change: +(Math.ceil(subtotal / 5) * 5 - subtotal).toFixed(2),
    notes: "",
    status: "Completed",
    createdAt: daysAgo(t.day, t.h, t.m),
  };
});

export const EXPENSE_CATEGORIES = [
  "Delivery",
  "Transport",
  "Cleaning",
  "Packaging",
  "Maintenance",
  "Supplies",
  "Other",
];

export const seedGrns = [
  {
    id: "g1",
    grnNumber: "GRN-2026-000001",
    supplier: "Al-Barakah Global Trading",
    supplierRef: "INV-SUP-8841",
    createdBy: "Admin User",
    notes: "Received bulk shipment of Medjool dates and basmati rice.",
    items: [
      { productId: "p1", name: "Medjool Dates 500g", receivedQty: 20, unitCost: 5.2, lineTotal: 104.0 },
      { productId: "p2", name: "Basmati Rice 5kg", receivedQty: 10, unitCost: 8.0, lineTotal: 80.0 },
    ],
    totalCost: 184.0,
    status: "Completed",
    createdAt: daysAgo(4),
  },
  {
    id: "g2",
    grnNumber: "GRN-2026-000002",
    supplier: "Desert Oasis Spices & Tea",
    supplierRef: "SUP-9902",
    createdBy: "Admin User",
    notes: "Restocked Arabic coffee and Moroccan mint tea.",
    items: [
      { productId: "p4", name: "Arabic Coffee 250g", receivedQty: 15, unitCost: 5.5, lineTotal: 82.5 },
      { productId: "p7", name: "Mint Tea, 100 bags", receivedQty: 10, unitCost: 3.8, lineTotal: 38.0 },
    ],
    totalCost: 120.5,
    status: "Completed",
    createdAt: daysAgo(1),
  },
];

export const seedExpenses = [
  {
    id: "e1",
    expenseNumber: "EXP-2026-000001",
    category: "Delivery",
    amount: 15.0,
    note: "Paid local courier for customer delivery",
    cashierId: "u2",
    cashierName: "John Mensah",
    createdAt: daysAgo(3, 11, 30),
  },
  {
    id: "e2",
    expenseNumber: "EXP-2026-000002",
    category: "Cleaning",
    amount: 25.0,
    note: "Purchased store cleaning materials & disinfectant",
    cashierId: "u3",
    cashierName: "Sara Yusuf",
    createdAt: daysAgo(1, 14, 15),
  },
];
