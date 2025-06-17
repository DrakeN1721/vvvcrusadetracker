const CrusadeSelector = ({ crusades, selectedCrusade, onSelect }) => {
  return (
    <div className="input-group">
      <label className="label mb-2 block">Select Crusade</label>
      <select
        value={selectedCrusade || crusades[0]?.id || ''}
        onChange={(e) => onSelect(e.target.value)}
        className="form-control"
      >
        {crusades.map(crusade => (
          <option key={crusade.id} value={crusade.id}>
            {crusade.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CrusadeSelector