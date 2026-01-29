import React from 'react';
import { OpeningHours, type OpeningHoursItem } from 'entities/OpeningHours';
import instagramIcon from 'shared/assets/instagram.svg';
import logo from 'shared/assets/logo.svg';
import { BadgePill } from 'shared/ui/BadgePill';
import cls from '../../../ui/DetailedPlace.module.scss';

interface SidebarProps {
  address: string;
  phone?: string | null;
  googleId?: string | null;
  instagram?: string | null;
  website?: string | null;
  openingHours?: OpeningHoursItem[] | null;
  tags: string[];
  openOnMap: () => void;
  openOnGoogleMaps: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  address,
  phone,
  googleId,
  instagram,
  website,
  openingHours,
  tags,
  openOnMap,
  openOnGoogleMaps,
}) => (
  <aside className={cls.sidebar}>
    <div className={cls.block}>
      <h3 className={cls.blockTitle}>Place info</h3>

      <div className={cls.infoRow}>
        <span className={cls.infoLabel}>Address</span>
        <span className={cls.infoValue}>{address}</span>
      </div>
      {phone ? (
        <div className={cls.infoRow}>
          <span className={cls.infoLabel}>Phone</span>
          <a className={cls.infoValue} href={`tel:${phone}`} type="tel">
            {phone}
          </a>
        </div>
      ) : null}
      <div className={cls.actionsCol}>
        <button className={cls.secondaryBtn} onClick={openOnMap} type="button">
          <img className={cls.icon} src={logo} alt="" />
          Show on 3.Welle map
        </button>
        {googleId ? (
          <button id="google-maps" className={cls.secondaryBtn} onClick={openOnGoogleMaps} type="button">
            <img className={cls.icon} src="/google-maps.svg" alt="" />
            Open on Google Maps
          </button>
        ) : null}
        {instagram ? (
          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
            className={cls.secondaryBtn}
            title="Open Instagram profile"
          >
            <img className={cls.icon} src={instagramIcon} alt="" />
            Open Instagram
          </a>
        ) : null}

        {website ? (
          <a href={website} target="_blank" rel="noreferrer nofollow" className={cls.secondaryBtn} title="Open website">
            <span className={cls.icon} role="img" aria-label="Website">
              🌐
            </span>
            Open Website
          </a>
        ) : null}
      </div>
    </div>
    {openingHours && openingHours.length > 0 ? (
      <div className={cls.block}>
        <h2 className={cls.blockTitle}>Opening hours</h2>
        <OpeningHours openingHours={openingHours ?? []} />
      </div>
    ) : null}
    {tags.length > 0 && (
      <div className={cls.block}>
        <h3 className={cls.blockTitle}>Features</h3>
        <div className={cls.tagsContainer}>
          {tags.map((tag, index) => (
            <BadgePill key={index} text={tag} color="purple" size="small" />
          ))}
        </div>
      </div>
    )}
  </aside>
);
