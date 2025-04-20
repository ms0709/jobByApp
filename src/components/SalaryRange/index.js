import './index.css'

const SalaryRange = props => {
  const {salaryRange, changeSalaryRange} = props
  const onChangeSalaryRange = () => {
    changeSalaryRange(salaryRange.salaryRangeId)
  }
  return (
    <li className="salary-range-container">
      <input
        type="radio"
        className="radio-btn"
        id={salaryRange.salaryRangeId}
        name="salaryRange"
        onChange={onChangeSalaryRange}
      />
      <label htmlFor={salaryRange.salaryRangeId} className="radio-label">
        {salaryRange.label}
      </label>
    </li>
  )
}

export default SalaryRange
