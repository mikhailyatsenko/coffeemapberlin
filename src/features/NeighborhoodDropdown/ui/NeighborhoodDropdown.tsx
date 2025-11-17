import { useEffect, useRef, useState } from 'react';
import { useWidth } from 'shared/hooks/useWidth';
import { PortalToBody } from 'shared/ui/Portals/PortalToBody';
import cls from './NeighborhoodDropdown.module.scss';

interface NeighborhoodDropdownProps {
  onSelect: (neighborhood: string) => void;
}

const NEIGHBORHOODS = [
  'Charlottenburg-Wilmersdorf',
  'Friedrichshain-Kreuzberg',
  'Lichtenberg',
  'Marzahn-Hellersdorf',
  'Mitte',
  'Neukölln',
  'Pankow',
  'Reinickendorf',
  'Spandau',
  'Steglitz-Zehlendorf',
  'Tempelhof-Schöneberg',
  'Treptow-Köpenick',
] as const;

export const NeighborhoodDropdown = ({ onSelect }: NeighborhoodDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const width = useWidth();
  const isMobile = width <= 900;

  const closeDropdown = () => {
    setIsOpen(false);
  };
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (neighborhood: string) => {
    onSelect(neighborhood);
    closeDropdown();
  };

  useEffect(() => {
    if (isMobile) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isMobile]);

  const NeighborhoodList = ({ className, onItemClick }: { className: string; onItemClick: (n: string) => void }) => (
    <>
      {NEIGHBORHOODS.map((neighborhood) => (
        <button
          key={neighborhood}
          className={className}
          onClick={() => {
            onItemClick(neighborhood);
          }}
          type="button"
        >
          {neighborhood}
        </button>
      ))}
    </>
  );
  return (
    <div className={cls.dropdown} ref={dropdownRef}>
      <button
        className={`${cls.dropdownButton} ${isOpen ? cls.active : ''}`}
        onClick={toggleDropdown}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Best Coffee in Your Area
        <span className={cls.arrow} aria-hidden="true">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen &&
        (isMobile ? (
          // mobile modal
          <PortalToBody>
            <div className={cls.modalOverlay} onClick={closeDropdown}>
              <div
                className={cls.modalMenu}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                role="dialog"
                aria-modal="true"
              >
                <button className={cls.closeButton} onClick={closeDropdown} aria-label="Close dropdown" type="button">
                  ×
                </button>
                <div className={cls.modalTitle}>Best Coffee in Your Area</div>
                <div className={cls.modalList}>
                  <NeighborhoodList className={cls.modalItem} onItemClick={handleSelect} />
                </div>
              </div>
            </div>
          </PortalToBody>
        ) : (
          // desktop dropdown
          <div className={cls.dropdownMenu}>
            <NeighborhoodList className={cls.dropdownItem} onItemClick={handleSelect} />
          </div>
        ))}
    </div>
  );
};
