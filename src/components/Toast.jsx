import { useApp } from '../context/AppContext.jsx';

// Notificação visual com o estilo .iara-toast do projeto original.
export default function Toast() {
  const { toast } = useApp();

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toast && (
        <div key={toast.id} className="iara-toast show is-entering">
          {toast.message}
        </div>
      )}
    </div>
  );
}
