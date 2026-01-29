import clsx from 'clsx';
import React from 'react';
import { type Characteristic, type CharacteristicCounts } from 'shared/generated/graphql';
import { BadgePill } from 'shared/ui/BadgePill';
import { CharacteristicCountsIcon } from 'shared/ui/CharacteristicCountsIcon';
import cls from '../../../ui/DetailedPlace.module.scss';
import { AverageRating } from '../../AverageRating';
import { ImageSlider } from '../../ImageSlider/ui';

interface HeaderProps {
  name: string;
  description?: string | null;
  neighborhood?: string | null;
  images: string[];
  ratingCount: number;
  averageRating?: number | null;
  characteristicCounts: CharacteristicCounts;
  characteristicKeys: Characteristic[];
  headerActions: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  name,
  description,
  neighborhood,
  images,
  ratingCount,
  averageRating,
  characteristicCounts,
  characteristicKeys,
  headerActions,
}) => (
  <header className={cls.header}>
    <div className={clsx(cls.briefInfo, cls.block)}>
      <AverageRating ratingCount={ratingCount} averageRating={averageRating} />

      <h1 className={cls.title}>{name}</h1>
      <div className={cls.charCounts}>
        {characteristicKeys.map((charKey) => (
          <CharacteristicCountsIcon
            key={charKey}
            characteristic={charKey as Characteristic}
            characteristicData={characteristicCounts[charKey as Characteristic]}
          />
        ))}
      </div>

      {description && <div className={cls.description}>{description}</div>}
      <div className={cls.headerActions}>{headerActions}</div>
    </div>
    <div className={cls.headerImg}>
      {neighborhood ? <BadgePill text={neighborhood} color="green" size="small" className={cls.neighborhood} /> : null}

      <ImageSlider images={images || []} placeName={name} className={cls.mainImg} />
    </div>
  </header>
);
