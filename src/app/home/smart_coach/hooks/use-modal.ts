import { useCallback, useState } from "react";

type ModalContent = {
  title: string;
  detail: string;
};

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ModalContent>({
    title: "",
    detail: "",
  });

  const open = useCallback((title: string, detail: string) => {
    setContent({ title, detail });
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, content, open, close };
}
