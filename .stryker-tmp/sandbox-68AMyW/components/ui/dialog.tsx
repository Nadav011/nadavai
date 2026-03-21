// @ts-nocheck
'use client';

function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;
const DialogOverlay = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(stryMutAct_9fa48("3661") ? () => undefined : (stryCov_9fa48("3661"), ({
  className,
  ...props
}, ref) => <DialogPrimitive.Overlay ref={ref} className={cn(stryMutAct_9fa48("3662") ? "" : (stryCov_9fa48("3662"), 'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'), className)} {...props} />));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>(stryMutAct_9fa48("3663") ? () => undefined : (stryCov_9fa48("3663"), ({
  className,
  children,
  ...props
}, ref) => <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content ref={ref} className={cn(stryMutAct_9fa48("3664") ? "" : (stryCov_9fa48("3664"), 'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg'), className)} {...props}>
      {children}
      <DialogPrimitive.Close className="absolute end-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = stryMutAct_9fa48("3665") ? () => undefined : (stryCov_9fa48("3665"), (() => {
  const DialogHeader = ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn(stryMutAct_9fa48("3666") ? "" : (stryCov_9fa48("3666"), 'flex flex-col space-y-1.5 text-center sm:text-start'), className)} {...props} />;
  return DialogHeader;
})());
DialogHeader.displayName = stryMutAct_9fa48("3667") ? "" : (stryCov_9fa48("3667"), 'DialogHeader');
const DialogFooter = stryMutAct_9fa48("3668") ? () => undefined : (stryCov_9fa48("3668"), (() => {
  const DialogFooter = ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn(stryMutAct_9fa48("3669") ? "" : (stryCov_9fa48("3669"), 'flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2'), className)} {...props} />;
  return DialogFooter;
})());
DialogFooter.displayName = stryMutAct_9fa48("3670") ? "" : (stryCov_9fa48("3670"), 'DialogFooter');
const DialogTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(stryMutAct_9fa48("3671") ? () => undefined : (stryCov_9fa48("3671"), ({
  className,
  ...props
}, ref) => <DialogPrimitive.Title ref={ref} className={cn(stryMutAct_9fa48("3672") ? "" : (stryCov_9fa48("3672"), 'text-lg font-semibold leading-none tracking-tight'), className)} {...props} />));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Description>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(stryMutAct_9fa48("3673") ? () => undefined : (stryCov_9fa48("3673"), ({
  className,
  ...props
}, ref) => <DialogPrimitive.Description ref={ref} className={cn(stryMutAct_9fa48("3674") ? "" : (stryCov_9fa48("3674"), 'text-sm text-muted-foreground'), className)} {...props} />));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };