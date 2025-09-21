import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Plus, X, PenTool } from 'lucide-react';
import { useCommunity } from '@/hooks/useCommunity';

interface CreatePostModalProps {
  children?: React.ReactNode;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ children }) => {
  const { createPost } = useCommunity();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'tecnologia', label: 'Tecnología' },
    { value: 'certificaciones', label: 'Certificaciones' },
    { value: 'networking', label: 'Networking' },
    { value: 'empleo', label: 'Empleo' },
    { value: 'recursos', label: 'Recursos' }
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) return;

    setIsSubmitting(true);
    const post = await createPost({
      title: title.trim(),
      content: content.trim(),
      category,
      tags
    });

    if (post) {
      // Reset form
      setTitle('');
      setContent('');
      setCategory('');
      setTags([]);
      setTagInput('');
      setOpen(false);
    }
    setIsSubmitting(false);
  };

  const isFormValid = title.trim() && content.trim() && category;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="flex items-center space-x-2">
            <PenTool className="w-4 h-4" />
            <span>Crear Post</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <PenTool className="w-5 h-5 text-primary" />
            <span>Crear Nuevo Post</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título*</Label>
            <Input
              id="title"
              placeholder="¿Sobre qué quieres hablar?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            <div className="text-xs text-muted-foreground text-right">
              {title.length}/100
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoría*</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Contenido*</Label>
            <Textarea
              id="content"
              placeholder="Comparte tus ideas, experiencias o preguntas con la comunidad..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px]"
              maxLength={2000}
            />
            <div className="text-xs text-muted-foreground text-right">
              {content.length}/2000
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Etiquetas (opcional)</Label>
            <div className="flex space-x-2">
              <Input
                id="tags"
                placeholder="Agregar etiqueta"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={20}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="text-xs text-muted-foreground">
              Máximo 5 etiquetas. Presiona Enter para agregar.
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Publicando...' : 'Publicar Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};