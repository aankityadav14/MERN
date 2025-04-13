const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  
  // Add the file with the correct field name
  const fileInput = e.target.querySelector('input[type="file"]');
  if (fileInput.files[0]) {
    formData.append('facultyImage', fileInput.files[0]);
  }
  
  // Add other form data
  // ...existing form fields...
  
  try {
    const response = await fetch('/api/faculty/create', {
      method: 'POST',
      body: formData,
    });
    // Handle response
  } catch (error) {
    console.error('Error:', error);
  }
};

return (
  <form encType="multipart/form-data" onSubmit={handleSubmit}>
    {/* ...other form fields... */}
    <input 
      type="file" 
      name="image"
      onChange={handleImageChange}
    />
    {/* ...other form fields... */}
  </form>
);
