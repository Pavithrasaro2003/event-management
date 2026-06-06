import React, { useState, useEffect } from 'react';
import { getOrganizers, createOrganizer, updateOrganizer, deleteOrganizer } from '../../services/admin.service';

const ManageOrganizers = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState(''); // Optional

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const fetchOrganizers = async () => {
    try {
      const data = await getOrganizers();
      setOrganizers(data);
    } catch (err) {
      console.error("Failed to fetch organizers:", err);
    } finally {
      setLoading(false);
    }
  };

  // CREATE
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOrganizer({ name, email, password });
      setMessage('Organizer created successfully!');
      setName('');
      setEmail('');
      setPassword('');
      fetchOrganizers(); // Refresh list
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || err.response?.data?.error || 'Failed to create organizer');
    }
  };

  // START EDIT
  const handleEditClick = (org) => {
    setEditingId(org.id);
    setEditName(org.name);
    setEditEmail(org.email);
    setEditPassword(''); // Leave blank unless they want to change it
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditEmail('');
    setEditPassword('');
  };

  // UPDATE
  const handleUpdateSubmit = async (id) => {
    try {
      const updateData = { name: editName, email: editEmail };
      if (editPassword) {
        updateData.password = editPassword;
      }
      
      await updateOrganizer(id, updateData);
      setEditingId(null);
      fetchOrganizers(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update organizer');
    }
  };

  // DELETE
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this organizer? This will also delete their events and bookings.")) {
      try {
        await deleteOrganizer(id);
        fetchOrganizers(); // Refresh list
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete organizer');
      }
    }
  };

  return (
    <div>
      <h2>Manage Organizers</h2>
      <hr />
      
      {/* Create Section */}
      <div className="card mt-4 shadow-sm">
        <div className="card-header bg-light">
          <h5 className="mb-0">Create New Organizer</h5>
        </div>
        <div className="card-body">
          {message && (
            <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleCreateSubmit}>
            <div className="row align-items-end">
              <div className="col-md-3 mb-3">
                <label className="form-label text-muted small fw-bold">Name</label>
                <input type="text" className="form-control" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label text-muted small fw-bold">Email</label>
                <input type="email" className="form-control" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label text-muted small fw-bold">Password</label>
                <input type="password" className="form-control" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="col-md-2 mb-3">
                <button type="submit" className="btn btn-success w-100">Create</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* List Section */}
      <div className="card mt-4 shadow-sm">
        <div className="card-header bg-light">
          <h5 className="mb-0">Registered Organizers</h5>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center p-4">Loading organizers...</div>
          ) : organizers.length === 0 ? (
            <div className="text-center p-4 text-muted">No organizers found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="px-4">ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th className="text-end px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {organizers.map((org) => (
                    <tr key={org.id}>
                      {editingId === org.id ? (
                        /* Edit Row */
                        <>
                          <td className="px-4">{org.id}</td>
                          <td>
                            <input type="text" className="form-control form-control-sm" value={editName} onChange={(e) => setEditName(e.target.value)} required />
                          </td>
                          <td>
                            <input type="email" className="form-control form-control-sm" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required />
                          </td>
                          <td>
                            <input type="password" className="form-control form-control-sm" placeholder="Leave blank to keep" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} />
                          </td>
                          <td className="text-end px-4">
                            <button className="btn btn-sm btn-primary me-2" onClick={() => handleUpdateSubmit(org.id)}>Save</button>
                            <button className="btn btn-sm btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                          </td>
                        </>
                      ) : (
                        /* Read Row */
                        <>
                          <td className="px-4 text-muted">#{org.id}</td>
                          <td className="fw-semibold">{org.name}</td>
                          <td>{org.email}</td>
                          <td className="text-muted fst-italic">••••••••</td>
                          <td className="text-end px-4">
                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditClick(org)}>
                              Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(org.id)}>
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ManageOrganizers;
