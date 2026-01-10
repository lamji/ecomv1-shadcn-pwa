'use client';

import React from 'react';
import dataJson from '@/lib/data/transactionResponseApi.json';
import { TransactionsApiResponse } from '@/types/transactions';
import {
  ArrowDownRight,
  Banknote,
  Receipt,
  X,
  ChevronRight,
  Copy,
  ChevronLeft,
} from 'lucide-react';
import { formatCurrency } from '@/lib/helper/currency';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

const api: TransactionsApiResponse = dataJson as unknown as TransactionsApiResponse;

export default function Notification() {
  const items = React.useMemo(() => api.data ?? [], []);
  // Track read/unread transaction IDs
  const [readIds, setReadIds] = React.useState<Set<string>>(new Set());
  const [filter, setFilter] = React.useState<'all' | 'unread' | 'read'>('all');
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<(typeof items)[number] | null>(null);
  const router = useRouter();

  // Close on Escape key
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Load read state from localStorage on mount
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('tx_read_ids');
      if (raw) {
        const arr: string[] = JSON.parse(raw);
        setReadIds(new Set(arr));
      }
    } catch {}
  }, []);

  // Persist readIds when it changes
  React.useEffect(() => {
    try {
      localStorage.setItem('tx_read_ids', JSON.stringify(Array.from(readIds)));
    } catch {}
  }, [readIds]);

  const isRead = React.useCallback((id?: string) => (id ? readIds.has(id) : false), [readIds]);
  const markRead = React.useCallback((id?: string) => {
    if (!id) return;
    setReadIds(prev => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  // Derived lists and counts
  const unreadCount = React.useMemo(() => items.filter(t => !isRead(t.id)).length, [items, isRead]);
  const readCount = React.useMemo(() => items.filter(t => isRead(t.id)).length, [items, isRead]);
  const filtered = React.useMemo(() => {
    if (filter === 'unread') return items.filter(t => !isRead(t.id));
    if (filter === 'read') return items.filter(t => isRead(t.id));
    return items;
  }, [items, filter, isRead]);

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-8">
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" aria-label="Back" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Transactions</h1>
        </div>
        {/* Filters */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'all' ? 'text-white' : undefined}
            onClick={() => setFilter('all')}
          >
            All ({items.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'unread' ? 'text-white' : undefined}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </Button>
          <Button
            variant={filter === 'read' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'read' ? 'text-white' : undefined}
            onClick={() => setFilter('read')}
          >
            Read ({readCount})
          </Button>
        </div>
      </div>

      {/* Mobile e-wallet style list */}
      <div className="bg-background ring-border/50 overflow-hidden rounded-xl ring-1">
        <ul className="divide-y">
          {filtered.map(t => {
            const bank = t.details?.debt?.bankName ?? 'Unknown Bank';
            const amount = formatCurrency(t.amount);
            const ref = t.details?.bankReference ?? '-';
            // Normalize status from API (e.g., "completed" -> treat as success for UI styling)
            const normalizedStatus = t.status === 'completed' ? 'success' : t.status;
            const read = isRead(t.id);
            const badgeBg =
              t.type === 'payment'
                ? 'bg-emerald-100 text-emerald-700'
                : t.type === 'loan'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700';
            const TypeIcon =
              t.type === 'payment' ? ArrowDownRight : t.type === 'loan' ? Banknote : Receipt;
            const amtColor =
              t.type === 'payment'
                ? 'text-emerald-600'
                : t.type === 'loan'
                  ? 'text-blue-600'
                  : 'text-foreground';
            const statusClasses =
              normalizedStatus === 'success'
                ? 'bg-emerald-100 text-emerald-700'
                : normalizedStatus === 'pending'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-rose-100 text-rose-700';
            const dateStr = t.transactionDate
              ? new Date(t.transactionDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                })
              : '-';
            return (
              <li key={t.id}>
                <button
                  type="button"
                  className={`hover:bg-accent/40 flex w-full items-center justify-between gap-3 px-4 py-3.5 transition sm:py-4 ${
                    read ? '' : 'bg-accent/20'
                  }`}
                  onClick={() => {
                    setSelected(t);
                    setOpen(true);
                    // Mark as read when opening
                    markRead(t.id);
                  }}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${badgeBg}`}
                    >
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-left text-sm font-medium sm:text-base">{bank}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-muted-foreground truncate text-left text-xs">
                          {dateStr}
                        </p>
                        {!read && (
                          <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                        )}
                        <span
                          className={`inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${statusClasses}`}
                        >
                          {t.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-right">
                    <div>
                      <div className={`text-sm font-semibold ${amtColor}`}>{amount}</div>
                      <div className="text-muted-foreground font-mono text-[10px] sm:text-xs">
                        {ref}
                      </div>
                    </div>
                    <ChevronRight className="text-muted-foreground xs:block hidden h-4 w-4" />
                  </div>
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li>
              <div className="text-muted-foreground py-8 text-center">No transactions found</div>
            </li>
          )}
        </ul>
      </div>

      {/* Details Modal */}
      {open && selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center md:items-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <Card className="relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-2xl p-0 shadow-xl md:max-w-lg md:rounded-2xl">
            <CardHeader
              className={`supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b py-3 backdrop-blur ${
                selected.type === 'payment'
                  ? 'bg-emerald-50'
                  : selected.type === 'loan'
                    ? 'bg-rose-50'
                    : 'bg-gray-50'
              }`}
            >
              <CardTitle className="text-base sm:text-lg">Transaction Details</CardTitle>
              <CardAction>
                <Button variant="ghost" size="sm" aria-label="Close" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-4 py-4">
              {/* Amount and Type */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-muted-foreground text-xs">Amount</p>
                  <p className="text-2xl leading-tight font-semibold sm:text-3xl">
                    {formatCurrency(selected.amount)}
                  </p>
                </div>
              </div>

              {/* Bank and Reference */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-xs">Bank</p>
                  <p className="font-medium">{selected.details?.debt?.bankName ?? '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Type</p>
                  <p className="font-medium">{selected.type ?? '-'}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-muted-foreground text-xs">Reference</p>
                      <p className="font-mono text-sm break-all">
                        {selected.details?.bankReference ?? '-'}
                      </p>
                    </div>
                    {selected.details?.bankReference && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigator.clipboard.writeText(selected.details!.bankReference!)
                        }
                        className="shrink-0"
                        title="Copy"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-xs">Payment Method</p>
                  <p className="font-medium">{selected.details?.paymentMethod ?? '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize ${
                      selected.status === 'success' || selected.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : selected.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {selected.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="border-t pt-4">
                <p className="text-muted-foreground text-xs">Description</p>
                <p className="text-sm whitespace-pre-wrap">{selected.description ?? '-'}</p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-xs">Transaction Date</p>
                  <p className="font-medium">
                    {selected.transactionDate
                      ? new Date(selected.transactionDate).toLocaleString()
                      : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
