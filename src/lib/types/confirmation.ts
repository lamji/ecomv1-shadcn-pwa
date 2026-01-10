import { type UserProfile } from '@/lib/data/profile';

export type ConfirmationDialogState = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  hideConfirm?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export interface ProfileHeaderProps {
  profile: UserProfile;
  onProfileUpdate?: (updatedProfile: UserProfile) => void;
}
