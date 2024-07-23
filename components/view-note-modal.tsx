'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from './ui/modal';


interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  data: any;
}

export const NoteViewModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  loading,
  data
}) => {
  const [isMounted, setIsMounted] = useState(false);
  console.log(data)

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={data.title}
      description={data?.questions?.title || "No question referenced."}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="max-h-[60vh] overflow-y-auto">
        <div className="flex flex-col items-center px-4">
          <p className="text-gray-500 text-sm">{new Date(data.created_at).toLocaleDateString()}</p>
        </div>
        <div className="pt-4 px-4">
          <div dangerouslySetInnerHTML={{ __html: data.description }} />
        </div>
      </div>
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
};