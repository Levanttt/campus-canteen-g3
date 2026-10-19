export default function NotificationToast({ message }) {
  return (
    <div role="alert" aria-live="polite" className="toast-notification">
      🔔 {message}
    </div>
  );
}
