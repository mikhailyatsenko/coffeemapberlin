import filterIcon from 'shared/assets/filter-icon.svg';

import cls from './SearchPlacesInput.module.scss';

interface SearchPlacesProps {
  searchValue: string;
  isActive: boolean;
  setValueHandler: (value: string) => void;
}

export const SearchPlacesInput = ({ setValueHandler, isActive, searchValue }: SearchPlacesProps) => {
  return (
    <>
      <input
        onChange={(e) => {
          setValueHandler(e.target.value);
        }}
        value={searchValue}
        className={`${cls.searchInput} ${isActive ? cls.active : ''}`}
        autoComplete="off"
        id="search"
        name="search"
        type="text"
        placeholder="Type to search"
      />

      <div className={`${cls.filterIconContainer} ${isActive ? cls.activeInput : ''}`}>
        <img className={cls.filterIcon} src={filterIcon} alt="Search icon" />
      </div>
    </>
  );
};
