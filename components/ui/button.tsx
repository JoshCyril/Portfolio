"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { createRipple, MagneticButton } from "@/app/lib/button-effects"

const buttonVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 justify-center",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 justify-center",
        outline:
          "bg-secondary hover:bg-primary/20 justify-center",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 justify-center",
        ghost: "hover:bg-primary/20 w-full",
        ghosth: "hover:bg-primary/20 justify-center",
        cardb: "bg-primary/5 hover:bg-primary/20 w-full justify-center",
        link: "text-primary underline-offset-4 hover:underline justify-center",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  enableRipple?: boolean
  enableMagnetic?: boolean
  rippleColor?: string
  magneticStrength?: number
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      enableRipple = false,
      enableMagnetic = false,
      rippleColor,
      magneticStrength = 0.3,
      onClick,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (enableRipple) {
        createRipple(e as any, rippleColor)
      }
      onClick?.(e as React.MouseEvent<HTMLButtonElement>)
    }

    const buttonProps = {
      ...props,
      ref: asChild ? undefined : ref,
      className: cn(
        buttonVariants({ variant, size, className }),
        enableRipple && "relative overflow-hidden"
      ),
      onClick: handleClick,
    }

    const buttonContent = <Comp {...buttonProps} />

    // Apply magnetic effect if enabled
    if (enableMagnetic) {
      return (
        <MagneticButton strength={magneticStrength} className="inline-block">
          {buttonContent}
        </MagneticButton>
      )
    }

    return buttonContent
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
