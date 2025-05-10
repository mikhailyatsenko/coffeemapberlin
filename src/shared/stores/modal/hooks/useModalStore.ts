import { create } from 'zustand';

import { INITIAL_STATE } from '../constants';
import { type ModalState } from '../types';

export const useModalStore = create<ModalState>(() => INITIAL_STATE);
