import './index.css'

const Skills = props => {
  const {skill} = props

  return (
    <li className="skill-container">
      <img src={skill.imageUrl} alt={skill.name} className="skill-img" />
      <h1 className="skill-name">{skill.name}</h1>
    </li>
  )
}

export default Skills
