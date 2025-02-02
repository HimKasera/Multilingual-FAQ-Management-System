import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const AdminDashboard = () => {
  const [faqs, setFaqs] = useState([]);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    languages: ['en']
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    const response = await fetch('/api/faqs');
    const data = await response.json();
    setFaqs(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    fetchFAQs();
    setFormData({ question: '', answer: '', languages: ['en'] });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">FAQ Management</h1>
      
      {/* Add FAQ Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New FAQ</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Question</label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Answer</label>
            <Editor
              value={formData.answer}
              onEditorChange={(content) => setFormData({...formData, answer: content})}
              init={{
                height: 300,
                menubar: false,
                plugins: ['lists', 'link', 'table', 'code', 'help', 'wordcount'],
                toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent'
              }}
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Languages</label>
            <select
              multiple
              value={formData.languages}
              onChange={(e) => setFormData({
                ...formData,
                languages: Array.from(e.target.selectedOptions, option => option.value)
              })}
              className="w-full p-2 border rounded"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="bn">Bengali</option>
            </select>
          </div>
          
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add FAQ
          </button>
        </form>
      </div>
      
      {/* FAQ List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing FAQs</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq._id} className="border-b pb-4">
              <h3 className="font-semibold">{faq.question}</h3>
              <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
              <div className="mt-2 text-sm text-gray-500">
                Languages: {faq.languages.join(', ')}
              </div>
              <div className="mt-2">
                <button
                  onClick={() => handleDelete(faq._id)}
                  className="text-red-500 mr-2"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEdit(faq)}
                  className="text-blue-500"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;