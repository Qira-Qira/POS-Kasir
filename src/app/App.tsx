import { LoginScreen } from "./components/auth/LoginScreen";
import {
  DeleteConfirmDialog,
} from "./components/features/DeleteConfirmDialog";
import {
  ProductFormModal,
} from "./components/features/ProductFormModal";
import { UserFormModal } from "./components/features/UserFormModal";
import { AppShell } from "./components/layout/AppShell";
import { CartSidebar } from "./components/layout/CartSidebar";
import { ProductPageSkeleton, ReportPageSkeleton } from "./components/ui/PageSkeleton";
import { PaymentDialog } from "./components/ui/PaymentDialog";
import { ReceiptDialog } from "./components/ui/ReceiptDialog";
import { ROLE_CONFIG } from "./constants";
import { usePosApp } from "./hooks/usePosApp";
import { getServerSideProps } from "./server/getServerSideProps";
import { formatCurrency } from "./utils";
import { AccountView } from "./views/AccountView";
import { DashboardView } from "./views/DashboardView";
import { MenuView } from "./views/MenuView";
import { ReportView } from "./views/ReportView";
import { SettingsView } from "./views/SettingsView";
import { ShiftView } from "./views/ShiftView";
import { StockView } from "./views/StockView";
import { TransactionHistoryView } from "./views/TransactionHistoryView";
import { useEffect, useState } from "react";

const STORE_NAME = "Gumbira Loka Cafe";
const STORE_ADDRESS = "Masuk Gumbira Park / Kampus C UISI, Jl. Siti Fatimah Binti Maimun, Jarangkuwung, Tlogopojok, Kec. Gresik, Kabupaten Gresik, Jawa Timur 61121";

export default function App() {
  const appState = usePosApp();
  const {
    auth,
    systemUsers,
    loginForm,
    loginError,
    activeView,
    isDarkMode,
    cart,
    products,
    selectedCategory,
    searchQuery,
    isAddMenuOpen,
    isAddUserModalOpen,
    menuSearch,
    userSearch,
    newProduct,
    newUser,
    productToDeleteId,
    userDeleteUsername,
    editingProductId,
    productDraft,
    editingUserUsername,
    userDraft,
    userPage,
    paymentDialogOpen,
    receiptDialogOpen,
    currentTransaction,
    transactions,
    stockSearch,
    stockCategory,
    stockPage,
    settingsPage,
    categories,
    currentTime,
    visibleNavItems,
    filteredProducts,
    lowStockProducts,
    lowStockIngredients,
    rawMaterialStock,
    totalAmount,
    totalItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    increaseAddonQuantity,
    decreaseAddonQuantity,
    removeFromCart,
    clearCart,
    handleAddProduct,
    handleDeleteProduct,
    handleStartEditProduct,
    handleCloseEditProduct,
    handleSaveProductEdit,
    handleAddRawMaterial,
    handleUpdateRawMaterial,
    handleDeleteRawMaterial,
    handleStartEditRawMaterial,
    handleStartEditUser,
    handleCloseEditUser,
    handleSaveUserEdit,
    handleAddUser,
    handleDeleteUser,
    handlePaymentComplete,
    handleNewTransaction,
    handleToggleTransactionStatus,
    handleLogin,
    handleLogout,
    setLoginForm,
    reportRange,
    setReportRange,
    reportShift,
    setReportShift,
    reportBranch,
    setReportBranch,
    reportStartDate,
    setReportStartDate,
    reportEndDate,
    setReportEndDate,
    setActiveView,
    setIsDarkMode,
    setSearchQuery,
    setSelectedCategory,
    setProductToDeleteId,
    setIsAddMenuOpen,
    setIsAddUserModalOpen,
    setMenuSearch,
    setUserSearch,
    setNewProduct,
    setNewUser,
    setProductDraft,
    setUserDraft,
    setUserPage,
    setPaymentDialogOpen,
    setReceiptDialogOpen,
    setStockSearch,
    setStockCategory,
    setStockPage,
    setSettingsPage,
    shiftState,
    shiftHistory,
    handleOpenShift,
    handleCloseShift,
    setUserDeleteUsername,
    setProducts,
  } = appState;

  const [serverPageStatus, setServerPageStatus] = useState({ menu: false, report: false });
  const [pageLoading, setPageLoading] = useState(false);
  const [serverReport, setServerReport] = useState<
    | {
        kpiCards?: Array<{ label: string; value: string; change: string; color?: string }>;
        bestSellerMenu?: Array<{ name: string; qty: number; revenue: string }>;
        paymentBreakdown?: Array<{ label: string; share: number; amount: string; color: string }>;
        transactions?: Array<{
          id: string;
          items: Array<{ name: string; quantity: number; price: number; category?: string }>;
          total: number;
          paymentMethod: string;
          amountPaid: number;
          orderType: string;
          createdAt: string;
        }>;
        fetchedAt?: string;
      }
    | null
  >(null);

  useEffect(() => {
    if (!auth) return;

    if (activeView === "Menu" && !serverPageStatus.menu) {
      let cancelled = false;
      setPageLoading(true);

      const loadMenuPage = async () => {
        const result = await getServerSideProps("products");
        if (cancelled) return;

        const serverProducts = result?.props?.products ?? products;
        setProducts(serverProducts);
        setServerPageStatus((prev) => ({ ...prev, menu: true }));
        setPageLoading(false);
      };

      void loadMenuPage();
      return () => {
        cancelled = true;
      };
    }

    if (activeView === "Laporan") {
      let cancelled = false;
      setPageLoading(true);

      const loadReportPage = async () => {
        const filters = {
          range: reportRange,
          shift: reportShift,
          branch: reportBranch,
          from: reportStartDate,
          to: reportEndDate,
        };
        const result = await getServerSideProps("report", filters);
        if (cancelled) return;

        setServerReport(result?.props?.report ?? null);
        setPageLoading(false);
      };

      void loadReportPage();
      return () => {
        cancelled = true;
      };
    }

    setPageLoading(false);
  }, [
    activeView,
    auth,
    products,
    reportRange,
    reportShift,
    reportBranch,
    reportStartDate,
    reportEndDate,
    serverPageStatus.menu,
    serverPageStatus.report,
    setProducts,
  ]);

  const renderContent = () => {
    if (!auth) return null;

    if (pageLoading && (activeView === "Menu" || activeView === "Laporan")) {
      return activeView === "Menu" ? <ProductPageSkeleton /> : <ReportPageSkeleton />;
    }

    switch (activeView) {
      case "Dashboard":
        return <DashboardView lowStockProducts={lowStockProducts} lowStockIngredients={lowStockIngredients} />;
      case "Menu":
        return (
          <MenuView
            products={products}
            auth={auth}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            categories={categories}
            filteredProducts={filteredProducts}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            onAddToCart={addToCart}
          />
        );
      case "Laporan":
        return (
          <ReportView
            products={products}
            report={serverReport ?? undefined}
            shiftHistory={shiftHistory}
            currentShiftState={shiftState}
            reportRange={reportRange}
            setReportRange={setReportRange}
            reportShift={reportShift}
            setReportShift={setReportShift}
            reportBranch={reportBranch}
            setReportBranch={setReportBranch}
            reportStartDate={reportStartDate}
            setReportStartDate={setReportStartDate}
            reportEndDate={reportEndDate}
            setReportEndDate={setReportEndDate}
          />
        );
      case "Riwayat":
        return (
          <TransactionHistoryView
            transactions={transactions}
            onToggleStatus={handleToggleTransactionStatus}
            formatCurrency={formatCurrency}
          />
        );
      case "Stok":
        return (
          <StockView
            rawMaterialStock={rawMaterialStock}
            rawMaterialDraft={appState.rawMaterialDraft}
            editingRawMaterialId={appState.editingRawMaterialId}
            setRawMaterialDraft={appState.setRawMaterialDraft}
            setEditingRawMaterialId={appState.setEditingRawMaterialId}
            handleAddRawMaterial={handleAddRawMaterial}
            handleUpdateRawMaterial={handleUpdateRawMaterial}
            handleDeleteRawMaterial={handleDeleteRawMaterial}
            handleStartEditRawMaterial={handleStartEditRawMaterial}
            handleRestockIngredient={appState.handleRestockIngredient}
            stockSearch={stockSearch}
            setStockSearch={setStockSearch}
            stockPage={stockPage}
            setStockPage={setStockPage}
            formatCurrency={formatCurrency}
          />
        );
      case "Shift":
        return (
          <ShiftView
            key={`shift-${shiftState.status}-${shiftState.openedAt}`}
            shiftState={shiftState}
            shiftHistory={shiftHistory}
            cashSalesTotal={
              shiftState.openedAt
                ? transactions
                    .filter(
                      (transaction) =>
                        transaction.paymentMethod === "Cash" &&
                        transaction.isCompleted &&
                        new Date(transaction.date) >= new Date(shiftState.openedAt!)
                    )
                    .reduce((sum, transaction) => sum + transaction.total, 0)
                : 0
            }
            formatCurrency={formatCurrency}
            onOpenShift={handleOpenShift}
            onCloseShift={(actualCash, movements) => handleCloseShift(actualCash, movements)}
          />
        );
      case "Pengaturan":
        return (
          <SettingsView
            products={products}
            menuSearch={menuSearch}
            setMenuSearch={setMenuSearch}
            settingsPage={settingsPage}
            setSettingsPage={setSettingsPage}
            handleStartEditProduct={handleStartEditProduct}
            setProductToDeleteId={setProductToDeleteId}
            setIsAddMenuOpen={setIsAddMenuOpen}
            formatCurrency={formatCurrency}
          />
        );
      case "Akun":
        return (
          <AccountView
            systemUsers={systemUsers}
            userSearch={userSearch}
            setUserSearch={setUserSearch}
            userPage={userPage}
            setUserPage={setUserPage}
            handleStartEditUser={handleStartEditUser}
            setUserDeleteUsername={setUserDeleteUsername}
            setIsAddUserModalOpen={setIsAddUserModalOpen}
          />
        );
      default:
        return <DashboardView lowStockProducts={lowStockProducts} lowStockIngredients={lowStockIngredients} />;
    }
  };

  if (!auth) {
    return (
      <LoginScreen
        isDarkMode={isDarkMode}
        loginForm={loginForm}
        loginError={loginError}
        onLogin={handleLogin}
        onChange={(field, value) => setLoginForm((prev) => ({ ...prev, [field]: value }))}
      />
    );
  }

  const currentRoleLabel = auth ? ROLE_CONFIG[auth.role].label : "Admin";
  const isCatalogView = activeView === "Menu";

  return (
    <AppShell
      auth={auth}
      activeView={activeView}
      currentRoleLabel={currentRoleLabel}
      currentTime={currentTime}
      isDarkMode={isDarkMode}
      visibleNavItems={visibleNavItems}
      setActiveView={setActiveView}
      setIsDarkMode={setIsDarkMode}
      handleLogout={handleLogout}
      sidebar={
        isCatalogView ? (
          <CartSidebar
            cart={cart}
            totalItems={totalItems}
            totalAmount={totalAmount}
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
            onIncreaseAddon={increaseAddonQuantity}
            onDecreaseAddon={decreaseAddonQuantity}
            onRemove={removeFromCart}
            onClearCart={clearCart}
            onPayNow={() => setPaymentDialogOpen(true)}
            formatCurrency={formatCurrency}
          />
        ) : null
      }
    >
      <>
        {renderContent()}

        <DeleteConfirmDialog
          open={Boolean(productToDeleteId)}
          title="Hapus Menu"
          targetName={products.find((product) => product.id === productToDeleteId)?.name || "Produk"}
          meta={products.find((product) => product.id === productToDeleteId)?.category || "Kategori"}
          description="Tindakan ini akan menghapus menu dari katalog dan tidak dapat dipilih saat transaksi berikutnya."
          confirmLabel="Hapus Menu"
          onCancel={() => setProductToDeleteId(null)}
          onConfirm={() => {
            if (productToDeleteId) handleDeleteProduct(productToDeleteId);
          }}
        />

        {auth?.role === "admin" && (
          <ProductFormModal
            open={isAddMenuOpen}
            title="Tambah Menu Baru"
            submitLabel="Simpan Menu"
            formState={newProduct}
            categories={categories}
            rawMaterials={rawMaterialStock}
            addonGroups={[
              "Ekstra",
              "Toping",
              "Ukuran",
              ...new Set(products.flatMap((product) => (product.addons ?? []).map((addon) => addon.group).filter((group) => group !== "Sugar Level"))),
            ]}
            onChange={(field, value) => setNewProduct((prev) => ({ ...prev, [field]: value }))}
            onSubmit={handleAddProduct}
            onClose={() => setIsAddMenuOpen(false)}
          />
        )}

        {editingProductId && (
          <ProductFormModal
            open={Boolean(editingProductId)}
            title="Edit Menu"
            submitLabel="Simpan Perubahan"
            formState={productDraft}
            categories={categories}
            rawMaterials={rawMaterialStock}
            addonGroups={[
              "Ekstra",
              "Toping",
              "Ukuran",
              ...new Set(products.flatMap((product) => (product.addons ?? []).map((addon) => addon.group).filter((group) => group !== "Sugar Level"))),
            ]}
            onChange={(field, value) => setProductDraft((prev) => ({ ...prev, [field]: value }))}
            onSubmit={(event) => {
              event.preventDefault();
              handleSaveProductEdit(editingProductId);
            }}
            onClose={handleCloseEditProduct}
          />
        )}

        <UserFormModal
          open={Boolean(isAddUserModalOpen)}
          title="Tambah Akun Baru"
          submitLabel="Simpan Akun"
          formState={newUser}
          onChange={(field, value) => setNewUser((prev) => ({ ...prev, [field]: value }))}
          onSubmit={handleAddUser}
          onClose={() => setIsAddUserModalOpen(false)}
        />

        {editingUserUsername && (
          <UserFormModal
            open={Boolean(editingUserUsername)}
            title="Edit Akun"
            submitLabel="Simpan Perubahan"
            formState={userDraft}
            onChange={(field, value) => setUserDraft((prev) => ({ ...prev, [field]: value }))}
            onSubmit={(event) => {
              event.preventDefault();
              handleSaveUserEdit(editingUserUsername);
            }}
            onClose={handleCloseEditUser}
          />
        )}

        <DeleteConfirmDialog
          open={Boolean(userDeleteUsername)}
          title="Hapus Akun"
          targetName={userDeleteUsername || "Akun"}
          meta={systemUsers.find((user) => user.username === userDeleteUsername)?.role || "Role"}
          description="Tindakan ini akan menghapus akun dari sistem dan semua akses login terkait akan hilang."
          confirmLabel="Hapus Akun"
          onCancel={() => setUserDeleteUsername(null)}
          onConfirm={() => {
            if (userDeleteUsername) handleDeleteUser(userDeleteUsername);
          }}
        />

        {isCatalogView && (
          <>
            <PaymentDialog
              open={paymentDialogOpen}
              onOpenChange={setPaymentDialogOpen}
              total={totalAmount}
              onComplete={handlePaymentComplete}
            />

            {currentTransaction && (
              <ReceiptDialog
                open={receiptDialogOpen}
                onOpenChange={setReceiptDialogOpen}
                items={currentTransaction.items}
                total={currentTransaction.total}
                paymentMethod={currentTransaction.paymentMethod}
                amountPaid={currentTransaction.amountPaid}
                orderType={currentTransaction.orderType}
                transactionId={currentTransaction.id}
                onNewTransaction={handleNewTransaction}
                storeName={STORE_NAME}
                storeAddress={STORE_ADDRESS}
              />
            )}
          </>
        )}
      </>
    </AppShell>
  );
}
