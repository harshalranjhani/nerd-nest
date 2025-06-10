"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Textarea } from "./ui/textarea";
import { QuestionSelect } from "./questions-select";
import { PlusIcon, XIcon, LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export interface NewNoteProps {
  buttonTitle: string;
  userId: string;
}

export default function AddNote({ buttonTitle, userId }: NewNoteProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questionReferenced, setQuestionReferenced] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    
    // when escape key is pressed, close the dialog
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const addLink = () => setLinks([...links, ""]);

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const addNote = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/user/addNewNote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          links: links.filter((link) => link.trim()),
          user_id: userId,
          question_id: questionReferenced || null,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add note");
      }
      
      const data = await response.json();
      toast.success("Note added successfully!");
      
      // Reset form
      setTitle("");
      setDescription("");
      setLinks([]);
      setQuestionReferenced("");
      setLoading(false);
      setIsOpen(false);
      
      // Use Next.js router refresh instead of window.location.reload()
      router.refresh();
      
    } catch (e: any) {
      toast.error(e.message || "Failed to add note");
      setLoading(false);
    }
  };

  const removeLink = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    setLinks(newLinks);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLinks([]);
    setQuestionReferenced("");
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  // Don't render the dialog until mounted to avoid hydration issues
  if (!isMounted) {
    return (
      <Button variant="default" disabled>
        <PlusIcon className="w-4 h-4 mr-2" />
        {buttonTitle}
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all duration-200 hover:shadow-md"
          onClick={(e) => {
            setIsOpen(true);
            e.stopPropagation();
          }}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          {buttonTitle}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Note</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new note to your collection. You can optionally link it to a coding question for better organization.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Title Input */}
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title for your note"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">{title.length}/100 characters</p>
          </div>

          {/* Description Input */}
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your note content here. You can use HTML formatting."
              className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              maxLength={5000}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/5000 characters • HTML formatting supported
            </p>
          </div>

          {/* Question Reference */}
          <div className="grid gap-2">
            <Label htmlFor="questionReferenced" className="text-sm font-medium">
              Link to Question (Optional)
            </Label>
            <QuestionSelect 
              userId={userId} 
              setQuestionReferenced={setQuestionReferenced} 
            />
            <p className="text-xs text-muted-foreground">
              Link this note to a specific coding question for better organization
            </p>
          </div>

          {/* Links Section */}
          <div className="grid gap-2">
            <Label className="text-sm font-medium">
              Additional Links (Optional)
            </Label>
            {links.length === 0 ? (
              <div className="text-sm text-muted-foreground bg-muted/30 rounded-md p-3 border border-dashed border-muted-foreground/20">
                No additional links added yet
              </div>
            ) : (
              <div className="space-y-2">
                {links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="url"
                        value={link}
                        onChange={(e) => handleLinkChange(index, e.target.value)}
                        placeholder="https://example.com"
                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeLink(index)}
                      className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors duration-200"
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addLink}
              className="mt-2 hover:bg-muted/50 transition-colors duration-200"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between pt-4 border-t">
          <Button 
            variant="ghost" 
            onClick={handleClose}
            className="hover:bg-muted/50 transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={addNote} 
            disabled={loading || !title.trim() || !description.trim()}
            className="bg-primary hover:bg-primary/90 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                Adding...
              </>
            ) : (
              <>
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Note
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
