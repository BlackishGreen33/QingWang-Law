import * as React from 'react';

interface BreaklineProps {
  className?: string;
  [propName: string]: string | undefined;
  text: string;
}

const Breakline: React.FC<BreaklineProps> = React.memo(
  ({ className = '', ...others }) => {
    return (
      <div
        className={`my-4 flex justify-center border border-gray-300 dark:border-neutral-700 ${className}`}
        data-testid="breakline"
        {...others}
      >
        <p className="absolute -mt-3 bg-bgDefault px-2 text-sm">
          {others.text}
        </p>
      </div>
    );
  }
);

export default Breakline;
