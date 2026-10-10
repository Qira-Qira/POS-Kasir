import { Check, Printer } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { Separator } from "./separator";

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: ReceiptItem[];
  total: number;
  paymentMethod: string;
  amountPaid: number;
  orderType: "Dine In" | "Takeaway";
  transactionId: string;
  onNewTransaction: () => void;
  storeName?: string;
  storeAddress?: string;
}

const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

type PrintTarget = "cashier" | "kitchen" | "both";
type PrintWorkflowState = "select" | PrintTarget;

export function ReceiptDialog({
  open,
  onOpenChange,
  items,
  total,
  paymentMethod,
  amountPaid,
  orderType,
  transactionId,
  onNewTransaction,
  storeName = "Gumbira Loka",
  storeAddress = "Masuk Gumbira Park / Kampus C UISI, Jl. Siti Fatimah Binti Maimun, Jarangkuwung, Tlogopojok, Kec. Gresik, Kabupaten Gresik, Jawa Timur 61121",
}: ReceiptDialogProps) {
  const change = amountPaid - total;
  const date = new Date().toLocaleString("id-ID");
  const paymentMethodLabel = {
    cash: "Tunai",
    qris: "QRIS",
  }[paymentMethod] ?? paymentMethod;
  const [printSelection, setPrintSelection] = useState<PrintWorkflowState | null>(null);

  const executePrint = (target: PrintTarget) => {
    const targets: Array<"cashier" | "kitchen"> = target === "both"
      ? ["cashier", "kitchen"]
      : [target];

    targets.forEach((mode, index) => {
      const printWindow = window.open(
        "",
        "_blank",
        "toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=420,height=820",
      );

      if (!printWindow) {
        if (index === 0) window.print();
        return;
      }

      printWindow.document.open();
      printWindow.document.write(receiptMarkup[mode]);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
        setTimeout(() => printWindow.close(), 500);
      }, 300 + index * 350);
    });

    setPrintSelection(null);
  };

  const receiptMarkup = useMemo(() => {
    const cashierItems = items
      .map(
        (item) => `
          <div class="item-row">
            <div class="item-name">${item.quantity}x ${item.name}</div>
            <div class="item-total">${formatCurrency(item.price * item.quantity)}</div>
          </div>
        `,
      )
      .join("");

    const kitchenItems = items
      .map(
        (item) => `
          <div class="item-row">
            <div class="item-name">${item.quantity}x ${item.name}</div>
          </div>
        `,
      )
      .join("");

    const buildHtml = (mode: "cashier" | "kitchen") => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>${mode === "cashier" ? "Struk Kasir" : "Struk Kitchen"}</title>
          <style>
            @page {
              size: 58mm auto;
              margin: 4mm;
            }

            * { box-sizing: border-box; }

            html, body {
              margin: 0;
              padding: 0;
              background: #fff;
              color: #111;
              font-family: "Segoe UI", Arial, sans-serif;
            }

            body {
              width: 58mm;
              min-height: 100vh;
              padding: 0;
              margin: 0;
            }

            .receipt {
              width: 100%;
              padding: 10px 8px 12px;
              background: #fff;
            }

            .store-logo {
              width: 42px;
              height: 42px;
              border-radius: 50%;
              margin: 0 auto 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              line-height: 1;
              text-align: center;
              font-size: 8px;
              font-weight: 700;
              font-family: Georgia, "Times New Roman", serif;
              font-style: italic;
              color: #fff;
              background: radial-gradient(circle at 30% 30%, #d4202b, #a10f19 58%, #6c0b13 100%);
              border: 2px solid rgba(255,255,255,0.8);
              box-shadow: 0 8px 14px rgba(0,0,0,0.1);
            }

            .store-name {
              text-align: center;
              font-size: 17px;
              font-weight: 700;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }

            .store-subtitle,
            .store-address {
              text-align: center;
              font-size: 9px;
              color: #555;
              margin-bottom: 8px;
              line-height: 1.3;
            }

            .divider {
              border-top: 1px dashed #000;
              margin: 8px 0;
            }

            .meta-row,
            .item-row,
            .summary-row {
              display: flex;
              justify-content: space-between;
              gap: 8px;
              align-items: flex-start;
            }

            .meta-row {
              font-size: 10px;
              line-height: 1.4;
              margin: 3px 0;
            }

            .label { color: #444; }

            .item-row {
              font-size: 10px;
              margin: 4px 0;
            }

            .item-name {
              flex: 1;
              word-break: break-word;
              white-space: normal;
            }

            .item-total {
              text-align: right;
              white-space: nowrap;
            }

            .summary-row {
              font-size: 11px;
              margin-top: 5px;
              font-weight: 700;
            }

            .thank-you {
              margin-top: 12px;
              text-align: center;
              font-size: 10px;
              font-weight: 600;
              letter-spacing: 0.2px;
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="store-logo">Gumbira<br />Loka</div>
            <div class="store-name">${storeName}</div>
            <div class="store-subtitle">${mode === "cashier" ? "Terima kasih atas kunjungan Anda" : "Kitchen Copy"}</div>
            <div class="store-address">${storeAddress}</div>

            <div class="meta-row"><span class="label">ID Transaksi</span><span>${transactionId}</span></div>
            <div class="meta-row"><span class="label">Tanggal</span><span>${date}</span></div>
            <div class="meta-row"><span class="label">Tipe</span><span>${orderType}</span></div>
            ${mode === "cashier" ? `<div class="meta-row"><span class="label">Bayar</span><span>${paymentMethodLabel}</span></div>` : ""}

            <div class="divider"></div>

            ${mode === "cashier" ? cashierItems : kitchenItems}

            ${mode === "cashier" ? `
              <div class="divider"></div>
              <div class="summary-row"><span class="label">Total</span><span>${formatCurrency(total)}</span></div>
              <div class="summary-row"><span class="label">Dibayar</span><span>${formatCurrency(amountPaid)}</span></div>
              <div class="summary-row"><span class="label">Kembalian</span><span>${formatCurrency(change)}</span></div>
            ` : ""}

            <div class="thank-you">${mode === "cashier" ? "Terima kasih" : "Kitchen"}</div>
          </div>
        </body>
      </html>
    `;

    return {
      cashier: buildHtml("cashier"),
      kitchen: buildHtml("kitchen"),
    };
  }, [amountPaid, change, date, items, orderType, paymentMethodLabel, storeAddress, storeName, total, transactionId]);

  const handlePrint = (target: PrintTarget) => {
    setPrintSelection(target);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            Pembayaran Berhasil
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID Transaksi</span>
              <span>{transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tanggal</span>
              <span>{date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tipe Pesanan</span>
              <span>{orderType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Metode Pembayaran</span>
              <span>{paymentMethodLabel}</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Daftar Produk</p>
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm py-1">
                <span>{item.quantity}x {item.name}</span>
                <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
            {paymentMethod === "cash" ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dibayar</span>
                  <span>Rp {amountPaid.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kembalian</span>
                  <span>Rp {change.toLocaleString('id-ID')}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dibayar</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
            )}
          </div>
        </div>

        {printSelection === "select" ? (
          <div className="space-y-3 print:hidden">
            <div className="rounded-xl border border-border bg-muted/40 p-3">
              <p className="text-sm font-semibold text-foreground">Pilih tujuan cetak</p>
              <p className="mt-1 text-xs text-muted-foreground">Pilih satu atau dua struk sesuai kebutuhan outlet.</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="h-auto flex-col gap-1 px-2 py-3" onClick={() => handlePrint("cashier")}>
                <span className="text-sm font-semibold">Kasir</span>
                <span className="text-[10px] text-muted-foreground">1 lembar</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-1 px-2 py-3" onClick={() => handlePrint("kitchen")}>
                <span className="text-sm font-semibold">Kitchen</span>
                <span className="text-[10px] text-muted-foreground">1 lembar</span>
              </Button>
              <Button className="h-auto flex-col gap-1 px-2 py-3" onClick={() => handlePrint("both")}>
                <span className="text-sm font-semibold">Keduanya</span>
                <span className="text-[10px] opacity-80">2 lembar</span>
              </Button>
            </div>

            <Button variant="ghost" className="w-full" onClick={() => setPrintSelection(null)}>
              Batal
            </Button>
          </div>
        ) : printSelection === "cashier" || printSelection === "kitchen" || printSelection === "both" ? (
          <div className="space-y-3 print:hidden">
            <div className="rounded-xl border border-border bg-muted/40 p-3">
              <p className="text-sm font-semibold text-foreground">Konfirmasi cetak</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {printSelection === "cashier" && "Cetak struk untuk kasir."}
                {printSelection === "kitchen" && "Cetak struk untuk kitchen."}
                {printSelection === "both" && "Cetak 2 lembar: kasir dan kitchen."}
              </p>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => executePrint(printSelection)}>
                Cetak Sekarang
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setPrintSelection("select")}>
                Pilih Lagi
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" className="flex-1 gap-2" onClick={() => setPrintSelection("select")}>
              <Printer className="h-4 w-4" />
              Cetak
            </Button>
            <Button className="flex-1" onClick={() => {
              onNewTransaction();
              onOpenChange(false);
            }}>
              Transaksi Baru
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
