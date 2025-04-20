import './index.css'

const EmploymentType = props => {
  const {employmentType, changeEmploymentType} = props
  // console.log(employmentTypes.employmentTypeId)

  const onChangeEmploymentType = () => {
    changeEmploymentType(employmentType.employmentTypeId)
  }

  return (
    <li className="employement-type-container">
      <input
        type="checkbox"
        id={employmentType.employmentTypeId}
        className="employement-type-checkbox"
        onChange={onChangeEmploymentType}
      />
      <label
        htmlFor={employmentType.employmentTypeId}
        className="employement-type-label"
      >
        {employmentType.label}
      </label>
    </li>
  )
}

export default EmploymentType
