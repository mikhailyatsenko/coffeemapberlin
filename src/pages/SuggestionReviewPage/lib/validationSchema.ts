import * as Yup from 'yup';
import { BERLIN_NEIGHBORHOODS } from '../constants';
import { type Neighborhood } from '../types';
import { isInsideBerlin, parseCoordinates } from './coordinates';

export const validationSchema = Yup.object({
  name: Yup.string().trim().required('Name is required'),
  address: Yup.string().trim().required('Address is required'),
  coordinates: Yup.string()
    .trim()
    .required('Coordinates are required')
    .test(
      'lat-lng',
      'Paste coordinates as "lat, lng", e.g. 52.51, 13.40',
      (value) => !value || !!parseCoordinates(value),
    )
    .test('berlin', 'These coordinates are outside Berlin. Are latitude and longitude swapped?', (value) => {
      const coordinates = value ? parseCoordinates(value) : null;
      return !coordinates || isInsideBerlin(coordinates);
    }),
  neighborhood: Yup.string<Neighborhood | ''>()
    .defined()
    .test('neighborhood', 'Pick a Neighborhood', (value) =>
      (BERLIN_NEIGHBORHOODS as readonly string[]).includes(value),
    ),
  description: Yup.string().trim().defined(),
  instagram: Yup.string().trim().defined(),
  website: Yup.string().trim().defined(),
  phone: Yup.string().trim().defined(),
  googlePlaceId: Yup.string().trim().defined(),
  photoPaths: Yup.array(Yup.string().required()).defined(),
});
