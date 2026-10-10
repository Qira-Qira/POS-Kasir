import { Banknote, Calculator, Lock, Unlock } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import type { ShiftSession } from "../types";

interface ShiftState {
  status: "OPEN" | "CLOSED";
  startingCash: number;
  cashSales: number;
  pettyCashOut: number;
  cashIn: number;
  expectedCash: number;
  actualCash: number;
  difference: number;
  openedAt: string | null;
}

interface ShiftViewProps {
  shiftState: ShiftState;
  shiftHistory?: ShiftSession[];
  cashSalesTotal: number;
  formatCurrency: (value: number) => string;
  onOpenShift: (amount: number) => void;
  onCloseShift: (
    amount: number,
    movements?: { pettyCashOut?: number; cashIn?: number; note?: string }
  ) => void;
}

export function ShiftView({
  shiftState,
  shiftHistory = [],
  cashSalesTotal,
  formatCurrency,
  onOpenShift,
  onCloseShift,
}: ShiftViewProps) {
  const [startingCashInput, setStartingCashInput] = useState("0");
  const [pettyCashOutInput, setPettyCashOutInput] = useState("0");
  const [cashInInput, setCashInInput] = useState("0");
  const [actualCashInput, setActualCashInput] = useState("0");
  const [closingNote, setClosingNote] = useState("");
  // empty string means "no filter" (show all)
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const expectedCashPreview = useMemo(() => {
    if (shiftState.status === "OPEN") {
      const pettyCashOut = Number(pettyCashOutInput || 0);
      const cashIn = Number(cashInInput || 0);
      return shiftState.startingCash + cashSalesTotal + cashIn - pettyCashOut;
    }
    return shiftState.expectedCash;
  }, [cashInInput, cashSalesTotal, pettyCashOutInput, shiftState.expectedCash, shiftState.startingCash, shiftState.status]);

  const differencePreview = useMemo(() => {
    return Number(actualCashInput || 0) - expectedCashPreview;
  }, [actualCashInput, expectedCashPreview]);

  const isOpen = shiftState.status === "OPEN";

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-hidden sm:gap-5">
      <div className="rounded-[22px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)] sm:rounded-[24px] sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
              {isOpen ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            </div>
            <h3 className="text-base font-semibold text-[#2b1d18] sm:text-lg">
              {isOpen ? "Shift Aktif" : "Buka Shift"}
            </h3>
          </div>
          <span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${isOpen ? "bg-[#edf3ef] text-[#2d5b45]" : "bg-[#f8d7d7] text-[#9b3b34]"}`}>
            {shiftState.status}
          </span>
        </div>

        {!isOpen ? (
          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#4d382f]">Uang modal awal</label>
              <div className="relative">
                <Banknote className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a6a52]" />
                <Input
                  type="number"
                  min="0"
                  step="100"
                  value={startingCashInput === "0" ? "" : startingCashInput}
                  onChange={(event) => setStartingCashInput(event.target.value)}
                  placeholder="0"
                  className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] pl-10 text-[#2b1d18] placeholder:text-[#9a8479]"
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={() => {
                const amount = Number(startingCashInput);
                if (!Number.isFinite(amount) || amount < 0) return;
                onOpenShift(amount);
              }}
              className="w-full rounded-2xl bg-[#7c4a2d] text-[#fffaf5] hover:bg-[#6d3f2a]"
            >
              Buka Shift
            </Button>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-2xl bg-[#f8f0e7] p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#8d6d5a]">Kas awal</p>
                <p className="mt-2 text-lg font-semibold text-[#2b1d18]">{formatCurrency(shiftState.startingCash)}</p>
              </div>
              <div className="rounded-2xl bg-[#f8f0e7] p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#8d6d5a]">Penjualan tunai</p>
                <p className="mt-2 text-lg font-semibold text-[#2b1d18]">{formatCurrency(cashSalesTotal)}</p>
              </div>
              <div className="rounded-2xl bg-[#f8f0e7] p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#8d6d5a]">Kas masuk</p>
                <p className="mt-2 text-lg font-semibold text-[#2b1d18]">{formatCurrency(Number(cashInInput || 0))}</p>
              </div>
              <div className="rounded-2xl bg-[#f8f0e7] p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#8d6d5a]">Petty cash</p>
                <p className="mt-2 text-lg font-semibold text-[#2b1d18]">{formatCurrency(Number(pettyCashOutInput || 0))}</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4d382f]">Kas masuk tambahan</label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a6a52]" />
                  <Input
                    type="number"
                    min="0"
                    step="100"
                    value={cashInInput === "0" ? "" : cashInInput}
                    onChange={(event) => setCashInInput(event.target.value)}
                    placeholder="0"
                    className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] pl-10 text-[#2b1d18] placeholder:text-[#9a8479]"
                  />
                </div>
                <p className="mt-1 text-xs text-[#5d4235]">Masukkan jumlah kas yang dimasukkan ke laci (menambah kas akhir).</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#4d382f]">Pengeluaran petty cash</label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a6a52]" />
                  <Input
                    type="number"
                    min="0"
                    step="100"
                    value={pettyCashOutInput === "0" ? "" : pettyCashOutInput}
                    onChange={(event) => setPettyCashOutInput(event.target.value)}
                    placeholder="0"
                    className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] pl-10 text-[#2b1d18] placeholder:text-[#9a8479]"
                  />
                </div>
                <p className="mt-1 text-xs text-[#5d4235]">Masukkan pengeluaran kecil (mengurangi kas akhir).</p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#4d382f]">Hitungan uang fisik kasir</label>
              <div className="relative">
                <Calculator className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a6a52]" />
                <Input
                  type="number"
                  min="0"
                  step="100"
                  value={actualCashInput === "0" ? "" : actualCashInput}
                  onChange={(event) => setActualCashInput(event.target.value)}
                  placeholder="0"
                  className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] pl-10 text-[#2b1d18] placeholder:text-[#9a8479]"
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-[#f8f0e7] p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#8d6d5a]">Ekspektasi akhir</p>
                <p className="mt-2 text-lg font-semibold text-[#2b1d18]">{formatCurrency(expectedCashPreview)}</p>
              </div>
              <div className="rounded-2xl bg-[#f8f0e7] p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#8d6d5a]">Selisih</p>
                <p className={`mt-2 text-xl font-semibold ${differencePreview === 0 ? "text-[#2d5b45]" : differencePreview < 0 ? "text-[#9b3b34]" : "text-[#5d4235]"}`}>
                  {formatCurrency(differencePreview)}
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#4d382f]">Catatan penutupan shift</label>
              <textarea
                value={closingNote === "" ? "" : closingNote}
                onChange={(event) => setClosingNote(event.target.value)}
                rows={3}
                placeholder="Catatan audit: ada pengeluaran tambahan, cashback, atau selisih yang perlu dijelaskan..."
                className="w-full rounded-2xl border border-[#ebdcc7] bg-[#f9f2ea] px-3 py-2 text-sm text-[#2b1d18] outline-none placeholder:text-[#9a8479]"
              />
            </div>

            <Button
              type="button"
              onClick={() => {
                const amount = Number(actualCashInput);
                const pettyCashOut = Number(pettyCashOutInput || 0);
                const cashIn = Number(cashInInput || 0);
                if (!Number.isFinite(amount) || amount < 0) return;
                onCloseShift(amount, { pettyCashOut, cashIn, note: closingNote });
              }}
              className="w-full rounded-2xl bg-[#7c4a2d] text-[#fffaf5] hover:bg-[#6d3f2a]"
            >
              Tutup Shift
            </Button>
          </div>
        )}
      </div>

      {(shiftHistory.length > 0 || shiftState.status === "CLOSED") && (
        <div className="rounded-[22px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)] sm:rounded-[24px] sm:p-5">
          <h4 className="text-base font-semibold text-[#2b1d18]">Riwayat Shift</h4>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm text-[#5d4235]">Dari</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
                className="rounded-md border px-2 py-1"
              />
              <label className="text-sm text-[#5d4235]">Sampai</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
                className="rounded-md border px-2 py-1"
              />
            </div>

            <div className="flex items-center gap-3">
              <p className="text-sm text-[#5d4235]">Menampilkan:</p>
              <p className="text-sm font-semibold text-[#2b1d18]">{itemsPerPage} per halaman</p>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {(() => {
              const filtered = (fromDate && toDate)
                ? shiftHistory.filter((session) => {
                    const ts = session.closedAt ?? session.openedAt ?? null;
                    if (!ts) return false;
                    const start = new Date(fromDate + "T00:00:00");
                    const end = new Date(toDate + "T23:59:59.999");
                    const d = new Date(ts);
                    return d >= start && d <= end;
                  })
                : shiftHistory.slice();

              const total = filtered.length;
              const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
              const currentPage = Math.min(Math.max(1, page), totalPages);
              const pageSlice = filtered.slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage);

              return (
                <>
                  {pageSlice.map((session) => (
                    <div key={session.id} className="rounded-2xl border border-[#ebdcc7] bg-[#f8f0e7] p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-[#2b1d18]">
                          {session.closedAt ? new Date(session.closedAt).toLocaleString("id-ID") : "Shift belum ditutup"}
                        </p>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${session.difference === 0 ? "bg-[#edf3ef] text-[#2d5b45]" : session.difference < 0 ? "bg-[#f8d7d7] text-[#9b3b34]" : "bg-[#f3e9dc] text-[#5d4235]"}`}>
                          {session.difference === 0 ? "Seimbang" : session.difference < 0 ? "Kurang" : "Lebih"}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-[#5d4235]">
                        <p>Kas awal: {formatCurrency(session.startingCash)}</p>
                        <p>Actual: {formatCurrency(session.actualCash)} | Expected: {formatCurrency(session.expectedCash)}</p>
                        <p>Selisih: {formatCurrency(session.difference)}</p>
                        {session.note ? <p>Catatan: {session.note}</p> : null}
                      </div>
                    </div>
                  ))}

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm text-[#5d4235]">Total: {filtered.length} sesi</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="rounded-md border px-3 py-1 disabled:opacity-50"
                      >
                        Prev
                      </button>
                      <span className="text-sm">{currentPage} / {totalPages}</span>
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        className="rounded-md border px-3 py-1 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
