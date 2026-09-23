# How much Characteristic, Amenity and Rating data do Places actually have?

Type: research
Status: resolved

## Question

Across all Places (and per Neighborhood): how many have at least one Characteristic marked, how many Amenities, how many Ratings from Users/Guests vs Google reviews? Which Characteristics and Amenities are well covered? Output: a small table. It decides whether the quiz and "best in Neighborhood" lists can be driven by Characteristics or must lean on Amenities and Average rating. Read-only query against the database from `../coffemap-server` (models in `src/models/`); never write.

## Answer

Full write-up: `.scratch/engagement/research/data-coverage.md` on branch `research/data-coverage`. Measured with read-only queries against production, 2026-09-23; 408 visible Places.

- **Characteristics are nearly empty:** 9 Places (2%) have any; only 2 have one marked by a second person. Nothing can be driven by them yet.
- **Amenities are nearly complete:** 99% of Places, ~27 each. Six of the eight Characteristics have an Amenity counterpart: outdoor seating 66%, dogs 46%, Wi-Fi 38%, cozy 80%, great coffee 79%, breakfast 72%; also laptop-friendly 51%. There is none for friendly staff or affordable prices. A missing Amenity means "unknown", not "no".
- **Average rating is effectively Google's:** ~5 Google reviews per Place (API cap). Only 90 Places have any User/Guest Rating, and 3 have three or more. Reviews come from 139 Users and 4 Guests; only 7 have Review text.
- **Own photos are almost nil:** 2 Places. Google review photos cover 97%.
- **Neighborhoods:** Mitte, Friedrichshain-Kreuzberg, Charlottenburg-Wilmersdorf and Pankow hold 70% of Places. Spandau, Marzahn-Hellersdorf and Lichtenberg have fewer than 6 each, too few for a "best of" list. One Place sits outside Berlin and one has no Neighborhood.

Consequence: the quiz and "best in Neighborhood" lists must run on Amenities plus Average rating. Characteristics can at most be a secondary "people say" signal once counts grow.
