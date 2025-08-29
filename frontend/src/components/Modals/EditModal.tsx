import { ButtonLoadingSpinner } from "@/components/Loading/LoadingSpinner";
import { Info, User } from "lucide-react";
import { useState } from "react";

interface EditModalProps {
  error: string | null;
  isPending: boolean;
  setShowEditModal: (show: boolean) => void;
  handleEdit: (formData: FormData) => void;
  editTitle: string;
  editContent: string;
  setEditTitle: (title: string) => void;
  setEditContent: (content: string) => void;
}

export const EditModal = ({
  error,
  isPending,
  setShowEditModal,
  handleEdit,
  editTitle,
  editContent,
  setEditTitle,
  setEditContent,
}: EditModalProps) => {
  const [showMentionHelp, setShowMentionHelp] = useState(false);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "#777777CC" }}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Edit item</h3>
          <button
            type="button"
            onClick={() => setShowMentionHelp(!showMentionHelp)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Como usar menções"
          >
            <Info size={18} />
          </button>
        </div>

        {/* Ajuda sobre menções */}
        {showMentionHelp && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <User size={14} className="text-blue-600 mt-0.5" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Como usar menções:</p>
                <p>Use @username para mencionar outros usuários.</p>
                <p className="text-xs mt-1 text-blue-700">
                  Exemplo: &ldquo;Olá @joao, o que você acha?&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form action={handleEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
              required
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              name="content"
              placeholder="Content (use @username para mencionar usuários)"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400 resize-none"
              required
              disabled={isPending}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !editTitle.trim() || !editContent.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <ButtonLoadingSpinner />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
