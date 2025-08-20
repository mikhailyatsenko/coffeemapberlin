export default function handler(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(404).json({ error: 'ID parameter required' });
  }
  
  // Redirect to the new URL format without query parameters
  res.redirect(301, `/place/${id}`);
} 