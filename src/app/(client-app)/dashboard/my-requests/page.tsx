'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FiAlertCircle, FiArrowLeft, FiExternalLink, FiFileText, FiRefreshCw } from 'react-icons/fi';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { statusBadgeVariant } from '@/lib/request-ui';
import { cn } from '@/lib/utils';
import { useRequests } from '@/hooks/queries';

export default function MyRequestsPage() {
  const { data: session } = useSession();
  const { data: requests = [], isLoading: loading, isFetching, error, refetch } = useRequests();
  const reload = () => refetch();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-8">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-muted-foreground')}>
          <FiArrowLeft /> Back to dashboard
        </Link>
        <Button type="button" variant="outline" size="sm" onClick={reload} disabled={isFetching}>
          <FiRefreshCw className={isFetching ? 'animate-spin' : ''} /> Refresh
        </Button>
      </div>

      <div className="border-b pb-4">
        <h1 className="text-2xl font-black tracking-tight">My Requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as <span className="font-semibold text-foreground">{session?.user?.email}</span>
        </p>
      </div>

      {error instanceof Error && (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
          <FiAlertCircle /> {error.message}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
      ) : requests.length === 0 ? (
        <Card className="items-center gap-3 p-14 text-center">
          <FiFileText className="size-10 text-muted-foreground/50" />
          <h2 className="text-sm font-bold">No requests yet</h2>
          <p className="text-xs text-muted-foreground">Submit a service request from the dashboard and it will appear here.</p>
          <Link href="/dashboard" className={buttonVariants({ size: 'sm' })}>Go to dashboard</Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req._id} className="gap-4 p-5">
              <div className="flex flex-col justify-between gap-2 border-b pb-3 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="uppercase">{req.serviceType}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
                <Badge variant={statusBadgeVariant(req.status || 'Pending')}>{req.status || 'Pending'}</Badge>
              </div>

              <dl className="grid grid-cols-1 gap-3 rounded-xl border bg-muted/30 p-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] font-bold text-muted-foreground uppercase">Applicant</dt>
                  <dd className="font-semibold">{req.userName || 'N/A'}</dd>
                </div>
                {req.details?.panNumber && (
                  <div>
                    <dt className="text-[11px] font-bold text-muted-foreground uppercase">PAN</dt>
                    <dd className="font-mono font-semibold">{req.details.panNumber}</dd>
                  </div>
                )}
                {req.details?.propertyLocation && (
                  <div>
                    <dt className="text-[11px] font-bold text-muted-foreground uppercase">Location</dt>
                    <dd className="font-semibold">{req.details.propertyLocation}</dd>
                  </div>
                )}
                {req.details?.bankName && (
                  <div>
                    <dt className="text-[11px] font-bold text-muted-foreground uppercase">Bank</dt>
                    <dd className="font-semibold">{req.details.bankName}</dd>
                  </div>
                )}
                {(req.details?.selectedServices?.length ?? 0) > 0 && (
                  <div className="col-span-full">
                    <dt className="text-[11px] font-bold text-muted-foreground uppercase">Requested services</dt>
                    <dd className="flex flex-wrap gap-1.5 pt-1">
                      {req.details?.selectedServices?.map((srv) => (
                        <Badge key={srv} variant="secondary">{srv}</Badge>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>

              {req.documentsList && req.documentsList.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase">Your uploaded papers ({req.documentsList.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {req.documentsList.map((doc) => (
                      <a key={`${req._id}-${doc.url ?? ""}-${doc.name ?? ""}`} href={doc.url} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                        <FiFileText />
                        <span className="max-w-37.5 truncate">{doc.name || 'Document'}</span>
                        <FiExternalLink />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {req.adminReply?.message && (
                <div className="space-y-2 rounded-xl border border-primary/20 bg-accent p-4">
                  <p className="text-xs font-bold text-accent-foreground uppercase">Response from our team</p>
                  <p className="text-sm font-medium">“{req.adminReply.message}”</p>
                  {req.adminReply.document?.url && (
                    <a href={req.adminReply.document.url} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: 'sm' })}>
                      <FiFileText /> View document <FiExternalLink />
                    </a>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
