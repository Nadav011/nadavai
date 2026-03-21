// @ts-nocheck
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
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
const buttonVariants = cva(stryMutAct_9fa48("3621") ? "" : (stryCov_9fa48("3621"), 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'), stryMutAct_9fa48("3622") ? {} : (stryCov_9fa48("3622"), {
  variants: stryMutAct_9fa48("3623") ? {} : (stryCov_9fa48("3623"), {
    variant: stryMutAct_9fa48("3624") ? {} : (stryCov_9fa48("3624"), {
      default: stryMutAct_9fa48("3625") ? "" : (stryCov_9fa48("3625"), 'bg-primary text-primary-foreground hover:bg-primary/90'),
      destructive: stryMutAct_9fa48("3626") ? "" : (stryCov_9fa48("3626"), 'bg-destructive text-destructive-foreground hover:bg-destructive/90'),
      outline: stryMutAct_9fa48("3627") ? "" : (stryCov_9fa48("3627"), 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'),
      secondary: stryMutAct_9fa48("3628") ? "" : (stryCov_9fa48("3628"), 'bg-secondary text-secondary-foreground hover:bg-secondary/80'),
      ghost: stryMutAct_9fa48("3629") ? "" : (stryCov_9fa48("3629"), 'hover:bg-accent hover:text-accent-foreground'),
      link: stryMutAct_9fa48("3630") ? "" : (stryCov_9fa48("3630"), 'text-primary underline-offset-4 hover:underline')
    }),
    size: stryMutAct_9fa48("3631") ? {} : (stryCov_9fa48("3631"), {
      default: stryMutAct_9fa48("3632") ? "" : (stryCov_9fa48("3632"), 'h-10 px-4 py-2'),
      sm: stryMutAct_9fa48("3633") ? "" : (stryCov_9fa48("3633"), 'h-9 rounded-md px-3'),
      lg: stryMutAct_9fa48("3634") ? "" : (stryCov_9fa48("3634"), 'h-11 rounded-md px-8'),
      icon: stryMutAct_9fa48("3635") ? "" : (stryCov_9fa48("3635"), 'h-10 w-10')
    })
  }),
  defaultVariants: stryMutAct_9fa48("3636") ? {} : (stryCov_9fa48("3636"), {
    variant: stryMutAct_9fa48("3637") ? "" : (stryCov_9fa48("3637"), 'default'),
    size: stryMutAct_9fa48("3638") ? "" : (stryCov_9fa48("3638"), 'default')
  })
}));
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant,
  size,
  asChild = stryMutAct_9fa48("3639") ? true : (stryCov_9fa48("3639"), false),
  ...props
}, ref) => {
  if (stryMutAct_9fa48("3640")) {
    {}
  } else {
    stryCov_9fa48("3640");
    const Comp = asChild ? Slot : stryMutAct_9fa48("3641") ? "" : (stryCov_9fa48("3641"), 'button');
    return <Comp className={cn(buttonVariants(stryMutAct_9fa48("3642") ? {} : (stryCov_9fa48("3642"), {
      variant,
      size,
      className
    })))} ref={ref} {...props} />;
  }
});
Button.displayName = stryMutAct_9fa48("3643") ? "" : (stryCov_9fa48("3643"), 'Button');
export { Button, buttonVariants };