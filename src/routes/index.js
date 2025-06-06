import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/', (req, res) => {
  res.send('Servidor Mousiteca funcionando como un pepino');
});

router.get('/musica', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM musica');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

// Obtener toda la colección personal con joins
router.get('/collections', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        collections.id AS collection_id,
        albums.title AS album_title,
        artists.name AS artist_name,
        albums.release_year,
        albums.genre,
        albums.release_type,
        formats.name AS format_name,
        collections.edition_description,
        collections.condition,
        collections.purchase_date,
        collections.notes,
        collections.cover_image_url
      FROM collections
      JOIN albums ON collections.album_id = albums.id
      JOIN artists ON albums.artist_id = artists.id
      JOIN formats ON collections.format_id = formats.id
      ORDER BY collections.purchase_date DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la colección' });
  }
});

export default router;
