export const generateId = () => {
  return crypto.randomUUID()
}

export const getCurrentTimestamp = () => {
  return new Date().toISOString()
}

export const executeSql = async (db, query, params = []) => {
  try {
    const stmt = db.prepare(query)
    const result = await stmt.bind(...params).all()
    return result
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
}

export const getOne = async (db, query, params = []) => {
  const result = await executeSql(db, query, params)
  return result.results[0] || null
}

export const getAll = async (db, query, params = []) => {
  const result = await executeSql(db, query, params)
  return result.results || []
}

export const insert = async (db, table, data) => {
  const columns = Object.keys(data)
  const values = Object.values(data)
  const placeholders = columns.map(() => '?').join(', ')
  
  const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`
  
  try {
    await executeSql(db, query, values)
    return true
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error)
    return false
  }
}

export const update = async (db, table, data, where, whereParams = []) => {
  const columns = Object.keys(data)
  const values = Object.values(data)
  const setClause = columns.map(col => `${col} = ?`).join(', ')
  
  const query = `UPDATE ${table} SET ${setClause} WHERE ${where}`
  
  try {
    await executeSql(db, query, [...values, ...whereParams])
    return true
  } catch (error) {
    console.error(`Error updating ${table}:`, error)
    return false
  }
}