import { useEffect, useState } from "react";
import axios from "axios";

function Students({ onLogout }) {
  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [className, setClassName] = useState("");

  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/students"
      );

      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !age || !className) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/students/${editingId}`,
          {
            name,
            age,
            className,
          }
        );

        alert("Student updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/students",
          {
            name,
            age,
            className,
          }
        );

        alert("Student added successfully");
      }

      clearForm();
      fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error);
      alert("Something went wrong");
    }
  };

  const handleEdit = (student) => {
    setName(student.name);
    setAge(student.age);
    setClassName(student.className);
    setEditingId(student._id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/students/${id}`
      );

      alert("Student deleted successfully");

      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student");
    }
  };

  const clearForm = () => {
    setName("");
    setAge("");
    setClassName("");
    setEditingId(null);
  };

  return (
    <div className="dashboard">

      <header className="navbar">
        <h2>Students ({students.length})</h2>

        <button onClick={onLogout}>
          Logout
        </button>
      </header>

      <div className="content">

        <div className="form-card">

          <h2>
            {editingId ? "Edit Student" : "Add Student"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Student Name</label>

              <input
                type="text"
                placeholder="Enter student name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Age</label>

              <input
                type="number"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Class</label>

              <input
                type="text"
                placeholder="Enter class"
                value={className}
                onChange={(e) =>
                  setClassName(e.target.value)
                }
              />
            </div>

            <button type="submit">
              {editingId ? "Update Student" : "Add Student"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-button"
                onClick={clearForm}
              >
                Cancel
              </button>
            )}

          </form>

        </div>

        <div className="students-card">

          <h2>Student List</h2>

          {students.length === 0 ? (
            <p>No students found.</p>
          ) : (
            <table>

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Class</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {students.map((student) => (
                  <tr key={student._id}>

                    <td>{student.name}</td>

                    <td>{student.age}</td>

                    <td>{student.className}</td>

                    <td>

                      <button
                        className="edit-button"
                        onClick={() =>
                          handleEdit(student)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(student._id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          )}

        </div>

      </div>

    </div>
  );
}

export default Students;