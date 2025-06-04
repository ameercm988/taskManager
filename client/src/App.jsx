import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchTasks = async () => {
    const res = await axios.get(`${process.env.BASEURL}api/tasks`);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    const res = await axios.post(`${process.env.BASEURL}api/tasks`, { title, description });
    setTasks([...tasks, res.data]);
    setTitle('');
    setDescription('');
  };

  const deleteTask = async (id) => {
    await axios.delete(`${process.env.BASEURL}api/tasks/${id}`);
    setTasks(tasks.filter(task => task._id !== id));
  };

  const toggleComplete = async (task) => {
    const res = await axios.put(`${process.env.BASEURL}api/tasks/${task._id}`, {
      completed: !task.completed
    });
    setTasks(tasks.map(t => t._id === task._id ? res.data : t));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <form onSubmit={addTask} className="flex flex-col gap-2 mb-6">
        <input
          className="border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />
        <input
          className="border p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
        />
        <button className="bg-blue-600 text-white py-2 rounded" type="submit">
          Add Task
        </button>
      </form>

      <div className="mb-4 flex gap-2">
        {['all', 'completed', 'pending'].map(type => (
          <button
            key={type}
            className={`py-1 px-3 border rounded ${filter === type ? 'bg-blue-500 text-white' : ''}`}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {filteredTasks.map(task => (
          <li key={task._id} className="bg-white shadow p-3 flex justify-between items-center">
            <div>
              <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task)}
              />
              <button
                className="text-red-500"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
