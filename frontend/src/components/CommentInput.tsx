import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';

interface CommentInputProps {
  onSend: (content: string) => void;
  loading?: boolean;
  placeholder?: string;
}

const CommentInput: React.FC<CommentInputProps> = ({
  onSend,
  loading = false,
  placeholder = "Type your message...",
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !loading) {
      onSend(content.trim());
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50/50 rounded-xl border border-gray-200">
      <div className="flex items-end gap-3">
        <Input
          label=""
          name="comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
          as="input"
        />
        <Button type="submit" variant="primary" loading={loading}>
          Send
        </Button>
      </div>
    </form>
  );
};

export default CommentInput;
