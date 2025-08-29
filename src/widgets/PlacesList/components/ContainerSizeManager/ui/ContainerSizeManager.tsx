import { memo, useEffect, useRef, useState } from 'react';
import { type ContainerSizeManagerProps } from '../../../types';

const ContainerSizeManagerComponent = ({ children }: ContainerSizeManagerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newSize = {
          width: rect.width,
          height: rect.height || window.innerHeight - 60, // fallback height
        };

        setContainerSize(newSize);
      }
    };

    updateContainerSize();

    const resizeObserver = new ResizeObserver(updateContainerSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateContainerSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateContainerSize);
    };
  }, []);

  return (
    <div ref={containerRef} className="container-size-manager">
      {children(containerSize)}
    </div>
  );
};

export const ContainerSizeManager = memo(ContainerSizeManagerComponent);
