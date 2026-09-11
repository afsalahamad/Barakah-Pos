import React, { useState, useMemo, useEffect } from "react";
import { Check } from "lucide-react";

// Seed data & helpers
import { CATEGORIES, initialProducts, initialUsers, seedTransactions, seedGrns, seedExpenses, EXPENSE_CATEGORIES } from "./src/data/seedData";
import { daysAgo, isToday, isWithinDays, stockStatus, isStockTracked } from "./src/utils/helpers";
import {
  isSupabaseConfigured,
  dbFetchProducts,
  dbSaveProduct,
  dbUpdateProductStock,
  dbFetchTransactions,
  dbCreateTransaction,
  dbFetchExpenses,
  dbCreateExpense,
  dbFetchUsers,
  dbAuthenticateUser,
  dbSaveUser,
  dbFetchGrns,
  dbCreateGrn,
  dbFetchHeldBills,
  dbSaveHeldBill,
  dbDeleteHeldBill,
  dbFetchStockMovements,
  dbCreateStockMovement,
} from "./src/services/supabaseService";

// UI Components
import { GlobalStyle } from "./src/components/ui/GlobalStyle";

// Auth Screens
import { IntroScreen } from "./src/components/auth/IntroScreen";
import { RoleSelection } from "./src/components/auth/RoleSelection";
import { LoginScreen } from "./src/components/auth/LoginScreen";

// Admin Views
import { AdminShell } from "./src/components/admin/AdminShell";
import { Dashboard } from "./src/components/admin/Dashboard";
import { Products } from "./src/components/admin/Products";
import { Stock } from "./src/components/admin/Stock";
import { Transactions } from "./src/components/admin/Transactions";
import { AdminHeldBills } from "./src/components/admin/AdminHeldBills";
import { Reports } from "./src/components/admin/Reports";
import { Users } from "./src/components/admin/Users";
import { Settings } from "./src/components/admin/Settings";

// Cashier Views
import { CashierShell } from "./src/components/cashier/CashierShell";
import { CashierHeldBills } from "./src/components/cashier/CashierHeldBills";
import { CashierStock } from "./src/components/cashier/CashierStock";

// POS & Shared Views
import { BillingDesk } from "./src/components/pos/BillingDesk";
import { ProfileView } from "./src/components/shared/ProfileView";
import { GRN } from "./src/components/admin/GRN";
import { ExpensesView } from "./src/components/shared/ExpensesView";

// Modals
import { AppModals } from "./src/components/modals/AppModals";

export default function BarakahPOS() {
  const [screen, setScreen] = useState("intro"); // intro | role | login-admin | login-cashier | admin | cashier
  const [currentUser, setCurrentUser] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [products, setProducts] = useState(initialProducts);
  const [users, setUsers] = useState(initialUsers);
  const [transactions, setTransactions] = useState(seedTransactions);
  const [grns, setGrns] = useState(seedGrns);
  const [expenses, setExpenses] = useState(seedExpenses);
  const [heldBills, setHeldBills] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);
  const [invoiceSeq, setInvoiceSeq] = useState(112);
  const [holdSeq, setHoldSeq] = useState(1);
  const [grnSeq, setGrnSeq] = useState(3);
  const [expenseSeq, setExpenseSeq] = useState(3);

  // Load all data from Supabase if configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      dbFetchProducts().then((res) => res && setProducts(res));
      dbFetchTransactions().then((res) => res && setTransactions(res));
      dbFetchExpenses().then((res) => res && setExpenses(res));
      dbFetchUsers().then((res) => res && setUsers(res));
      dbFetchGrns().then((res) => res && setGrns(res));
      dbFetchHeldBills().then((res) => res && setHeldBills(res));
      dbFetchStockMovements().then((res) => res && setStockMovements(res));
    }
  }, []);


  const [business, setBusiness] = useState({
    name: "Barakah Mart",
    address: "14 Crescent Road, Colombo",
    phone: "+94 77 123 4567",
    email: "hello@barakahmart.lk",
    currency: "Rs.",
    receiptHeader: "Thank you for shopping with us.",
    receiptFooter: "Thank you for your business.",
    invoicePrefix: "INV-2026",
  });

  const [adminView, setAdminView] = useState("dashboard");
  const [cashierView, setCashierView] = useState("billing");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [modal, setModal] = useState(null); // {type, ...payload}
  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2600);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // cashier POS cart
  const [cart, setCart] = useState([]);
  const [cartNote, setCartNote] = useState("");
  const [cashReceivedInput, setCashReceivedInput] = useState("");
  const [posSearch, setPosSearch] = useState("");
  const [posCategory, setPosCategory] = useState("All");
  const [isCompletingSale, setIsCompletingSale] = useState(false);
  const [cartError, setCartError] = useState("");

  // filters
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("All");
  const [stockSearch, setStockSearch] = useState("");
  const [stockStatusFilter, setStockStatusFilter] = useState("All");
  const [txnSearch, setTxnSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [reportTab, setReportTab] = useState("Sales");
  const [reportRange, setReportRange] = useState("7 Days");
  const [cashierStockSearch, setCashierStockSearch] = useState("");
  const [profileEditing, setProfileEditing] = useState(false);

  const showToast = (msg) => setToast(msg);

  /* -------------------------- derived data -------------------------- */
  const activeProducts = products.filter((p) => p.status === "Active");
  const lowStockProducts = products.filter(
    (p) => isStockTracked(p) && (stockStatus(p) === "Low Stock" || stockStatus(p) === "Out of Stock")
  );
  const todaysTxns = transactions.filter((t) => isToday(t.createdAt));
  const todayRevenue = todaysTxns.reduce((s, t) => s + t.total, 0);
  const todayItemsSold = todaysTxns.reduce((s, t) => s + t.items.reduce((a, i) => a + i.qty, 0), 0);

  const last7 = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const label = new Date(daysAgo(i)).toLocaleDateString(undefined, { weekday: "short" });
      const dayTxns = transactions.filter(
        (t) => new Date(t.createdAt).toDateString() === new Date(daysAgo(i)).toDateString()
      );
      days.push({ day: label, revenue: +dayTxns.reduce((s, t) => s + t.total, 0).toFixed(2) });
    }
    return days;
  }, [transactions]);

  const bestSellers = useMemo(() => {
    const map = {};
    transactions.forEach((t) =>
      t.items.forEach((it) => {
        map[it.productId] = map[it.productId] || { name: it.name, qty: 0, revenue: 0 };
        map[it.productId].qty += it.qty;
        map[it.productId].revenue += it.lineTotal;
      })
    );
    return Object.values(map)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [transactions]);

  const rangeDays = reportRange === "Today" ? 1 : reportRange === "7 Days" ? 7 : 30;
  const rangeTxns = transactions.filter((t) => isWithinDays(t.createdAt, rangeDays));

  /* -------------------------- auth -------------------------- */
  const handleLogin = async (role, username, password = "") => {
    if (!username.trim()) {
      setLoginError("Please enter your username.");
      return;
    }
    if (!password.trim()) {
      setLoginError("Please enter your password.");
      return;
    }

    let user = null;
    if (isSupabaseConfigured()) {
      user = await dbAuthenticateUser(username, password);
      if (!user) {
        setLoginError("Invalid username or password.");
        return;
      }
    } else {
      user = users.find(
        (u) =>
          u.username.toLowerCase() === username.trim().toLowerCase() ||
          u.name.toLowerCase() === username.trim().toLowerCase()
      );
      if (user && user.password && user.password !== password) {
        setLoginError("Invalid password.");
        return;
      }
    }

    const resolvedUser = user;
    if (!resolvedUser) {
      setLoginError("Invalid username or password.");
      return;
    }
    if (resolvedUser.status === "Inactive") {
      setLoginError("This account has been deactivated. Contact an admin.");
      return;
    }

    const userRole = resolvedUser.role || role;
    setCurrentUser(resolvedUser);
    setLoginError("");
    setLoginUsername("");
    setLoginPassword("");
    setScreen(userRole === "ADMIN" ? "admin" : "cashier");
    setAdminView("dashboard");
    setCashierView("billing");
  };

  const requestLogout = () => {
    if (screen === "cashier" && cart.length > 0) {
      setModal({ type: "confirmLogout" });
      return;
    }
    doLogout();
  };
  const doLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setCartNote("");
    setCashReceivedInput("");
    setModal(null);
    setScreen("role");
  };

  /* -------------------------- products -------------------------- */
  const openProductForm = (mode, product) =>
    setModal({
      type: "productForm",
      mode,
      data: product
        ? { ...product, inventoryType: product.inventoryType || "STOCK_TRACKED" }
        : {
            name: "",
            sku: "",
            barcode: "",
            category: CATEGORIES[0],
            inventoryType: "STOCK_TRACKED",
            price: "",
            cost: "",
            stock: "",
            lowStockThreshold: "5",
            unit: "piece",
            status: "Active",
            description: "",
          },
    });
  const saveProduct = () => {
    const d = modal.data;
    const isTracked = (d.inventoryType || "STOCK_TRACKED") === "STOCK_TRACKED";
    if (!d.name.trim() || d.price === "" || (isTracked && d.stock === "")) {
      showToast("Unable to save the product. Please enter required fields.");
      return;
    }
    const payload = {
      ...d,
      inventoryType: d.inventoryType || "STOCK_TRACKED",
      price: +d.price,
      cost: +d.cost || 0,
      stock: isTracked ? +d.stock : 0,
      lowStockThreshold: isTracked ? +d.lowStockThreshold || 0 : 0,
    };
    if (modal.mode === "add") {
      const newP = { ...payload, id: "p" + Date.now() };
      setProducts((p) => [...p, newP]);
      dbSaveProduct(newP, true);
    } else {
      setProducts((p) => p.map((x) => (x.id === payload.id ? payload : x)));
      dbSaveProduct(payload, false);
    }
    setModal(null);
    showToast("Product saved successfully.");
  };
  const confirmDeactivateProduct = (product) => setModal({ type: "confirmDeactivateProduct", product });
  const deactivateProduct = () => {
    setProducts((p) =>
      p.map((x) => (x.id === modal.product.id ? { ...x, status: x.status === "Active" ? "Inactive" : "Active" } : x))
    );
    setModal(null);
  };

  /* -------------------------- stock -------------------------- */
  const openStockAdjust = (product) =>
    setModal({ type: "stockAdjust", product, adjType: "Add Stock", qty: "", reason: "" });
  const applyStockAdjust = () => {
    const { product, adjType, qty, reason } = modal;
    const q = +qty;
    if (!q || q <= 0 || !reason.trim()) {
      showToast("Enter a valid quantity and reason.");
      return;
    }
    const change = adjType === "Remove Stock" ? -q : adjType === "Correction" ? q - product.stock : q;
    const newStock = adjType === "Correction" ? q : Math.max(0, product.stock + change);
    setProducts((ps) => ps.map((p) => (p.id === product.id ? { ...p, stock: newStock } : p)));
    dbUpdateProductStock(product.id, newStock);

    const movement = {
      id: "m" + Date.now(),
      productId: product.id,
      productName: product.name,
      movementType: adjType,
      oldStock: product.stock,
      newStock,
      reason,
      admin: currentUser?.name || "Admin User",
      date: Date.now(),
    };

    setStockMovements((m) => [movement, ...m]);
    dbCreateStockMovement(movement);
    setModal(null);
    showToast("Stock updated.");
  };

  /* -------------------------- users -------------------------- */
  const openUserForm = (mode, user) =>
    setModal({
      type: "userForm",
      mode,
      data: user ? { ...user } : { name: "", username: "", role: "CASHIER", status: "Active" },
    });
  const saveUser = () => {
    const d = modal.data;
    if (!d.name.trim() || !d.username.trim()) {
      showToast("Enter a name and username.");
      return;
    }
    if (modal.mode === "add") {
      const newUser = { ...d, id: "u" + Date.now(), createdAt: Date.now() };
      setUsers((u) => [...u, newUser]);
      dbSaveUser(newUser, true);
    } else {
      setUsers((u) => u.map((x) => (x.id === d.id ? d : x)));
      dbSaveUser(d, false);
    }
    setModal(null);
    showToast("User saved successfully.");
  };
  const confirmDeactivateUser = (user) => setModal({ type: "confirmDeactivateUser", user });
  const toggleUserStatus = () => {
    setUsers((u) =>
      u.map((x) => (x.id === modal.user.id ? { ...x, status: x.status === "Active" ? "Inactive" : "Active" } : x))
    );
    setModal(null);
  };

  /* -------------------------- GRN (Goods Received Note) -------------------------- */
  const openGrnForm = () => {
    const defaultProd = products[0];
    setModal({
      type: "grnForm",
      data: {
        supplier: "",
        supplierRef: "",
        notes: "",
        items: [
          {
            productId: defaultProd?.id || "",
            name: defaultProd?.name || "",
            receivedQty: 1,
            unitCost: defaultProd?.cost || 0,
          },
        ],
      },
    });
  };

  const viewGrnDetails = (grn) => {
    setModal({ type: "grnDetails", grn });
  };

  const createGrn = (d) => {
    if (!d.supplier.trim()) {
      showToast("Supplier name is required.");
      return;
    }
    if (!d.items || d.items.length === 0) {
      showToast("At least one product item is required.");
      return;
    }
    const hasInvalidItem = d.items.some(
      (it) => !it.productId || +it.receivedQty <= 0 || +it.unitCost < 0
    );
    if (hasInvalidItem) {
      showToast("Please ensure all products have valid received quantity and cost.");
      return;
    }

    const grnNumber = `GRN-2026-${String(grnSeq).padStart(6, "0")}`;
    const formattedItems = d.items.map((it) => {
      const prod = products.find((p) => p.id === it.productId);
      const recQty = +it.receivedQty;
      const unitCost = +it.unitCost;
      return {
        productId: it.productId,
        name: it.name || prod?.name || "Product",
        receivedQty: recQty,
        unitCost,
        lineTotal: +(recQty * unitCost).toFixed(2),
      };
    });

    const totalCost = +formattedItems.reduce((s, it) => s + it.lineTotal, 0).toFixed(2);

    const newGrn = {
      id: "g" + Date.now(),
      grnNumber,
      supplier: d.supplier.trim(),
      supplierRef: d.supplierRef.trim(),
      createdBy: currentUser?.name || "Admin User",
      notes: d.notes.trim(),
      items: formattedItems,
      totalCost,
      status: "Completed",
      createdAt: Date.now(),
    };

    // 1. Update Product Stock
    setProducts((ps) =>
      ps.map((p) => {
        const item = formattedItems.find((it) => it.productId === p.id);
        if (item) {
          const nextStock = p.stock + item.receivedQty;
          dbUpdateProductStock(p.id, nextStock);
          return { ...p, stock: nextStock };
        }
        return p;
      })
    );

    // 2. Create Stock Movement Audit Log
    const newMovements = formattedItems.map((it, i) => {
      const prod = products.find((p) => p.id === it.productId);
      const oldStock = prod ? prod.stock : 0;
      return {
        id: "m_grn_" + Date.now() + "_" + i,
        productId: it.productId,
        productName: it.name,
        movementType: "GRN_RECEIVED",
        oldStock,
        newStock: oldStock + it.receivedQty,
        reason: `Stock received through ${grnNumber} (Supplier: ${newGrn.supplier})`,
        admin: currentUser?.name || "Admin User",
        date: Date.now(),
      };
    });

    setStockMovements((m) => [...newMovements, ...m]);
    setGrns((g) => [newGrn, ...g]);
    dbCreateGrn(newGrn);
    setGrnSeq((n) => n + 1);
    setModal(null);
    showToast(`GRN created (${grnNumber}) and stock updated successfully.`);
  };

  /* -------------------------- Expenses -------------------------- */
  const openExpenseForm = () => {
    setModal({
      type: "expenseForm",
      data: {
        category: EXPENSE_CATEGORIES[0],
        amount: "",
        note: "",
      },
    });
  };

  const createExpense = (d) => {
    const amt = +d.amount;
    if (!amt || amt <= 0) {
      showToast("Enter a valid expense amount greater than 0.");
      return;
    }
    const expenseNumber = `EXP-2026-${String(expenseSeq).padStart(6, "0")}`;
    const newExpense = {
      id: "e" + Date.now(),
      expenseNumber,
      category: d.category,
      amount: amt,
      note: d.note.trim(),
      cashierId: currentUser?.id || "u1",
      cashierName: currentUser?.name || "Staff",
      createdAt: Date.now(),
    };

    setExpenses((e) => [newExpense, ...e]);
    dbCreateExpense(newExpense);
    setExpenseSeq((n) => n + 1);
    setModal(null);
    showToast(`Expense ${expenseNumber} saved successfully.`);
  };

  /* -------------------------- cashier POS cart -------------------------- */
  const cartSubtotal = +cart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2);
  const cashReceived = +cashReceivedInput || 0;
  const change = +(cashReceived - cartSubtotal).toFixed(2);

  const addToCart = (product) => {
    setCartError("");
    const tracked = isStockTracked(product);
    setCart((c) => {
      const existing = c.find((i) => i.productId === product.id);
      if (existing) {
        if (tracked && existing.qty + 1 > product.stock) {
          setCartError(`Only ${product.stock} units available.`);
          return c;
        }
        return c.map((i) =>
          i.productId === product.id
            ? { ...i, qty: i.qty + 1, lineTotal: +((i.qty + 1) * i.price).toFixed(2) }
            : i
        );
      }
      if (tracked && product.stock < 1) {
        setCartError("Out of stock.");
        return c;
      }
      return [...c, { productId: product.id, name: product.name, price: product.price, qty: 1, lineTotal: product.price }];
    });
  };
  const changeQty = (productId, delta) => {
    const product = products.find((p) => p.id === productId);
    const tracked = isStockTracked(product);
    setCartError("");
    setCart((c) =>
      c.map((i) => {
        if (i.productId !== productId) return i;
        const nextQty = i.qty + delta;
        if (nextQty < 1) return i;
        if (tracked && nextQty > product.stock) {
          setCartError(`Only ${product.stock} units available.`);
          return i;
        }
        return { ...i, qty: nextQty, lineTotal: +(nextQty * i.price).toFixed(2) };
      })
    );
  };
  const removeFromCart = (productId) => setCart((c) => c.filter((i) => i.productId !== productId));
  const clearCart = () => {
    setCart([]);
    setCartNote("");
    setCashReceivedInput("");
    setCartError("");
  };

  const holdBill = () => {
    if (cart.length === 0) return;
    const bill = {
      id: "h" + Date.now(),
      holdReference: `HOLD-${String(holdSeq).padStart(3, "0")}`,
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      items: cart,
      subtotal: cartSubtotal,
      total: cartSubtotal,
      notes: cartNote,
      status: "Held",
      createdAt: Date.now(),
    };
    setHeldBills((h) => [bill, ...h]);
    dbSaveHeldBill(bill);
    setHoldSeq((n) => n + 1);
    clearCart();
    showToast(`Bill held as ${bill.holdReference}.`);
  };

  const resumeHeldBill = (bill) => {
    const shortages = bill.items.filter((i) => {
      const product = products.find((p) => p.id === i.productId);
      return isStockTracked(product) && (!product || product.stock < i.qty);
    });
    if (shortages.length > 0) {
      setModal({ type: "stockShortage", bill, shortages });
      return;
    }
    setCart(bill.items);
    setCartNote(bill.notes || "");
    setHeldBills((h) => h.filter((b) => b.id !== bill.id));
    dbDeleteHeldBill(bill.id);
    setCashierView("billing");
    showToast(`Resumed ${bill.holdReference}.`);
  };
  const cancelHeldBill = (bill) => setModal({ type: "confirmCancelHeld", bill });
  const removeHeldBill = () => {
    setHeldBills((h) => h.filter((b) => b.id !== modal.bill.id));
    if (modal?.bill?.id) dbDeleteHeldBill(modal.bill.id);
    setModal(null);
  };

  const completeSale = () => {
    if (cart.length === 0) return;
    if (cashReceived < cartSubtotal) {
      setCartError("Insufficient payment.");
      return;
    }
    const shortages = cart.filter((i) => {
      const p = products.find((pp) => pp.id === i.productId);
      return isStockTracked(p) && (!p || p.stock < i.qty);
    });
    if (shortages.length > 0) {
      setCartError(
        `${shortages[0].name}: only ${products.find((p) => p.id === shortages[0].productId)?.stock ?? 0} units available.`
      );
      return;
    }
    setIsCompletingSale(true);
    setTimeout(() => {
      const txn = {
        id: "t" + Date.now(),
        invoiceNumber: `${business.invoicePrefix}-${String(invoiceSeq).padStart(6, "0")}`,
        cashierId: currentUser.id,
        cashierName: currentUser.name,
        items: cart,
        subtotal: cartSubtotal,
        total: cartSubtotal,
        paymentMethod: "Cash",
        cashReceived,
        change,
        notes: cartNote,
        status: "Completed",
        createdAt: Date.now(),
      };
      setTransactions((t) => [txn, ...t]);
      dbCreateTransaction(txn);
      setProducts((ps) =>
        ps.map((p) => {
          const item = cart.find((i) => i.productId === p.id);
          if (item && isStockTracked(p)) {
            const nextStock = Math.max(0, p.stock - item.qty);
            dbUpdateProductStock(p.id, nextStock);
            return { ...p, stock: nextStock };
          }
          return p;
        })
      );
      setInvoiceSeq((n) => n + 1);
      clearCart();
      setIsCompletingSale(false);
      setModal({ type: "saleSuccess", txn });
    }, 550);
  };

  const goToRoleSelection = () => {
    setLoginError("");
    setLoginUsername("");
    setLoginPassword("");
    setScreen("role");
  };

  /* ==================================================================
     ROUTER
  ================================================================== */
  let body;
  if (screen === "intro") {
    body = <IntroScreen onGetStarted={() => setScreen("role")} />;
  } else if (screen === "role") {
    body = <RoleSelection onSelectRole={(r) => setScreen(r)} />;
  } else if (screen === "login-admin") {
    body = (
      <LoginScreen
        role="ADMIN"
        loginUsername={loginUsername}
        setLoginUsername={setLoginUsername}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        loginError={loginError}
        handleLogin={handleLogin}
        goToRoleSelection={goToRoleSelection}
      />
    );
  } else if (screen === "login-cashier") {
    body = (
      <LoginScreen
        role="CASHIER"
        loginUsername={loginUsername}
        setLoginUsername={setLoginUsername}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        loginError={loginError}
        handleLogin={handleLogin}
        goToRoleSelection={goToRoleSelection}
      />
    );
  } else if (screen === "admin") {
    let content;
    if (adminView === "dashboard") {
      content = (
        <Dashboard
          todayRevenue={todayRevenue}
          todaysTxns={todaysTxns}
          todayItemsSold={todayItemsSold}
          lowStockProducts={lowStockProducts}
          last7={last7}
          transactions={transactions}
          bestSellers={bestSellers}
          setAdminView={setAdminView}
          setModal={setModal}
          openProductForm={openProductForm}
        />
      );
    } else if (adminView === "products") {
      content = (
        <Products
          products={products}
          productSearch={productSearch}
          setProductSearch={setProductSearch}
          productCategoryFilter={productCategoryFilter}
          setProductCategoryFilter={setProductCategoryFilter}
          openProductForm={openProductForm}
          confirmDeactivateProduct={confirmDeactivateProduct}
        />
      );
    } else if (adminView === "stock") {
      content = (
        <Stock
          products={products}
          stockSearch={stockSearch}
          setStockSearch={setStockSearch}
          stockStatusFilter={stockStatusFilter}
          setStockStatusFilter={setStockStatusFilter}
          openStockAdjust={openStockAdjust}
          stockMovements={stockMovements}
        />
      );
    } else if (adminView === "transactions") {
      content = (
        <Transactions
          transactions={transactions}
          txnSearch={txnSearch}
          setTxnSearch={setTxnSearch}
          setModal={setModal}
        />
      );
    } else if (adminView === "grn") {
      content = <GRN grns={grns} openGrnForm={openGrnForm} viewGrnDetails={viewGrnDetails} />;
    } else if (adminView === "expenses") {
      content = (
        <ExpensesView
          expenses={expenses}
          openExpenseForm={openExpenseForm}
          currentUser={currentUser}
          isAdmin={true}
        />
      );
    } else if (adminView === "held-bills") {
      content = <AdminHeldBills heldBills={heldBills} />;
    } else if (adminView === "reports") {
      content = (
        <Reports
          reportTab={reportTab}
          setReportTab={setReportTab}
          reportRange={reportRange}
          setReportRange={setReportRange}
          rangeTxns={rangeTxns}
          products={products}
          transactions={transactions}
          expenses={expenses}
          grns={grns}
          business={business}
          currentUser={currentUser}
        />
      );
    } else if (adminView === "users") {
      content = (
        <Users
          users={users}
          userSearch={userSearch}
          setUserSearch={setUserSearch}
          openUserForm={openUserForm}
          confirmDeactivateUser={confirmDeactivateUser}
        />
      );
    } else if (adminView === "settings") {
      content = <Settings business={business} setBusiness={setBusiness} showToast={showToast} />;
    } else if (adminView === "profile") {
      content = (
        <ProfileView
          currentUser={currentUser}
          profileEditing={profileEditing}
          setProfileEditing={setProfileEditing}
          showToast={showToast}
          requestLogout={requestLogout}
        />
      );
    } else if (adminView === "pos") {
      content = (
        <BillingDesk
          activeProducts={activeProducts}
          posSearch={posSearch}
          setPosSearch={setPosSearch}
          posCategory={posCategory}
          setPosCategory={setPosCategory}
          addToCart={addToCart}
          cart={cart}
          changeQty={changeQty}
          removeFromCart={removeFromCart}
          cartError={cartError}
          setCartError={setCartError}
          cartNote={cartNote}
          setCartNote={setCartNote}
          cartSubtotal={cartSubtotal}
          cashReceivedInput={cashReceivedInput}
          setCashReceivedInput={setCashReceivedInput}
          change={change}
          holdBill={holdBill}
          clearCart={clearCart}
          isCompletingSale={isCompletingSale}
          completeSale={completeSale}
        />
      );
    }

    body = (
      <AdminShell
        adminView={adminView}
        setAdminView={setAdminView}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        currentUser={currentUser}
        requestLogout={requestLogout}
      >
        {content}
      </AdminShell>
    );
  } else if (screen === "cashier") {
    let content;
    if (cashierView === "billing") {
      content = (
        <BillingDesk
          activeProducts={activeProducts}
          posSearch={posSearch}
          setPosSearch={setPosSearch}
          posCategory={posCategory}
          setPosCategory={setPosCategory}
          addToCart={addToCart}
          cart={cart}
          changeQty={changeQty}
          removeFromCart={removeFromCart}
          cartError={cartError}
          setCartError={setCartError}
          cartNote={cartNote}
          setCartNote={setCartNote}
          cartSubtotal={cartSubtotal}
          cashReceivedInput={cashReceivedInput}
          setCashReceivedInput={setCashReceivedInput}
          change={change}
          holdBill={holdBill}
          clearCart={clearCart}
          isCompletingSale={isCompletingSale}
          completeSale={completeSale}
        />
      );
    } else if (cashierView === "held-bills") {
      content = (
        <CashierHeldBills
          heldBills={heldBills}
          currentUser={currentUser}
          resumeHeldBill={resumeHeldBill}
          cancelHeldBill={cancelHeldBill}
        />
      );
    } else if (cashierView === "stock") {
      content = (
        <CashierStock
          activeProducts={activeProducts}
          cashierStockSearch={cashierStockSearch}
          setCashierStockSearch={setCashierStockSearch}
        />
      );
    } else if (cashierView === "expenses") {
      content = (
        <ExpensesView
          expenses={expenses}
          openExpenseForm={openExpenseForm}
          currentUser={currentUser}
          isAdmin={false}
        />
      );
    } else if (cashierView === "profile") {
      content = (
        <ProfileView
          currentUser={currentUser}
          profileEditing={profileEditing}
          setProfileEditing={setProfileEditing}
          showToast={showToast}
          requestLogout={requestLogout}
        />
      );
    }

    body = (
      <CashierShell
        cashierView={cashierView}
        setCashierView={setCashierView}
        currentUser={currentUser}
        heldBills={heldBills}
        requestLogout={requestLogout}
      >
        {content}
      </CashierShell>
    );
  }

  return (
    <div className="font-body">
      <GlobalStyle />
      {body}
      <AppModals
        modal={modal}
        setModal={setModal}
        doLogout={doLogout}
        saveProduct={saveProduct}
        deactivateProduct={deactivateProduct}
        applyStockAdjust={applyStockAdjust}
        saveUser={saveUser}
        toggleUserStatus={toggleUserStatus}
        removeHeldBill={removeHeldBill}
        products={products}
        business={business}
        createGrn={createGrn}
        createExpense={createExpense}
      />
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-sm font-body px-4 py-2.5 rounded-md shadow-lg z-50 flex items-center gap-2">
          <Check size={15} className="text-amber-400" /> {toast}
        </div>
      )}
    </div>
  );
}
