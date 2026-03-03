const LoadingState = ({ colSpan }) => (
  <tr>
    <td colSpan={colSpan} className="text-center py-4 text-muted">
      <div className="spinner-border spinner-border-sm me-2" role="status" />
      Loading orders...
    </td>
  </tr>
);

export default LoadingState;