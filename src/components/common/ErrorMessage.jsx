const ErrorMessage = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`bg-red-500/10 border border-red-500/30 rounded-lg p-4 ${className}`}>
      <p className="text-red-500">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage