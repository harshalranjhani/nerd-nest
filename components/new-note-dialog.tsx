'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { QuestionSelect } from './questions-select';

export interface NewNoteProps {
  buttonTitle: string;
  userId: string;
}

export default function AddNote({ buttonTitle, userId }: NewNoteProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questionReferenced, setQuestionReferenced] = useState('');
  const [links, setLinks] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // when escape key is pressed, close the dialog
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const addLink = () => setLinks([...links, '']);

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const addNote = async () => {
    if (!title || !description) {
      toast.error('Title and Description are required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/user/addNewNote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          links: links.filter((link) => link),
          user_id: userId,
          question_id: questionReferenced,
        }),
      });
      const data = await response.json();
      toast.success('Note added successfully!');
      window.location.reload();
      setTitle('');
      setDescription('');
      setLinks([]);
      setQuestionReferenced('');
      setLoading(false);
      setIsOpen(false);
    } catch (e: any) {
      toast.error(e.message);
      setLoading(false);
    }
  };

  const removeLink = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    setLinks(newLinks);
  };

  return (
    <Dialog open={isOpen}>
      <DialogTrigger className="bg-teal-300 text-black hover:bg-teal-400 hover:text-black" asChild>
        <Button
          variant="outline"
          className="text-sm md:text-xl"
          onClick={(e) => {
            setIsOpen(true);
            e.stopPropagation();
          }}
        >
          {buttonTitle}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Note</DialogTitle>
          <DialogDescription>
            Add a new note and link to a question if required!{' '}
            <i className="col-span-4 text-center">
              To add a description head over to{' '}
              <a href="https://megahertz.github.io/react-simple-wysiwyg/" target="_blank" className="text-teal-500 underline">
                this link
              </a>{' '}
              and copy and paste the source in the given textarea below!
            </i>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="This is a useful trick!"
              className="col-span-3"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="topic" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="This is a very very important question!"
              className="col-span-3"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="questionReferenced" className="text-right">
              Refer this note to a Question
            </Label>
            <QuestionSelect userId={userId} setQuestionReferenced={setQuestionReferenced} />
          </div>
          {links.map((link, index) => (
            <div key={index} className="flex items-center gap-4">
              <Input
                type="url"
                value={link}
                onChange={(e) => handleLinkChange(index, e.target.value)}
                id={`link-${index}`}
                placeholder="https://example.com"
                className="col-span-3"
              />
              <Button variant="outline" size="sm" onClick={() => removeLink(index)}>
                Delete
              </Button>
            </div>
          ))}
          <div className="col-span-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={addLink}>
              Add Another Link
            </Button>
          </div>
        </div>
        <DialogFooter>
          <div className="w-[100%] flex justify-between">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={addNote} disabled={loading}>
              {loading ? 'Adding...' : 'Done'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
