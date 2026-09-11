import { supabase, isSupabaseConfigured } from "../lib/supabase";
import {
  initialProducts,
  initialUsers,
  seedTransactions,
  seedGrns,
  seedExpenses,
} from "../data/seedData";

export { isSupabaseConfigured };

/* ------------------------------------------------------------------
   PRODUCTS
------------------------------------------------------------------ */
export async function dbFetchProducts() {
  if (!isSupabaseConfigured()) return initialProducts;
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (error || !data || data.length === 0) return initialProducts;
    return data.map((p) => ({
      ...p,
      lowStockThreshold: p.low_stock_threshold ?? p.lowStockThreshold ?? 5,
      inventoryType: p.inventory_type ?? p.inventoryType ?? "STOCK_TRACKED",
    }));
  } catch (err) {
    console.error("Supabase fetchProducts error:", err);
    return initialProducts;
  }
}

export async function dbSaveProduct(product, isAdd) {
  if (!isSupabaseConfigured()) return product;
  try {
    const dbPayload = {
      id: product.id,
      name: product.name,
      sku: product.sku || "",
      barcode: product.barcode || "",
      category: product.category || "",
      price: Number(product.price) || 0,
      cost: Number(product.cost) || 0,
      stock: Number(product.stock) || 0,
      low_stock_threshold: Number(product.lowStockThreshold) || 5,
      unit: product.unit || "piece",
      inventory_type: product.inventoryType || "STOCK_TRACKED",
      status: product.status || "Active",
      description: product.description || "",
    };

    if (isAdd) {
      const { data, error } = await supabase.from("products").insert([dbPayload]).select();
      if (error) console.error("Error adding product to Supabase:", error);
      return data?.[0] || product;
    } else {
      const { data, error } = await supabase
        .from("products")
        .update(dbPayload)
        .eq("id", product.id)
        .select();
      if (error) console.error("Error updating product in Supabase:", error);
      return data?.[0] || product;
    }
  } catch (err) {
    console.error("Supabase dbSaveProduct error:", err);
    return product;
  }
}

export async function dbUpdateProductStock(productId, newStock) {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", productId);
    if (error) console.error("Error updating product stock in Supabase:", error);
  } catch (err) {
    console.error("Supabase dbUpdateProductStock error:", err);
  }
}

/* ------------------------------------------------------------------
   TRANSACTIONS
------------------------------------------------------------------ */
export async function dbFetchTransactions() {
  if (!isSupabaseConfigured()) return seedTransactions;
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return seedTransactions;
    return data.map((t) => ({
      id: t.id,
      invoiceNumber: t.invoice_number || t.invoiceNumber,
      cashierId: t.cashier_id || t.cashierId,
      cashierName: t.cashier_name || t.cashierName,
      items: t.items || [],
      subtotal: t.subtotal,
      total: t.total,
      paymentMethod: t.payment_method || t.paymentMethod || "Cash",
      cashReceived: t.cash_received || t.cashReceived,
      change: t.change,
      notes: t.notes || "",
      status: t.status || "Completed",
      createdAt: t.created_at ? new Date(t.created_at).getTime() : t.createdAt,
    }));
  } catch (err) {
    console.error("Supabase fetchTransactions error:", err);
    return seedTransactions;
  }
}

export async function dbCreateTransaction(txn) {
  if (!isSupabaseConfigured()) return txn;
  try {
    const dbPayload = {
      id: txn.id,
      invoice_number: txn.invoiceNumber,
      cashier_id: txn.cashierId,
      cashier_name: txn.cashierName,
      items: txn.items || [],
      subtotal: Number(txn.subtotal) || 0,
      total: Number(txn.total) || 0,
      payment_method: txn.paymentMethod || "Cash",
      cash_received: Number(txn.cashReceived) || 0,
      change: Number(txn.change) || 0,
      notes: txn.notes || "",
      status: txn.status || "Completed",
    };
    const { data, error } = await supabase
      .from("transactions")
      .insert([dbPayload])
      .select();
    if (error) console.error("Error creating transaction in Supabase:", error);
    return data?.[0] || txn;
  } catch (err) {
    console.error("Supabase dbCreateTransaction error:", err);
    return txn;
  }
}

/* ------------------------------------------------------------------
   EXPENSES
------------------------------------------------------------------ */
export async function dbFetchExpenses() {
  if (!isSupabaseConfigured()) return seedExpenses;
  try {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return seedExpenses;
    return data.map((e) => ({
      id: e.id,
      expenseNumber: e.expense_number || e.expenseNumber,
      category: e.category,
      amount: e.amount,
      note: e.note || "",
      cashierId: e.cashier_id || e.cashierId,
      cashierName: e.cashier_name || e.cashierName,
      createdAt: e.created_at ? new Date(e.created_at).getTime() : e.createdAt,
    }));
  } catch (err) {
    console.error("Supabase fetchExpenses error:", err);
    return seedExpenses;
  }
}

export async function dbCreateExpense(expense) {
  if (!isSupabaseConfigured()) return expense;
  try {
    const dbPayload = {
      id: expense.id,
      expense_number: expense.expenseNumber,
      category: expense.category,
      amount: Number(expense.amount) || 0,
      note: expense.note || "",
      cashier_id: expense.cashierId,
      cashier_name: expense.cashierName,
    };
    const { data, error } = await supabase
      .from("expenses")
      .insert([dbPayload])
      .select();
    if (error) console.error("Error creating expense in Supabase:", error);
    return data?.[0] || expense;
  } catch (err) {
    console.error("Supabase dbCreateExpense error:", err);
    return expense;
  }
}

/* ------------------------------------------------------------------
   GRNS (Goods Received Notes)
------------------------------------------------------------------ */
export async function dbFetchGrns() {
  if (!isSupabaseConfigured()) return seedGrns;
  try {
    const { data, error } = await supabase
      .from("grns")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return seedGrns;
    return data.map((g) => ({
      id: g.id,
      grnNumber: g.grn_number || g.grnNumber,
      supplier: g.supplier,
      supplierRef: g.supplier_ref || g.supplierRef,
      createdBy: g.created_by || g.createdBy,
      notes: g.notes || "",
      items: g.items || [],
      totalCost: g.total_cost ?? g.totalCost,
      status: g.status || "Completed",
      createdAt: g.created_at ? new Date(g.created_at).getTime() : g.createdAt,
    }));
  } catch (err) {
    console.error("Supabase fetchGrns error:", err);
    return seedGrns;
  }
}

export async function dbCreateGrn(grn) {
  if (!isSupabaseConfigured()) return grn;
  try {
    const dbPayload = {
      id: grn.id,
      grn_number: grn.grnNumber,
      supplier: grn.supplier,
      supplier_ref: grn.supplierRef || "",
      created_by: grn.createdBy || "",
      notes: grn.notes || "",
      items: grn.items || [],
      total_cost: Number(grn.totalCost) || 0,
      status: grn.status || "Completed",
    };
    const { data, error } = await supabase
      .from("grns")
      .insert([dbPayload])
      .select();
    if (error) console.error("Error creating GRN in Supabase:", error);
    return data?.[0] || grn;
  } catch (err) {
    console.error("Supabase dbCreateGrn error:", err);
    return grn;
  }
}

/* ------------------------------------------------------------------
   HELD BILLS
------------------------------------------------------------------ */
export async function dbFetchHeldBills() {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from("held_bills")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map((b) => ({
      id: b.id,
      holdReference: b.hold_reference || b.holdReference,
      cashierId: b.cashier_id || b.cashierId,
      cashierName: b.cashier_name || b.cashierName,
      items: b.items || [],
      subtotal: b.subtotal,
      total: b.total,
      notes: b.notes || "",
      status: b.status || "Held",
      createdAt: b.created_at ? new Date(b.created_at).getTime() : b.createdAt,
    }));
  } catch (err) {
    console.error("Supabase fetchHeldBills error:", err);
    return [];
  }
}

export async function dbSaveHeldBill(bill) {
  if (!isSupabaseConfigured()) return bill;
  try {
    const dbPayload = {
      id: bill.id,
      hold_reference: bill.holdReference,
      cashier_id: bill.cashierId,
      cashier_name: bill.cashierName,
      items: bill.items || [],
      subtotal: Number(bill.subtotal) || 0,
      total: Number(bill.total) || 0,
      notes: bill.notes || "",
      status: bill.status || "Held",
    };
    const { data, error } = await supabase
      .from("held_bills")
      .insert([dbPayload])
      .select();
    if (error) console.error("Error saving held bill to Supabase:", error);
    return data?.[0] || bill;
  } catch (err) {
    console.error("Supabase dbSaveHeldBill error:", err);
    return bill;
  }
}

export async function dbDeleteHeldBill(billId) {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.from("held_bills").delete().eq("id", billId);
    if (error) console.error("Error deleting held bill from Supabase:", error);
  } catch (err) {
    console.error("Supabase dbDeleteHeldBill error:", err);
  }
}

/* ------------------------------------------------------------------
   USERS & AUTHENTICATION
------------------------------------------------------------------ */
export async function dbFetchUsers() {
  if (!isSupabaseConfigured()) return initialUsers;
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error || !data || data.length === 0) return initialUsers;
    return data;
  } catch (err) {
    console.error("Supabase fetchUsers error:", err);
    return initialUsers;
  }
}

export async function dbAuthenticateUser(username, password) {
  const uName = username.trim().toLowerCase();
  const pWord = password.trim();

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .ilike("username", uName)
        .eq("password", pWord)
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn("Supabase dbAuthenticateUser exception:", err);
    }
  }

  // Fallback check against initialUsers demo accounts
  const localMatch = initialUsers.find(
    (u) =>
      u.username.toLowerCase() === uName ||
      u.name.toLowerCase() === uName
  );
  if (localMatch) {
    if (!localMatch.password || localMatch.password === pWord) {
      return localMatch;
    }
  }

  return null;
}

export async function dbSaveUser(user, isAdd) {
  if (!isSupabaseConfigured()) return user;
  try {
    const dbPayload = {
      id: user.id,
      name: user.name,
      username: user.username,
      password: user.password || "123456",
      role: user.role || "CASHIER",
      status: user.status || "Active",
    };

    if (isAdd) {
      const { data, error } = await supabase.from("users").insert([dbPayload]).select();
      if (error) console.error("Error adding user to Supabase:", error);
      return data?.[0] || user;
    } else {
      const { data, error } = await supabase
        .from("users")
        .update(dbPayload)
        .eq("id", user.id)
        .select();
      if (error) console.error("Error updating user in Supabase:", error);
      return data?.[0] || user;
    }
  } catch (err) {
    console.error("Supabase dbSaveUser error:", err);
    return user;
  }
}

/* ------------------------------------------------------------------
   STOCK MOVEMENTS (Audit Trail)
------------------------------------------------------------------ */
export async function dbFetchStockMovements() {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from("stock_movements")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map((m) => ({
      id: m.id,
      productId: m.product_id || m.productId,
      productName: m.product_name || m.productName,
      movementType: m.movement_type || m.movementType,
      oldStock: m.old_stock ?? m.oldStock,
      newStock: m.new_stock ?? m.newStock,
      reason: m.reason || "",
      admin: m.admin_name || m.admin,
      date: m.created_at ? new Date(m.created_at).getTime() : m.date,
    }));
  } catch (err) {
    console.error("Supabase fetchStockMovements error:", err);
    return [];
  }
}

export async function dbCreateStockMovement(movement) {
  if (!isSupabaseConfigured()) return movement;
  try {
    const dbPayload = {
      id: movement.id,
      product_id: movement.productId,
      product_name: movement.productName,
      movement_type: movement.movementType,
      old_stock: Number(movement.oldStock) || 0,
      new_stock: Number(movement.newStock) || 0,
      reason: movement.reason || "",
      admin_name: movement.admin || "",
    };
    const { data, error } = await supabase
      .from("stock_movements")
      .insert([dbPayload])
      .select();
    if (error) console.error("Error creating stock movement in Supabase:", error);
    return data?.[0] || movement;
  } catch (err) {
    console.error("Supabase dbCreateStockMovement error:", err);
    return movement;
  }
}

/* ------------------------------------------------------------------
   SEED DATA HELPER
------------------------------------------------------------------ */
export async function seedSupabaseDatabase() {
  if (!isSupabaseConfigured()) return { success: false, message: "Supabase not configured in .env" };
  try {
    // 1. Seed products
    const { data: existingProds } = await supabase.from("products").select("id").limit(1);
    if (!existingProds || existingProds.length === 0) {
      await supabase.from("products").insert(
        initialProducts.map((p) => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          barcode: p.barcode,
          category: p.category,
          price: p.price,
          cost: p.cost,
          stock: p.stock,
          low_stock_threshold: p.lowStockThreshold,
          unit: p.unit,
          inventory_type: p.inventoryType,
          status: p.status,
          description: p.description,
        }))
      );
    }

    // 2. Seed users
    const { data: existingUsers } = await supabase.from("users").select("id").limit(1);
    if (!existingUsers || existingUsers.length === 0) {
      await supabase.from("users").insert(
        initialUsers.map((u) => ({
          id: u.id,
          name: u.name,
          username: u.username,
          password: u.password || (u.role === "ADMIN" ? "admin123" : "john123"),
          role: u.role,
          status: u.status,
        }))
      );
    }

    return { success: true, message: "Supabase database seeded with products and users!" };
  } catch (err) {
    console.error("Error seeding Supabase database:", err);
    return { success: false, message: err.message };
  }
}
