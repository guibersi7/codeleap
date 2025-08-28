import { ButtonLoadingSpinner } from "@/components/Loading/LoadingSpinner";

interface DeleteModalProps {
  error: string | null;
  isPending: boolean;
  setShowDeleteAlert: (show: boolean) => void;
  handleDelete: () => void;
}

export const DeleteModal = ({
  error,
  isPending,
  setShowDeleteAlert,
  handleDelete,
}: DeleteModalProps) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "#777777CC" }}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold text-gray-900 mb-4 text-start">
          Are you sure you want to delete this item?
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3 justify-end w-full">
          <button
            onClick={() => setShowDeleteAlert(false)}
            className="flex items-center justify-center cursor-pointer text-center h-[32px] px-4 py-2 border hover:bg-gray-200 border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-center cursor-pointer h-[32px] px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:text-gray-500 flex items-center gap-2"
          >
            {isPending ? (
              <>
                <ButtonLoadingSpinner />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
