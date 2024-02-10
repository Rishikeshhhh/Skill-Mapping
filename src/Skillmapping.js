import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Home from "./home";
import './skillmapping.css'
 
const API_URL = 'http://localhost:3000';
 
const SkillMapping = () => {
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    skill_id: '',
    employeeName: '',
    name: '',
    yearsOfExperience: '',
    proficiency: 'Beginner',
    description: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillsVisibility, setSkillsVisibility] = useState(true);
 
  useEffect(() => {
    axios.get(API_URL)
      .then((response) => {
        setSkills(response.data);
        console.log(response.data);
        console.log(skills);
      })
      .catch(error => console.error('Error fetching skills:', error));
  }, [employeeName,skills]);
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'searchQuery') {
      setSearchQuery(value);
    } else if (name === 'employeeName') {
      setEmployeeName(value);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const handleAddSkill = () => {
    if (!employeeName || !/^[a-zA-Z ]+$/.test(employeeName)) {
      alert("Employee name is required and should only contain letters.");
      return;
    }
 
    if (!formData.name || !formData.yearsOfExperience) {
      alert("Skill name and Years of Experience are required.");
      return;
    }
 
    const newSkill = {
      skill_id: parseInt(formData.skill_id), // Convert to integer if required
      employeeName,
      name: formData.name,
      yearsOfExperience: parseInt(formData.yearsOfExperience),
      proficiency: calculateProficiency(formData.yearsOfExperience),
      description: formData.description,
  };
 
   
    axios.post(`${API_URL}/EmployeeSkills`, newSkill)
      .then(response => {
        console.log("check");
        console.log('Skill added successfully:', response.data);
        setSkills([...skills, response.data]);
        alert('Skill added successfully');
        resetForm();
        window.location.reload();
      })
      .catch(error => {
        console.log("check");
        console.error('Error adding skill:', error);
        alert('Error adding skill. Please try again.');
      });
  };
 
  const handleEditSkill = (employeeName) => {
    const skillToEdit = skills.find(skill => skill.employeeName === employeeName);
    setFormData({
      skill_id: skillToEdit.skill_id,
      employeeName: skillToEdit.employeeName,
      name: skillToEdit.name,
      yearsOfExperience: skillToEdit.yearsOfExperience,
      proficiency: skillToEdit.proficiency,
      description: skillToEdit.description,
    });
    setEditingSkill(employeeName);
    setEmployeeName(employeeName); // Set the employeeName in the state
  };
 
  const handleUpdateSkill = () => {
    if (!employeeName || !/^[a-zA-Z ]+$/.test(employeeName)) {
      alert("Employee name is required and should only contain letters.");
      return;
    }
 
    if (!formData.name || !formData.yearsOfExperience) {
      alert("Skill name and Years of Experience are required.");
      return;
    }
 
    try {
      const updatedSkill = {
        skill_id: parseInt(formData.skill_id), // Convert to integer if required
        employeeName,
        name: formData.name,
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        proficiency: calculateProficiency(formData.yearsOfExperience),
        description: formData.description,
    };
 
    axios.put(`${API_URL}/EmployeeSkills/${employeeName}`, updatedSkill)
        .then(response => {
          const updatedSkills = [...skills];
          const index = updatedSkills.findIndex(skill => skill.employeeName === editingSkill);
          updatedSkills[index] = updatedSkill;
          setSkills(updatedSkills);
          setEmployeeName(updatedSkill.employeeName); // Update the employeeName here
          resetForm();
          setEditingSkill(null);
         
        })
        .catch(error => {
          console.error('Error updating skill:', error);
          alert('Error updating skill. Please try again.');
        });
 
    } catch (error) {
      console.error('Error updating skill:', error);
      alert('Error updating skill. Please try again.');
    }
};
 
  const handleDeleteSkill = async (employeeName) => {
    try {
      axios.delete(`${API_URL}/EmployeeSkills/${employeeName}`)
      .then((res)=>{
        let result = res.json;
        console.log(result);
      });
      setSkills(skills.filter(skill => skill.employeeName !== employeeName));
      alert('Skill deleted successfully');
      resetForm();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Error deleting skill. Please try again.');
    }
   
  };
  const handleSearch = async () => {
    try {
      const response = await axios.axios.get(`${API_URL}/search?q=${searchQuery}`);
      if (response.data.length === 0) {
        console.error('No skills found for the given search query:', searchQuery);
        alert('Employee not found. Please add employee.');
      } else {
        setSkills(response.data);
        setSkillsVisibility(true); // Automatically show the skills when found
      }
    } catch (error) {
      console.error('Error searching skills:', error);
      alert('Error searching skills. Please try again.');
    }
  };
  const resetForm = () => {
    setFormData({
      skill_id: '',
      name: '',
      yearsOfExperience: '',
      proficiency: 'Choose',
      description: '',
    });
    setEmployeeName('');
    setEditingSkill(null);
  };
 
  const yearsOfExperienceOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '10+'];
 
  const calculateProficiency = (experience) => {
    if (experience <= 3) {
      return 'Beginner';
    } else if (experience <= 8) {
      return 'Intermediate';
    } else if (experience === "10+") {
      return 'Advanced';
    } else {
      return 'Advanced';
    }
  };
 
 
  return (
    <div>
      <h2>Skill Mapping</h2>
      <form>
        <label>Search:</label>
        <input
            type="text"
            placeholder="Enter employee name"
            name="searchQuery"
            value={searchQuery}
            onChange={handleInputChange}
        />
        <button type="button" onClick={handleSearch}>Search</button> {/* Moved Search button here */}
 
        <label>Employee Name:</label>
        <input
            type="text"
            placeholder="Enter employee name"
            name="employeeName"
            value={employeeName}
            onChange={handleInputChange}
            required
        />
        <label>Skill ID:</label>
<input
    type="text"
    placeholder="Enter skill ID"
    name="skill_id"
    value={formData.skill_id}
    onChange={handleInputChange}
/>
        <label>Skill:</label>
        <input
          type="text"
          placeholder="Enter skill"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
 
        <label>Years of Experience:</label>
        <select
          value={formData.yearsOfExperience}
          onChange={(e) => {
            const experience = e.target.value;
            setFormData({
              ...formData,
              yearsOfExperience: experience,
              proficiency: calculateProficiency(experience),
            });
          }}
          name="yearsOfExperience"
          required
        >
          <option value="">Choose</option>
          {yearsOfExperienceOptions.map((year) => (
            <option key={year} value={year}>
              {year} {year === 1 ? 'year' : 'years'}
            </option>
          ))}
        </select>
 
        <label>Proficiency:</label>
        <select
          value={formData.proficiency}
          onChange={handleInputChange}
          name="proficiency"
          required
        >
          <option value="">Choose</option>
          <option value="Beginner">Beginner (up to 3 years)</option>
          <option value="Intermediate">Intermediate (between 3 and 8 years)</option>
          <option value="Advanced">Advanced (more than 8 years)</option>
        </select>
 
        <label>Description:</label>
        <textarea
          placeholder="Enter description"
          value={formData.description}
          onChange={handleInputChange}
          name="description"
          rows="2"
        ></textarea>
        {editingSkill ? (
        <button type="button" onClick={handleUpdateSkill}>Update Skill</button>
      ) : (
        <button type="button" onClick={handleAddSkill}>Add Skill</button>
      )}
 
      <br />
     
      <div>
        <button onClick={() => window.location.href = '/Home'}>Back</button>
      </div>
      <div className="skills-list">
  {skillsVisibility && skills.length > 1 && <button onClick={() => setSkillsVisibility(false)}>Hide Skills</button>}
    <br />
    <br />
  {skillsVisibility ? (
    skills.map((skill, index) => (
      <div key={index} className="skill-item">
        <h3>{skill.employeeName}</h3>
        <p><strong>Skill ID:</strong> {skill.skill_id}</p>
        <p><strong>Skill:</strong> {skill.skill_name}</p>
        <p><strong>Years of Experience:</strong> {skill.yearsOfExperience}</p>
        <p><strong>Proficiency:</strong> {skill.proficiency}</p>
        <p><strong>Description:</strong> {skill.description}</p>
       
        <button type="button" onClick={() => handleEditSkill(skill.employeeName)}>Edit</button>
        <br />
        <button onClick={() => handleDeleteSkill(skill.employeeName)}>Delete</button>
      </div>
    ))
  ) : (
    <button onClick={() => setSkillsVisibility(true)}>Show Skills</button>
  )}
</div>
    </form>
  </div>
);
};
export default SkillMapping;