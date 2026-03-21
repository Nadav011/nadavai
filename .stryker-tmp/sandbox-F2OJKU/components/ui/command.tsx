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
import { type DialogProps } from '@radix-ui/react-dialog';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
const Command = React.forwardRef<React.ElementRef<typeof CommandPrimitive>, React.ComponentPropsWithoutRef<typeof CommandPrimitive>>(stryMutAct_9fa48("3644") ? () => undefined : (stryCov_9fa48("3644"), ({
  className,
  ...props
}, ref) => <CommandPrimitive ref={ref} className={cn(stryMutAct_9fa48("3645") ? "" : (stryCov_9fa48("3645"), 'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground'), className)} {...props} />));
Command.displayName = CommandPrimitive.displayName;
const CommandDialog = ({
  children,
  ...props
}: DialogProps) => {
  if (stryMutAct_9fa48("3646")) {
    {}
  } else {
    stryCov_9fa48("3646");
    return <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>;
  }
};
const CommandInput = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Input>, React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>>(stryMutAct_9fa48("3647") ? () => undefined : (stryCov_9fa48("3647"), ({
  className,
  ...props
}, ref) => <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="me-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input ref={ref} className={cn(stryMutAct_9fa48("3648") ? "" : (stryCov_9fa48("3648"), 'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'), className)} {...props} />
  </div>));
CommandInput.displayName = CommandPrimitive.Input.displayName;
const CommandList = React.forwardRef<React.ElementRef<typeof CommandPrimitive.List>, React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>>(stryMutAct_9fa48("3649") ? () => undefined : (stryCov_9fa48("3649"), ({
  className,
  ...props
}, ref) => <CommandPrimitive.List ref={ref} className={cn(stryMutAct_9fa48("3650") ? "" : (stryCov_9fa48("3650"), 'max-h-[300px] overflow-y-auto overflow-x-hidden'), className)} {...props} />));
CommandList.displayName = CommandPrimitive.List.displayName;
const CommandEmpty = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Empty>, React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>>(stryMutAct_9fa48("3651") ? () => undefined : (stryCov_9fa48("3651"), (props, ref) => <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;
const CommandGroup = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Group>, React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>>(stryMutAct_9fa48("3652") ? () => undefined : (stryCov_9fa48("3652"), ({
  className,
  ...props
}, ref) => <CommandPrimitive.Group ref={ref} className={cn(stryMutAct_9fa48("3653") ? "" : (stryCov_9fa48("3653"), 'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground'), className)} {...props} />));
CommandGroup.displayName = CommandPrimitive.Group.displayName;
const CommandSeparator = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Separator>, React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>>(stryMutAct_9fa48("3654") ? () => undefined : (stryCov_9fa48("3654"), ({
  className,
  ...props
}, ref) => <CommandPrimitive.Separator ref={ref} className={cn(stryMutAct_9fa48("3655") ? "" : (stryCov_9fa48("3655"), '-mx-1 h-px bg-border'), className)} {...props} />));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;
const CommandItem = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Item>, React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>>(stryMutAct_9fa48("3656") ? () => undefined : (stryCov_9fa48("3656"), ({
  className,
  ...props
}, ref) => <CommandPrimitive.Item ref={ref} className={cn(stryMutAct_9fa48("3657") ? "" : (stryCov_9fa48("3657"), "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"), className)} {...props} />));
CommandItem.displayName = CommandPrimitive.Item.displayName;
const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  if (stryMutAct_9fa48("3658")) {
    {}
  } else {
    stryCov_9fa48("3658");
    return <span className={cn(stryMutAct_9fa48("3659") ? "" : (stryCov_9fa48("3659"), 'ms-auto text-xs tracking-widest text-muted-foreground'), className)} {...props} />;
  }
};
CommandShortcut.displayName = stryMutAct_9fa48("3660") ? "" : (stryCov_9fa48("3660"), 'CommandShortcut');
export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator };