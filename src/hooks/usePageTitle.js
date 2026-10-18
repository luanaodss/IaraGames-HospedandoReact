import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — Iara Games` : 'Iara Games — Loja';
  }, [title]);
}
