'use client';

import { useState } from 'react';
import { type Address, type Phone, type UserProfile } from '@/types/profile';
import { type ConfirmationDialogState } from '@/lib/types/confirmation';

export const useProfile = (
  profile: UserProfile,
  onProfileUpdate?: (profile: UserProfile) => void,
) => {
  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialogState | null>(null);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editMode, setEditMode] = useState<'name' | 'email'>('name');
  const [editingPhone, setEditingPhone] = useState<string | null>(null);
  const [showAllPhones, setShowAllPhones] = useState(false);

  const handleToggleDefault = (addressId: string) => {
    const currentDefaultAddress = profile.addresses.find((addr: Address) => addr.isDefault);

    // Show confirmation if changing default address
    if (currentDefaultAddress && currentDefaultAddress.id !== addressId) {
      setConfirmDialog({
        open: true,
        title: 'Set Default Address',
        message: `Are you sure you want to set this address as your default? This will replace your current default address (${currentDefaultAddress.street}, ${currentDefaultAddress.city}).`,
        confirmText: 'Set Default',
        cancelText: 'Cancel',
        destructive: false,
        onConfirm: () => {
          // User confirmed, proceed with update
          const updatedProfile = {
            ...profile,
            addresses: profile.addresses.map((addr: Address) => ({
              ...addr,
              isDefault: addr.id === addressId,
            })),
          };

          if (onProfileUpdate) {
            onProfileUpdate(updatedProfile);
          }
          setConfirmDialog(null);
        },
        onCancel: () => setConfirmDialog(null),
      });
    } else {
      // No current default or same address, proceed directly
      const updatedProfile = {
        ...profile,
        addresses: profile.addresses.map((addr: Address) => ({
          ...addr,
          isDefault: addr.id === addressId,
        })),
      };

      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }
    }
  };

  const handleAddAddress = () => {
    setEditingAddress('new'); // Use 'new' to indicate adding a new address
  };

  const handleEditAddress = (addressId: string) => {
    const addressToEdit = profile.addresses.find((addr: Address) => addr.id === addressId);

    setConfirmDialog({
      open: true,
      title: 'Edit Address',
      message: `Are you sure you want to edit this address? (${addressToEdit?.street}, ${addressToEdit?.city})`,
      confirmText: 'Edit',
      cancelText: 'Cancel',
      destructive: false,
      onConfirm: () => {
        setConfirmDialog(null);
        setEditingAddress(addressId);
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  const handleSaveAddress = (updatedAddress: Omit<Address, 'id'>) => {
    if (editingAddress === 'new') {
      // Adding new address
      const newAddress: Address = {
        ...updatedAddress,
        id: `addr_${Date.now()}`, // Generate unique ID
      };

      const updatedProfile = {
        ...profile,
        addresses: [...profile.addresses, newAddress],
      };

      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }
    } else if (editingAddress) {
      // Editing existing address
      const updatedProfile = {
        ...profile,
        addresses: profile.addresses.map((addr: Address) =>
          addr.id === editingAddress ? { ...updatedAddress, id: editingAddress } : addr,
        ),
      };

      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }
    }
    setEditingAddress(null);
  };

  const handleEditProfile = () => {
    setEditMode('name');
    setEditingProfile(true);
  };

  const handleUpdateEmail = () => {
    setEditMode('email');
    setEditingProfile(true);
  };

  const badgeConfig = {
    verified: {
      className: 'bg-green-50 text-xs text-green-600 hover:bg-green-100',
      text: 'Verified',
    },
    notVerified: {
      className: 'bg-orange-50 text-xs text-orange-600 hover:bg-orange-100',
      text: 'Not Verified',
    },
  };

  const currentBadge = profile.emailVerified ? badgeConfig.verified : badgeConfig.notVerified;

  const handleCancelEditProfile = () => {
    setEditingProfile(false);
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    const newProfile: UserProfile = { ...updatedProfile };

    if (editMode === 'name') {
      // Parse the full name from the input
      const fullNameInput = document.getElementById('fullName') as HTMLInputElement;
      const fullName = fullNameInput?.value || `${profile.firstName} ${profile.lastName}`;
      const nameParts = fullName.trim().split(' ');

      newProfile.firstName = nameParts[0] || '';
      newProfile.lastName = nameParts.slice(1).join(' ') || '';
    } else if (editMode === 'email') {
      // Get the email from the input
      const emailInput = document.getElementById('email') as HTMLInputElement;
      newProfile.email = emailInput?.value || profile.email;
    }

    if (onProfileUpdate) {
      onProfileUpdate(newProfile);
    }
    setEditingProfile(false);
  };

  const handleAddPhone = () => {
    setEditingPhone('new'); // Open phone modal for adding new phone
  };

  const handleEditPhone = (phoneId: string) => {
    const phoneToEdit = profile.phones.find((phone: Phone) => phone.id === phoneId);

    setConfirmDialog({
      open: true,
      title: 'Edit Phone Number',
      message: `Are you sure you want to edit this phone number? (${phoneToEdit?.number})`,
      confirmText: 'Edit',
      cancelText: 'Cancel',
      destructive: false,
      onConfirm: () => {
        setConfirmDialog(null);
        setEditingPhone(phoneId); // Open phone modal for editing
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  const handleDeletePhone = (phoneId: string) => {
    const phoneToDelete = profile.phones.find((phone: Phone) => phone.id === phoneId);

    // Validation: Cannot delete primary phone number
    if (phoneToDelete?.isPrimary) {
      setConfirmDialog({
        open: true,
        title: 'Cannot Delete Primary Phone',
        message:
          'You cannot delete the primary phone number. Please set another phone number as primary first.',
        hideConfirm: true,
        cancelText: 'OK',
        destructive: false,
        onConfirm: () => {}, // No action
        onCancel: () => setConfirmDialog(null),
      });
      return;
    }

    // Show confirmation for valid deletion
    setConfirmDialog({
      open: true,
      title: 'Delete Phone Number',
      message: `Are you sure you want to delete this phone number? (${phoneToDelete?.number}) This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true,
      onConfirm: () => {
        const updatedProfile = {
          ...profile,
          phones: profile.phones.filter((phone: Phone) => phone.id !== phoneId),
        };

        if (onProfileUpdate) {
          onProfileUpdate(updatedProfile);
        }
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
  };

  const handleSavePhone = (phone: string) => {
    let updatedProfile;

    if (editingPhone === 'new') {
      // Adding new phone
      const newPhone = {
        id: `phone_${Date.now()}`,
        type: 'mobile' as const,
        number: phone,
        isPrimary: profile.phones.length === 0, // Make primary if first phone
      };

      updatedProfile = {
        ...profile,
        phones: [...profile.phones, newPhone],
      };
    } else {
      // Editing existing phone
      updatedProfile = {
        ...profile,
        phones: profile.phones.map((p: Phone) =>
          p.id === editingPhone ? { ...p, number: phone } : p,
        ),
      };
    }

    if (onProfileUpdate) {
      onProfileUpdate(updatedProfile);
    }
    setEditingPhone(null);
  };

  const handleTogglePrimaryPhone = (phoneId: string) => {
    const currentPrimaryPhone = profile.phones.find((phone: Phone) => phone.isPrimary);

    // Show confirmation if changing primary phone
    if (currentPrimaryPhone && currentPrimaryPhone.id !== phoneId) {
      setConfirmDialog({
        open: true,
        title: 'Set Primary Phone',
        message: `Are you sure you want to set this phone as your primary? This will replace your current primary phone (${currentPrimaryPhone.number}).`,
        confirmText: 'Set Primary',
        cancelText: 'Cancel',
        destructive: false,
        onConfirm: () => {
          // User confirmed, proceed with update
          const updatedProfile = {
            ...profile,
            phones: profile.phones.map((phone: Phone) => ({
              ...phone,
              isPrimary: phone.id === phoneId,
            })),
          };

          if (onProfileUpdate) {
            onProfileUpdate(updatedProfile);
          }
          setConfirmDialog(null);
        },
        onCancel: () => setConfirmDialog(null),
      });
    } else {
      // No current primary or same phone, proceed directly
      const updatedProfile = {
        ...profile,
        phones: profile.phones.map((phone: Phone) => ({
          ...phone,
          isPrimary: phone.id === phoneId,
        })),
      };

      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }
    }
  };

  const handleLogout = () => {
    setConfirmDialog({
      open: true,
      title: 'Logout',
      message: 'Are you sure you want to log out?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      destructive: true,
      onConfirm: () => {
        setConfirmDialog(null);
        // Trigger logout event - useAuth hook will handle the global loader
        window.dispatchEvent(new Event('auth-logout'));
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  const handleCancelEditPhone = () => {
    setEditingPhone(null);
  };

  const handleDeleteAddress = (addressId: string) => {
    const addressToDelete = profile.addresses.find((addr: Address) => addr.id === addressId);

    // Validation: Cannot delete default address
    if (addressToDelete?.isDefault) {
      setConfirmDialog({
        open: true,
        title: 'Cannot Delete Default Address',
        message:
          'You cannot delete the default address. Please set another address as default first.',
        hideConfirm: true,
        cancelText: 'OK',
        destructive: false,
        onConfirm: () => {}, // No action
        onCancel: () => setConfirmDialog(null),
      });
      return;
    }

    // Validation: Cannot delete if it's the last address
    if (profile.addresses.length <= 1) {
      setConfirmDialog({
        open: true,
        title: 'Cannot Delete Last Address',
        message: 'You must have at least one address. You cannot delete your only address.',
        hideConfirm: true,
        cancelText: 'OK',
        destructive: false,
        onConfirm: () => {}, // No action
        onCancel: () => setConfirmDialog(null),
      });
      return;
    }

    // Show confirmation for valid deletion
    setConfirmDialog({
      open: true,
      title: 'Delete Address',
      message: 'Are you sure you want to delete this address? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true,
      onConfirm: () => {
        const updatedProfile = {
          ...profile,
          addresses: profile.addresses.filter((addr: Address) => addr.id !== addressId),
        };

        if (onProfileUpdate) {
          onProfileUpdate(updatedProfile);
        }
        setConfirmDialog(null);
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  return {
    // State
    confirmDialog,
    editingAddress,
    showAllAddresses,
    editingProfile,
    editMode,
    editingPhone,
    showAllPhones,

    // Badge configuration
    badgeConfig,
    currentBadge,

    // Handlers
    handleToggleDefault,
    handleEditAddress,
    handleAddAddress,
    handleSaveAddress,
    handleEditProfile,
    handleUpdateEmail,
    handleCancelEditProfile,
    handleSaveProfile,
    handleAddPhone,
    handleEditPhone,
    handleDeletePhone,
    handleCancelEdit,
    handleSavePhone,
    handleTogglePrimaryPhone,
    handleLogout,
    handleCancelEditPhone,
    handleDeleteAddress,

    // Setters
    setConfirmDialog,
    setEditingAddress,
    setShowAllAddresses,
    setEditingProfile,
    setEditMode,
    setEditingPhone,
    setShowAllPhones,
  };
};
