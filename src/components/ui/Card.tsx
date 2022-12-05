import React from 'react';

const Card = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className: string;
}) => (
  <div {...props} className={`max-w-xl ${className}`}>
    <div className="rounded bg-white p-2 text-black shadow-md dark:bg-black dark:text-white">
      {children}
    </div>
  </div>
);

export default Card;
