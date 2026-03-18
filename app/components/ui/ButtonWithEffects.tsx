'use client';

import * as React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { createRipple } from '@/app/lib/button-effects';
import { MagneticButton } from '@/app/lib/button-effects';

interface ButtonWithEffectsProps extends Omit<ButtonProps, 'className' | 'children' | 'onClick'> {
  enableRipple?: boolean;
  enableMagnetic?: boolean;
  rippleColor?: string;
  magneticStrength?: number;
  className?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ButtonWithEffects = React.forwardRef<HTMLButtonElement, ButtonWithEffectsProps>(
  (
    {
      enableRipple = false,
      enableMagnetic = false,
      rippleColor,
      magneticStrength = 0.3,
      className,
      children,
      onClick,
      asChild,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (enableRipple && !asChild) {
        createRipple(e as any, rippleColor);
      }
      onClick?.(e);
    };

    const buttonProps = {
      ...props,
      ref,
      className,
      onClick: handleClick,
      asChild,
    };

    const buttonContent = <Button {...buttonProps}>{children}</Button>;

    if (enableMagnetic && !asChild) {
      return (
        <MagneticButton strength={magneticStrength} className="inline-block">
          {buttonContent}
        </MagneticButton>
      );
    }

    return buttonContent;
  }
);

ButtonWithEffects.displayName = 'ButtonWithEffects';
