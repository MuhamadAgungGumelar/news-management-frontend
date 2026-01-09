"use client";

import React from "react";
import { MdLogout, MdWarning } from "react-icons/md";

interface LogoutConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutConfirmDialog: React.FC<LogoutConfirmDialogProps> = ({
  open,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <MdWarning className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Confirm Logout</h2>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to logout? You will need to login again to access the dashboard.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <MdLogout className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmDialog;
