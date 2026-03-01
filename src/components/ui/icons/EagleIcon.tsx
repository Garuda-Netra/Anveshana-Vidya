import React from 'react';

type EagleIconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

export function EagleIcon({ title = 'Eagle', ...props }: EagleIconProps) {
  const titleId = React.useId();

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={title ? titleId : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M3 14c2.6-3.2 5.4-4.8 9-5 3.6.2 6.4 1.8 9 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 14l4-4 2 3 3-4 3 4 2-3 4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 9c-.9 1.2-1.6 2.5-2 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
