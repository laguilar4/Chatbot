import { pool } from '../config/db.js';

const ALL_COLUMNS = 'id, option_number, question, answer, is_active, created_at, updated_at';

/** Convierte una fila snake_case de MySQL a un objeto camelCase para la API. */
const toEntity = (row) => ({
  id: row.id,
  optionNumber: row.option_number,
  question: row.question,
  answer: row.answer,
  ...(row.is_active !== undefined && { isActive: Boolean(row.is_active) }),
  ...(row.created_at && { createdAt: row.created_at }),
  ...(row.updated_at && { updatedAt: row.updated_at }),
});

// Todas las consultas usan sentencias preparadas (pool.execute + ?) para evitar SQL Injection.
export const questionRepository = {
  async findActive() {
    const [rows] = await pool.execute(
      `SELECT id, option_number, question, answer
       FROM questions
       WHERE is_active = 1
       ORDER BY option_number ASC`,
    );
    return rows.map(toEntity);
  },

  async findAll() {
    const [rows] = await pool.execute(`SELECT ${ALL_COLUMNS} FROM questions ORDER BY option_number ASC`);
    return rows.map(toEntity);
  },

  async findById(id) {
    const [rows] = await pool.execute(`SELECT ${ALL_COLUMNS} FROM questions WHERE id = ?`, [id]);
    return rows[0] ? toEntity(rows[0]) : null;
  },

  async create({ optionNumber, question, answer, isActive }) {
    const [result] = await pool.execute(
      'INSERT INTO questions (option_number, question, answer, is_active) VALUES (?, ?, ?, ?)',
      [optionNumber, question, answer, isActive ? 1 : 0],
    );
    return result.insertId;
  },

  async update(id, { optionNumber, question, answer, isActive }) {
    const [result] = await pool.execute(
      'UPDATE questions SET option_number = ?, question = ?, answer = ?, is_active = ? WHERE id = ?',
      [optionNumber, question, answer, isActive ? 1 : 0, id],
    );
    return result.affectedRows > 0;
  },

  async remove(id) {
    const [result] = await pool.execute('DELETE FROM questions WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};
