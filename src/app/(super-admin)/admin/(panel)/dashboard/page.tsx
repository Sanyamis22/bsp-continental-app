'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiActivity, FiAlertCircle, FiBriefcase, FiCalendar, FiEye, FiFileText, FiRefreshCw, FiSearch, FiShield, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/ui/stat-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { statusBadgeVariant } from '@/lib/request-ui';
import { cn } from '@/lib/utils';
import { useRequests } from '@/hooks/queries';
import type { RequestDTO } from '@/types/request';

type ChartMetric = 'total' | 'cibil' | 'property';

const isCibil = (r: RequestDTO) => r.serviceType === 'CIBIL Audit';
const isProperty = (r: RequestDTO) => r.serviceType === 'Property Vetting';
const dayKey = (iso: string) => new Date(iso || Date.now()).toISOString().split('T')[0];

const FILTERS = [
  { id: 'ALL', label: 'All files' },
  { id: 'CIBIL', label: 'CIBIL' },
  { id: 'PROPERTY', label: 'Property' },
] as const;

export default function AdminDashboardAnalytics() {
  const router = useRouter();
  const { data: requests = [], isLoading, isFetching, error: loadError, refetch } = useRequests("admin");
  const error = loadError instanceof Error ? loadError.message : '';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]['id']>('ALL');
  const [chartMetric, setChartMetric] = useState<ChartMetric>('total');
  const [selectedRecord, setSelectedRecord] = useState<RequestDTO | null>(null);
  const reload = () => refetch();

  const metrics = useMemo(() => {
    const today = dayKey(new Date().toISOString());
    return {
      total: requests.length,
      today: requests.filter((r) => dayKey(r.createdAt) === today).length,
      cibil: requests.filter(isCibil).length,
      property: requests.filter(isProperty).length,
      other: requests.filter((r) => !isCibil(r) && !isProperty(r)).length,
    };
  }, [requests]);

  const chartData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().split('T')[0];
      const day = requests.filter((r) => dayKey(r.createdAt) === key);
      return {
        key,
        label: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
        total: day.length,
        cibil: day.filter(isCibil).length,
        property: day.filter(isProperty).length,
      };
    });
  }, [requests]);

  const maxChartVal = Math.max(5, ...chartData.map((d) => d[chartMetric]));

  const filteredRequests = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return requests.filter((item) => {
      const matchesSearch =
        item.userName?.toLowerCase().includes(q) ||
        item.userPhone?.includes(searchQuery) ||
        item.userEmail?.toLowerCase().includes(q) ||
        item._id?.toLowerCase().includes(q);
      if (!matchesSearch) return false;
      if (activeFilter === 'CIBIL') return isCibil(item);
      if (activeFilter === 'PROPERTY') return isProperty(item);
      return true;
    });
  }, [requests, searchQuery, activeFilter]);

  const ratio = (n: number) => (metrics.total ? Math.round((n / metrics.total) * 100) : 0);
  const ratioRows = [
    { label: 'CIBIL audits', count: metrics.cibil, bar: 'bg-blue-600' },
    { label: 'Property vetting', count: metrics.property, bar: 'bg-amber-500' },
    { label: 'Loan / other', count: metrics.other, bar: 'bg-primary' },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <FiActivity size={22} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight">Control Hub</h1>
              <Badge variant="warning">{metrics.today} new today</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Live view of every service request.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" onClick={() => router.push('/admin/dashboard/leads')}>
            <FiUsers /> Leads
          </Button>
          <Button type="button" variant="outline" onClick={reload} disabled={isFetching}>
            <FiRefreshCw className={isFetching ? 'animate-spin' : ''} /> Sync
          </Button>
        </div>
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
          <FiAlertCircle /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today / Total" value={`${metrics.today} / ${metrics.total}`} icon={<FiCalendar />} tone="slate" />
        <StatCard label="CIBIL checks" value={metrics.cibil} icon={<FiShield />} />
        <StatCard label="Property vetting" value={metrics.property} icon={<FiFileText />} tone="amber" />
        <StatCard label="Loan / other" value={metrics.other} icon={<FiBriefcase />} tone="slate" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-sm uppercase">Service volume</CardTitle>
            <CardDescription>Share of all requests by service.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ratioRows.map((row) => (
              <div key={row.label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span>{row.label}</span>
                  <span className="font-mono">{ratio(row.count)}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className={cn('h-full rounded-full transition-all duration-500', row.bar)} style={{ width: `${ratio(row.count)}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-8">
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2 text-sm uppercase">
                <FiTrendingUp className="text-primary" /> 7-day activity
              </CardTitle>
              <CardDescription>Requests received per day.</CardDescription>
            </div>
            <div className="flex gap-1">
              {([['total', 'All'], ['cibil', 'CIBIL'], ['property', 'Property']] as const).map(([id, label]) => (
                <Button key={id} type="button" size="sm" variant={chartMetric === id ? 'default' : 'outline'} onClick={() => setChartMetric(id)}>
                  {label}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative flex h-48 items-end justify-between gap-2 px-2 pt-6">
              <span className="absolute inset-x-0 top-0 border-b border-dashed font-mono text-[10px] text-muted-foreground">Max: {maxChartVal}</span>
              {chartData.map((day, idx) => {
                const val = day[chartMetric];
                const height = Math.max(Math.round((val / maxChartVal) * 100), 8);
                return (
                  <div key={day.key} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5" title={`${day.label}: ${val} requests`}>
                    <span className="font-mono text-[11px] font-bold">{val}</span>
                    <div className="flex h-full w-full max-w-8 items-end overflow-hidden rounded-xl bg-muted p-0.5">
                      <motion.div
                        initial={{ height: '0%' }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.4, delay: idx * 0.04 }}
                        className={cn('w-full rounded-lg', chartMetric === 'cibil' ? 'bg-blue-600' : chartMetric === 'property' ? 'bg-amber-500' : 'bg-primary')}
                      />
                    </div>
                    <span className="truncate text-[11px] font-semibold text-muted-foreground">{day.label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center">
        <div className="relative w-full md:max-w-sm">
          <FiSearch aria-hidden className="pointer-events-none absolute top-3 left-3 text-sm text-muted-foreground" />
          <Input type="search" aria-label="Search requests" placeholder="Search name, phone, email or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1.5">
          {FILTERS.map((tab) => (
            <Button key={tab.id} type="button" size="sm" variant={activeFilter === tab.id ? 'default' : 'outline'} onClick={() => setActiveFilter(tab.id)}>
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <Card className="gap-0 overflow-hidden py-0">
        {isLoading ? (
          <div className="space-y-3 p-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-6">Applicant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="pr-6 text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-10 text-center text-muted-foreground">No matching requests.</TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((req) => (
                  <TableRow key={req._id}>
                    <TableCell className="pl-6">
                      <p className="font-bold">{req.userName || 'Anonymous'}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">#{req._id?.substring(18)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-mono text-xs font-semibold">{req.userPhone || 'N/A'}</p>
                      <p className="max-w-35 truncate font-mono text-[10px] text-muted-foreground">{req.userEmail}</p>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="uppercase">{req.serviceType}</Badge></TableCell>
                    <TableCell><Badge variant={statusBadgeVariant(req.status || 'Pending')}>{req.status || 'Pending'}</Badge></TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button type="button" variant="outline" size="icon" className="size-9" aria-label={`View ${req.userName || 'request'}`} onClick={() => setSelectedRecord(req)}>
                        <FiEye size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={selectedRecord !== null} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent>
          {selectedRecord && (
            <>
              <DialogHeader>
                <DialogTitle>File details</DialogTitle>
                <DialogDescription className="font-mono">ID: {selectedRecord._id}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 rounded-xl border bg-muted/30 p-3 text-sm">
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase">Client</p>
                  <p className="font-bold">{selectedRecord.userName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase">Contact</p>
                  <p className="truncate font-mono text-xs font-semibold">{selectedRecord.userPhone || selectedRecord.userEmail}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-muted-foreground uppercase">Submitted details</p>
                <pre className="max-h-40 overflow-auto rounded-xl border bg-background p-2.5 font-mono text-[11px] text-primary">
                  {JSON.stringify(selectedRecord.details ?? {}, null, 2)}
                </pre>
              </div>
              <DialogClose render={<Button variant="outline" className="w-full" />}>Close</DialogClose>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
