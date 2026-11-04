'use client';

import { useMemo, useState } from 'react';
import { FiAlertCircle, FiInbox, FiMail, FiPhone, FiRefreshCw, FiSearch, FiUsers } from 'react-icons/fi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/ui/stat-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAdminUsers } from '@/hooks/queries';
import type { UserDTO } from '@/types/user';

const isAdminRole = (role?: string) => role === 'admin' || role === 'Admin' || role === 'Super Admin';

const joined = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

export default function AdminUsersPage() {
  const { data: users = [], isLoading, isFetching, error, refetch } = useAdminUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const reload = () => refetch();

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.phone?.includes(q) ||
        user._id?.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold tracking-wider text-primary uppercase">Super admin panel</p>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Registered Users</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">All client accounts, Google logins and phone records.</p>
        </div>
        <Button type="button" onClick={reload} disabled={isFetching} className="self-start sm:self-auto">
          <FiRefreshCw className={isFetching ? 'animate-spin' : ''} />
          Sync Users
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Accounts" value={users.length} icon={<FiUsers />} />
        <StatCard label="Admins" value={users.filter((u) => isAdminRole(u.role)).length} icon={<FiUsers />} tone="slate" />
        <StatCard label="Requests Submitted" value={users.reduce((n, u) => n + (u.totalRequests ?? 0), 0)} icon={<FiInbox />} tone="amber" />
      </div>

      <div className="relative w-full md:max-w-sm">
        <FiSearch aria-hidden className="pointer-events-none absolute top-3 left-3 text-sm text-muted-foreground" />
        <Input
          type="search"
          aria-label="Search users"
          placeholder="Search name, email, phone or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {error instanceof Error && (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
          <FiAlertCircle /> {error.message}
        </div>
      )}

      {isLoading ? (
        <Card className="gap-3 p-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </Card>
      ) : (
        <Card className="gap-0 overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-6">User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Requests</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="pr-6 text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="p-10 text-center text-muted-foreground">
                    {users.length === 0 ? 'No registered users yet.' : `No user matching "${searchQuery}".`}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-xs font-black text-accent-foreground">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{user.name || 'Anonymous User'}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">{user._id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5">
                        <FiMail className="shrink-0 text-muted-foreground" size={13} />
                        {user.email}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono">
                      <span className="flex items-center gap-1.5">
                        <FiPhone className="shrink-0 text-muted-foreground" size={13} />
                        {user.phone || 'Not provided'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isAdminRole(user.role) ? 'default' : 'secondary'} className="uppercase">
                        {user.role || 'user'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono font-bold">{user.totalRequests ?? 0}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{joined(user.createdAt)}</TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button type="button" variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={selectedUser !== null} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent>
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedUser.name || 'Anonymous User'}</DialogTitle>
                <DialogDescription className="font-mono">ID: {selectedUser._id}</DialogDescription>
              </DialogHeader>

              <dl className="divide-y rounded-xl border bg-muted/30 text-sm">
                {[
                  ['Email', selectedUser.email],
                  ['Phone', selectedUser.phone || 'N/A'],
                  ['Role', selectedUser.role || 'user'],
                  ['Joined', joined(selectedUser.createdAt)],
                  ['Requests submitted', String(selectedUser.totalRequests ?? 0)],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 px-4 py-2.5">
                    <dt className="text-xs font-bold text-muted-foreground uppercase">{label}</dt>
                    <dd className="font-semibold break-all">{value}</dd>
                  </div>
                ))}
              </dl>

              <DialogClose render={<Button variant="outline" className="w-full" />}>Close</DialogClose>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
