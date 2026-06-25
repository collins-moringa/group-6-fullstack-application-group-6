function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      <span className="error-icon" aria-hidden="true">!</span>
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;
