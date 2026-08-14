import React from 'react';
import { Modal, ModalProps } from './Modal';

export interface BottomSheetProps extends Omit<ModalProps, 'isBottomSheet'> {}

export const BottomSheet: React.FC<BottomSheetProps> = (props) => {
  return <Modal isBottomSheet={true} {...props} />;
};
