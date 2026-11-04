'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FiAlertCircle, FiArrowLeft, FiCheckCircle, FiExternalLink, FiFileText, FiMail,
  FiPhone, FiRefreshCw, FiSend, FiUser,
} from 'react-icons/fi';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { statusBadgeVariant } from '@/lib/request-ui';
import { cn } from '@/lib/utils';
import { errorMessage } from '@/types/api';
import { REQUEST_STATUSES, SERVICE_TYPES, type RequestDTO, type RequestStatus } from '@/types/request';

const DECISION_STATUSES = REQUEST_STATUSES.filter((s) => s !== 'Pending');

async function fetchRequests(): Promise<RequestDTO[]> {
  const res = await fetch('/api/requests', { cache: 'no-store' });
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(result.error || 'Could not load requests.');
  return result.data || [];
}

interface RequestsViewProps {
  initialStatus: RequestStatus;
  initialService: string;
  initialQuery: string;
}

export default function RequestsView({ initialStatus, initialService, initialQuery }: RequestsViewProps) {
  const [allRequests, setAllRequests] = useState<RequestDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [currentStatusTab, setCurrentStatusTab] = useState<string>(initialStatus);
  const [serviceFilter, setServiceFilter] = useState(initialService);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const [activeRequest, setActiveRequest] = useState<RequestDTO | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyStatus, setReplyStatus] = useState<string>('In Review');
  const [replyFile, setReplyFile] = useState<File | null>(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [dialogError, setDialogError] = useState('');

  useEffect(() => {
    let active = true;
    fetchRequests()
      .then((data) => active && setAllRequests(data))
      .catch((err) => active && setLoadError(errorMessage(err)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const reload = () => {
    setLoading(true);
    setLoadError('');
    fetchRequests()
      .then(setAllRequests)
      .catch((err) => setLoadError(errorMessage(err)))
      .finally(() => setLoading(false));
  };

  const openDecision = (req: RequestDTO) => {
    setActiveRequest(req);
    setReplyStatus(req.status === 'Pending' ? 'In Review' : req.status);
    setReplyMessage(req.adminReply?.message || '');
    setReplyFile(null);
    setDialogError('');
  };

  const submitDecision = async () => {
    if (!activeRequest) return;
    setIsSubmittingReply(true);
    setDialogError('');

    try {
      let uploadedAdminDoc = { name: '', url: '' };
      if (replyFile) {
        const uploadPayload = new FormData();
        uploadPayload.append('file', replyFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadPayload });
        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok || !uploadResult.success) throw new Error(uploadResult.error || 'File upload failed.');
        uploadedAdminDoc = { name: uploadResult.name || replyFile.name, url: uploadResult.fileUrl || uploadResult.url };
      }

      const response = await fetch('/api/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: activeRequest._id,
          status: replyStatus,
          adminMessage: replyMessage,
          adminDocument: uploadedAdminDoc.url ? uploadedAdminDoc : undefined,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || result.message || 'Update failed.');

      setAllRequests((prev) =>
        prev.map((item) =>
          item._id === activeRequest._id
            ? {
                ...item,
                status: replyStatus,
                adminReply: {
                  message: replyMessage,
                  document: uploadedAdminDoc.url ? uploadedAdminDoc : item.adminReply?.document,
                },
              }
            : item
        )
      );
      setNotice({ ok: true, text: `Request marked as ${replyStatus}.` });
      setActiveRequest(null);
    } catch (err) {
      setDialogError(errorMessage(err));
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const displayedRequests = allRequests.filter((req) => {
    const matchesStatus = (req.status || 'Pending') === currentStatusTab;
    const matchesService = serviceFilter === 'ALL' || req.serviceType === serviceFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      [req.userName, req.userPhone, req.userEmail, req._id].some((v) => v?.toLowerCase().includes(q));
    return matchesStatus && matchesService && matchesSearch;
  });

  const countByStatus = (statusName: string) => allRequests.filter((r) => (r.status || 'Pending') === statusName).length;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" aria-label="Back to overview" className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'size-9')}>
            <FiArrowLeft size={16} />
          </Link>
          <div>
            <p className="text-xs font-bold tracking-wider text-primary uppercase">Super admin panel</p>
            <h1 className="text-2xl font-black tracking-tight">Requests Desk</h1>
          </div>
        </div>
        <Button type="button" onClick={reload} disabled={loading} className="self-start sm:self-auto">
          <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Sync
        </Button>
      </div>

      {notice && (
        <div
          role="status"
          className={cn(
            'flex items-center gap-2 rounded-xl border p-3 text-sm font-semibold',
            notice.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'
          )}
        >
          {notice.ok ? <FiCheckCircle /> : <FiAlertCircle />} {notice.text}
        </div>
      )}
      {loadError && (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
          <FiAlertCircle /> {loadError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {REQUEST_STATUSES.map((status) => {
          const selected = currentStatusTab === status;
          return (
            <Button
              key={status}
              type="button"
              variant={selected ? 'default' : 'outline'}
              onClick={() => setCurrentStatusTab(status)}
              className="h-auto justify-between px-4 py-3"
            >
              <span className="text-xs uppercase">{status}</span>
              <Badge variant={selected ? 'secondary' : 'outline'}>{countByStatus(status)}</Badge>
            </Button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing <strong className="text-foreground">{displayedRequests.length}</strong> in {currentStatusTab}
        </p>
        <Input type="search" aria-label="Search requests" placeholder="Search name, phone, email or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full sm:max-w-xs" />
        <NativeSelect aria-label="Filter by service" value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="w-full sm:w-64">
          <option value="ALL">All services</option>
          {SERVICE_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </NativeSelect>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : displayedRequests.length === 0 ? (
        <Card className="items-center gap-2 p-14 text-center">
          <FiFileText className="size-10 text-muted-foreground/50" />
          <h3 className="text-sm font-bold">No requests in {currentStatusTab}</h3>
          <p className="text-xs text-muted-foreground">Nothing matches this tab and service filter.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayedRequests.map((req) => (
            <Card key={req._id} className="gap-4 p-5">
              <div className="flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="uppercase">{req.serviceType}</Badge>
                  <Badge variant={statusBadgeVariant(req.status || 'Pending')}>{req.status || 'Pending'}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleString('en-IN')}</span>
                </div>
                <Button type="button" size="sm" onClick={() => openDecision(req)}>
                  <FiSend /> Respond / Decide
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-12">
                <div className="space-y-2 rounded-xl border bg-muted/30 p-4 md:col-span-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase">Client</p>
                  <p className="flex items-center gap-2 font-bold"><FiUser className="text-primary" /> {req.userName || 'Anonymous'}</p>
                  <p className="flex items-center gap-2 font-mono text-xs break-all"><FiMail className="shrink-0 text-muted-foreground" /> {req.userEmail || 'N/A'}</p>
                  {req.userPhone && <p className="flex items-center gap-2 font-mono text-xs"><FiPhone className="shrink-0 text-muted-foreground" /> {req.userPhone}</p>}
                </div>

                <div className="space-y-3 rounded-xl border bg-muted/30 p-4 md:col-span-8">
                  <p className="text-xs font-bold text-muted-foreground uppercase">Details</p>
                  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {([
                      ['Owner name', req.details?.ownerName],
                      ['Location / Khasra', req.details?.propertyLocation],
                      ['Bank', req.details?.bankName],
                      ['Loan amount', req.details?.loanAmount ? `₹${req.details.loanAmount.toLocaleString('en-IN')}` : undefined],
                      ['Monthly income', req.details?.monthlyIncome ? `₹${req.details.monthlyIncome.toLocaleString('en-IN')}` : undefined],
                      ['Rejection reason', req.details?.rejectionReason],
                      ['PAN', req.details?.panNumber],
                      ['Date of birth', req.details?.dateOfBirth],
                      ['Services', req.details?.selectedServices?.join(', ')],
                      ['Remarks', req.details?.customMessage],
                    ] as const)
                      .filter(([, value]) => Boolean(value))
                      .map(([label, value]) => (
                        <div key={label}>
                          <dt className="text-[11px] font-bold text-muted-foreground uppercase">{label}</dt>
                          <dd className="font-semibold break-words">{value}</dd>
                        </div>
                      ))}
                  </dl>

                  {req.documentsList && req.documentsList.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 border-t pt-3">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Papers ({req.documentsList.length})</span>
                      {req.documentsList.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'max-w-full')}
                        >
                          <FiFileText />
                          <span className="max-w-32.5 truncate">{doc.name || 'Document'}</span>
                          <FiExternalLink />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {req.adminReply?.message && (
                <div className="space-y-2 rounded-xl border border-primary/20 bg-accent p-4">
                  <p className="text-xs font-bold text-accent-foreground uppercase">Response sent to client</p>
                  <p className="text-sm font-medium">“{req.adminReply.message}”</p>
                  {req.adminReply.document?.url && (
                    <a href={req.adminReply.document.url} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: 'sm' })}>
                      <FiFileText /> View sent document <FiExternalLink />
                    </a>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={activeRequest !== null} onOpenChange={(open) => !open && !isSubmittingReply && setActiveRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decision for {activeRequest?.userName || 'client'}</DialogTitle>
            <DialogDescription>
              {activeRequest?.serviceType}. The client is notified of the new status and your message.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <FormField label="Target status">
              <NativeSelect value={replyStatus} onChange={(e) => setReplyStatus(e.target.value)}>
                {DECISION_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </NativeSelect>
            </FormField>

            <FormField label="Attach document (PDF / image, optional)">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setReplyFile(e.target.files?.[0] ?? null)}
                className="w-full cursor-pointer rounded-lg border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-xs file:font-semibold"
              />
            </FormField>

            <FormField label="Message to client">
              <Textarea rows={4} placeholder="Write guidance for the client..." value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} />
            </FormField>

            {dialogError && (
              <p role="alert" className="flex items-center gap-2 text-sm font-semibold text-rose-700">
                <FiAlertCircle /> {dialogError}
              </p>
            )}
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" disabled={isSubmittingReply} />}>Cancel</DialogClose>
            <Button
              type="button"
              variant={replyStatus === 'Rejected' ? 'destructive' : 'default'}
              disabled={isSubmittingReply}
              onClick={submitDecision}
            >
              {isSubmittingReply ? 'Processing...' : `Confirm ${replyStatus}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
